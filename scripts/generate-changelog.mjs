#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const changelogPath = path.join(projectRoot, 'CHANGELOG.md');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function getArgBranch() {
  const arg = process.argv.find((a) => a.startsWith('--branch='));
  if (!arg) return '';
  return arg.slice('--branch='.length);
}

function refExists(ref) {
  try {
    run(`git rev-parse --verify ${ref}`);
    return true;
  } catch {
    return false;
  }
}

function resolveTargetRef() {
  let desired = getArgBranch() || process.env.CHANGELOG_BRANCH || 'master';
  if (!refExists(desired) && desired === 'master' && refExists('main')) desired = 'main';
  const remoteRef = `origin/${desired}`;
  if (refExists(remoteRef)) return remoteRef;
  if (refExists(desired)) return desired;
  const fallbacks = ['origin/master', 'master', 'origin/main', 'main'];
  for (const fb of fallbacks) if (refExists(fb)) return fb;
  return 'HEAD';
}

const targetRef = resolveTargetRef();

function parseGitLog() {
  const log = run(`git log ${targetRef} --first-parent --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%ad%x09%H%x09%an%x09%s'`);
  return log.split(/\r?\n/).filter(Boolean).map(line => {
    const [date, hash, author, ...rest] = line.split('\t');
    return { date, hash, author, subject: (rest.join('\t') || '').trim() };
  });
}

const defaultIgnoreKeywords = ['暂时提交','提交测试','提交更新'];

function buildIgnoreRegex() {
  const extra = (process.env.CHANGELOG_IGNORE || '').split(',').map(s=>s.trim()).filter(Boolean);
  const all = [...defaultIgnoreKeywords,...extra].map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  return all.length ? new RegExp(all.join('|')) : null;
}

const ignoreRegex = buildIgnoreRegex();
function shouldIgnore(subject) { return ignoreRegex ? ignoreRegex.test(subject) : false; }

function classify(subject) {
  const s = subject.toLowerCase();
  if (s.startsWith('feat')) return 'feat';
  if (s.startsWith('fix') || s.startsWith('fixed')) return 'fix';
  if (s.startsWith('chore') || s.startsWith('remove') || s.startsWith('refactor')) return 'chore';
  if (s.includes('translate') || s.includes('i18n')) return 'translation';
  return 'other';
}

function shortHash(hash) { return hash.slice(0,7); }

function stripFeatPrefix(subject) { return subject.replace(/^feat\s*:?/i,'').trim(); }

function groupByMonth(commits) {
  const map = new Map();
  for (const c of commits) {
    if (shouldIgnore(c.subject)) continue;
    const cls = classify(c.subject);
    const ym = c.date.slice(0,7);
    if (!map.has(ym)) map.set(ym, { feat:[], fix:[], chore:[], translation:[], other:[] });
    map.get(ym)[cls].push(c);
  }
  return Array.from(map.entries())
    .sort((a,b)=>a[0]<b[0]?1:-1)
    .map(([ym,cats])=>({ ym, cats }));
}

function render(chunks) {
  const displayBranch = String(targetRef).replace(/^origin\//,'');
  const isProd = displayBranch==='master';
  const branchInfo = `来源分支: ${displayBranch}${isProd?'（线上分支）':''}  | 实际引用: ${targetRef}`;
  const header = `# 更新日志（CHANGELOG）\n\n${branchInfo}\n\n由Git提交记录自动汇总，按月份分组并分类展示：\n- ⚡ 功能（feat）\n- 🐞 修复（fix）\n- 移除/重构（remove/chore）\n- 🌐 翻译（translation）\n- 其他（other/merge）\n\n---\n`;

  const sectionTitle = {
    feat: '⚡ Features',
    fix: '🐞 Bug Fixes',
    chore: '🛠 Remove/Chore',
    translation: '🌐 Translations',
    other: '📦 Other/Merge',
  };

  const lines = [header];

  for (const { ym, cats } of chunks) {
    lines.push(`\n## ${ym}\n`);
    for (const key of ['feat','fix','chore','translation','other']) {
      const arr = cats[key];
      if (!arr.length) continue;
      lines.push(`\n### ${sectionTitle[key]}`);
      for (const c of arr) {
        // 保留 commit 中的 #PR
        lines.push(`- ${c.date} [${shortHash(c.hash)}] [${c.author}] ${c.subject}`);
      }
    }
  }

  return lines.join('\n');
}

function main() {
  try { run('git rev-parse --is-inside-work-tree'); } 
  catch(e){ console.error('当前目录不是 Git 仓库'); process.exit(1); }

  const commits = parseGitLog();
  if (!commits.length){ console.error('未找到任何提交'); process.exit(1); }

  const grouped = groupByMonth(commits);
  const content = render(grouped);
  fs.writeFileSync(changelogPath, content, 'utf8');
  console.log(`已生成/更新: ${path.relative(projectRoot,changelogPath)}`);
}

main();