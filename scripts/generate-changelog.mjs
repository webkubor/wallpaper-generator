#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const changelogPath = path.join(projectRoot, 'CHANGELOG.md');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

// 解析命令行参数 --branch=<name>
function getArgBranch() {
  const arg = process.argv.find((a) => a.startsWith('--branch='));
  if (!arg) return '';
  return arg.slice('--branch='.length);
}

// 判断某个 ref 是否存在
function refExists(ref) {
  try {
    run(`git rev-parse --verify ${ref}`);
    return true;
  } catch {
    return false;
  }
}

// 解析日志参考 ref：优先 cli 参数 > 环境变量 > 默认 main；优先远端 origin/<branch>
function resolveTargetRef() {
  let desired = getArgBranch() || process.env.CHANGELOG_BRANCH || 'main';
  // 兼容仍停在 master 的老 clone（2026-08-20 主干已改名 main）
  if (!refExists(desired) && desired === 'main' && refExists('master')) {
    desired = 'master';
  }
  const remoteRef = `origin/${desired}`;
  if (refExists(remoteRef)) return remoteRef;
  if (refExists(desired)) return desired;
  const fallbacks = ['origin/main', 'main', 'origin/master', 'master'];
  for (const fb of fallbacks) {
    if (refExists(fb)) return fb;
  }
  return 'HEAD';
}

const targetRef = resolveTargetRef();

function parseGitLog() {
  // 格式：日期<TAB>SHA<TAB>作者<TAB>subject
  const log = run(`git log ${targetRef} --first-parent --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%ad%x09%H%x09%an%x09%s'`);
  const lines = log.split(/\r?\n/).filter(Boolean);
  return lines.map((line) => {
    const [date, hash, author, ...rest] = line.split('\t');
    const subject = (rest.join('\t') || '').trim();
    return { date, hash, author, subject };
  });
}

// 忽略规则：包含以下关键词的提交会被过滤
const defaultIgnoreKeywords = [
  '暂时提交',
  '提交测试',
  '提交更新',
];

function buildIgnoreRegex() {
  const extra = (process.env.CHANGELOG_IGNORE || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const all = [...defaultIgnoreKeywords, ...extra]
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex
  if (!all.length) return null;
  return new RegExp(all.join('|'));
}

const ignoreRegex = buildIgnoreRegex();

function shouldIgnore(subject) {
  if (!ignoreRegex) return false;
  return ignoreRegex.test(subject);
}

 function classify(subject) {
  const s = subject.toLowerCase();
  if (s.startsWith('feat')) return 'feat';
  if (s.startsWith('fix') || s.startsWith('fxied') || s.startsWith('fixed')) return 'fix';
  if (s.startsWith('remove') || s.startsWith('chore') || s.startsWith('refactor')) return 'chore';
  if (s.startsWith('merge')) return 'other';
  return 'other';
}

function shortHash(hash) {
  return hash.slice(0, 7);
}

// 统计中文字符数量
function countChinese(text) {
  const matches = (text || '').match(/[\u4e00-\u9fff]/g);
  return matches ? matches.length : 0;
}

// 去除 feat 前缀和常见分隔符
function stripFeatPrefix(subject) {
  return subject
    .replace(/^feat\s*:?/i, '')
    .replace(/^\s+/, '');
}

function groupByMonth(commits) {
  const map = new Map(); // key: YYYY-MM -> { feat:[], fix:[], chore:[], other:[] }
  for (const c of commits) {
    if (shouldIgnore(c.subject)) continue;
    // 过滤：feat 且中文少于 4 个
    const cls = classify(c.subject);
    if (cls === 'feat') {
      const rest = stripFeatPrefix(c.subject);
      if (countChinese(rest) < 4) continue;
    }
    const ym = c.date.slice(0, 7);
    if (!map.has(ym)) {
      map.set(ym, { feat: [], fix: [], chore: [], other: [] });
    }
    map.get(ym)[cls].push(c);
  }
  // 转为降序的数组（最近的月份在前）
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([ym, cats]) => ({ ym, cats }));
}

function render(chunks) {
  const displayBranch = String(targetRef).replace(/^origin\//, '');
  const isProd = displayBranch === 'main';
  const branchInfo = `来源分支: ${displayBranch}${isProd ? '（线上分支）' : ''}  | 实际引用: ${targetRef}`;

  const header = `# 更新日志（CHANGELOG）\n\n${branchInfo}\n\n由Git提交记录自动汇总，按月份（YYYY-MM）分组，分类展示主要类型：\n- 功能（feat）\n- 修复（fix）\n- 移除/重构（remove/chore）\n- 其他（other/merge）\n\n---\n`;

  const sectionTitle = {
    feat: '### 功能（feat）',
    fix: '### 修复（fix）',
    chore: '### 移除/重构（remove/chore）',
    other: '### 其他（other/merge）',
  };

  const lines = [header];

  for (const { ym, cats } of chunks) {
    lines.push(`\n## ${ym}\n`);
    for (const key of ['feat', 'fix', 'chore', 'other']) {
      const arr = cats[key];
      if (!arr.length) continue;
      lines.push(`\n${sectionTitle[key]}`);
      for (const c of arr) {
        // 在每一项前加入日期 YYYY-MM-DD HH:MM:SS，并显示作者
        lines.push(`- ${c.date} ${shortHash(c.hash)} [${c.author}] ${c.subject.replace(/^\s+/, '')}`);
      }
    }
  }

  return lines.join('\n');
}

function main() {
  try {
    // 确保在 git 仓库中
    run('git rev-parse --is-inside-work-tree');
  } catch (e) {
    console.error('当前目录不是 Git 仓库，无法生成更新日志。');
    process.exit(1);
  }

  const commits = parseGitLog();
  if (!commits.length) {
    console.error('未找到任何提交。');
    process.exit(1);
  }

  const grouped = groupByMonth(commits);
  const content = render(grouped);
  fs.writeFileSync(changelogPath, content, 'utf8');
  console.log(`已生成/更新: ${path.relative(projectRoot, changelogPath)}`);
}

main();
