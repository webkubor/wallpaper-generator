<template>
  <div class="changelog-page">
    <section class="hero">
      <span class="hero-tag">更新日志</span>
      <h1>每一次更新，都让创作更顺手</h1>
      <p>按版本聚合，快速了解新增与优化内容。</p>
    </section>

    <section v-if="sections.length" class="changelog-list">
      <article v-for="section in sections" :key="section.version" class="changelog-card">
        <header class="card-header">
          <div class="version-block">
            <span class="version-badge">{{ section.version }}</span>
            <span class="version-date">{{ section.dateLabel }}</span>
          </div>
          <span class="version-total">共 {{ section.total }} 项更新</span>
        </header>

        <div class="card-body">
          <div v-for="group in section.groups" :key="group.label" class="group">
            <div class="group-title">
              <span class="group-dot" :class="group.tone"></span>
              <span class="group-name">{{ group.label }}</span>
              <span class="group-count">{{ group.items.length }}</span>
            </div>
            <ul class="group-list">
              <li v-for="(item, index) in group.items" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
      </article>
    </section>

    <div v-else class="empty-state">
      <div class="empty-title">暂无更新内容</div>
      <p>请稍后再来查看。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import changelogRaw from '../../../CHANGELOG.md?raw'

type GroupTone = 'feature' | 'fix' | 'chore' | 'translation' | 'other'

interface ChangelogGroup {
  label: string
  tone: GroupTone
  items: string[]
}

interface ChangelogSection {
  version: string
  dateLabel: string
  total: number
  groups: ChangelogGroup[]
}

// 分类映射表，保持与 CHANGELOG 标题一致
const categoryMap: Record<string, { label: string; tone: GroupTone }> = {
  '⚡ Features': { label: '功能', tone: 'feature' },
  '🐞 Bug Fixes': { label: '修复', tone: 'fix' },
  '🛠 Remove/Chore': { label: '重构/维护', tone: 'chore' },
  '🌐 Translations': { label: '翻译', tone: 'translation' },
  '📦 Other/Merge': { label: '其他', tone: 'other' }
}

// 将月份转成版本号样式，例如 2025-09 -> v2025.09
const formatVersion = (month: string) => `v${month.replace('-', '.')}`

// 清理提交行中的日期与作者信息，只保留功能描述
const cleanEntry = (line: string) => {
  const withoutMeta = line.replace(
    /^-\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+\[[^\]]+\]\s+\[[^\]]+\]\s+/,
    ''
  )
  return withoutMeta
    .replace(/^(feat|fix|chore|refactor|style|docs|remove|other)\s*:?[\s-]*/i, '')
    .trim()
}

// 解析 CHANGELOG.md 内容为页面数据
const parseChangelog = (content: string): ChangelogSection[] => {
  const lines = content.split(/\r?\n/)
  const sections: ChangelogSection[] = []
  let currentSection: ChangelogSection | null = null
  let currentGroup: ChangelogGroup | null = null

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+(\d{4}-\d{2})/)
    if (sectionMatch) {
      currentSection = {
        version: formatVersion(sectionMatch[1]),
        dateLabel: sectionMatch[1],
        total: 0,
        groups: []
      }
      sections.push(currentSection)
      currentGroup = null
      continue
    }

    const groupMatch = line.match(/^###\s+(.+)/)
    if (groupMatch && currentSection) {
      const rawLabel = groupMatch[1].trim()
      const mapped = categoryMap[rawLabel]
      if (mapped) {
        currentGroup = {
          label: mapped.label,
          tone: mapped.tone,
          items: []
        }
        currentSection.groups.push(currentGroup)
      } else {
        currentGroup = null
      }
      continue
    }

    if (line.startsWith('- ') && currentGroup && currentSection) {
      const cleaned = cleanEntry(line)
      if (cleaned) {
        currentGroup.items.push(cleaned)
        currentSection.total += 1
      }
    }
  }

  return sections
}

const sections = parseChangelog(changelogRaw)
</script>

<style scoped lang="scss">
.changelog-page {
  min-height: 100%;
  padding: 32px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
  background: radial-gradient(circle at top right, rgba(244, 208, 63, 0.15), transparent 55%),
    radial-gradient(circle at 10% 20%, rgba(255, 154, 86, 0.12), transparent 45%),
    var(--n-body-color);
}

.hero {
  padding: 28px 32px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(244, 208, 63, 0.2);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(18px);
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(244, 208, 63, 0.15);
  color: #f4d03f;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}

.hero h1 {
  font-size: 26px;
  margin: 0 0 8px;
  color: var(--n-text-color);
}

.hero p {
  margin: 0;
  font-size: 14px;
  color: var(--n-text-color);
  opacity: 0.7;
}

.changelog-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.changelog-card {
  padding: 24px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(244, 208, 63, 0.18);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.version-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.version-badge {
  padding: 6px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.25), rgba(255, 154, 86, 0.2));
  color: #f4d03f;
  font-weight: 700;
  font-size: 14px;
}

.version-date {
  font-size: 13px;
  color: var(--n-text-color);
  opacity: 0.6;
}

.version-total {
  font-size: 13px;
  color: var(--n-text-color);
  opacity: 0.6;
}

.card-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.group {
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--n-text-color);
  margin-bottom: 10px;
}

.group-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.group-dot.feature { background: #f4d03f; }
.group-dot.fix { background: #38bdf8; }
.group-dot.chore { background: #f97316; }
.group-dot.translation { background: #34d399; }
.group-dot.other { background: #a3a3a3; }

.group-count {
  margin-left: auto;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: var(--n-text-color);
  opacity: 0.7;
}

.group-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  font-size: 13px;
  color: var(--n-text-color);
  opacity: 0.75;
}

.group-list li {
  line-height: 1.5;
}

.empty-state {
  padding: 40px;
  border-radius: 18px;
  text-align: center;
  border: 1px dashed rgba(244, 208, 63, 0.3);
  color: var(--n-text-color);
  opacity: 0.7;
}

.empty-title {
  font-size: 18px;
  color: var(--n-text-color);
  margin-bottom: 8px;
  opacity: 1;
}

@media (max-width: 768px) {
  .changelog-page {
    padding: 24px 16px 36px;
  }

  .hero {
    padding: 20px 18px;
  }

  .card-body {
    grid-template-columns: 1fr;
  }
}
</style>
