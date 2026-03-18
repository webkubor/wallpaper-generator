# 更新日志（CHANGELOG）

来源分支: main  | 实际引用: origin/main

由Git提交记录自动汇总，按月份（YYYY-MM）分组，分类展示主要类型：
- 功能（feat）
- 修复（fix）
- 移除/重构（remove/chore）
- 其他（other/merge）

---

## 2026-03


### 功能（feat）
- 2026-03-18 17:40:00 [Kimi Code] feat: 新增 AI 助手 UI 组件，支持一键复制 Prompt 和查看可用工具
- 2026-03-18 17:35:00 [Kimi Code] feat: WebMCP 新增 apply_template 工具，支持一键应用 5 种预设风格模板
- 2026-03-18 17:30:00 [Kimi Code] feat: WebMCP 新增 set_watermark_position 工具，支持精确设置水印位置
- 2026-03-18 17:25:00 [Kimi Code] feat: WebMCP 新增 get_available_templates/get_available_fonts 工具
- 2026-03-18 17:20:00 [Kimi Code] feat: 完善 WebMCP 协议元数据，增加 agent_guidelines 和示例
- 2026-03-15 12:00:00 [Gemini] feat: 接入 WebMCP 协议实现 AI 原生化改造 (AI-Native)
- 2026-03-15 12:10:00 [Gemini] feat: 支持通过 AI 代理自动修改壁纸文字、背景与一键导出
- 2026-03-15 12:15:00 [Gemini] feat: 新增 llms.txt 项目索引，优化 AI 对项目结构的感知速度

### 文档（docs）
- 2026-03-18 17:45:00 [Kimi Code] docs: 更新 README.md，完善 AI 使用指南和 WebMCP 接入文档
- 2026-03-18 17:50:00 [Kimi Code] docs: 更新版本号至 0.3.0

---

## 2026-01


### 修复（fix）
- 2026-01-25 13:27:24 969721e [webkubor] fix: cleanup remaining naive-ui residues in templates and lockfile
- 2026-01-25 13:24:10 49f8e2f [webkubor] fix: remove naive-ui residues and types, fully decouple from legacy framework
- 2026-01-25 13:01:11 1e73a6a [webkubor] fix: ensure exclusive rendering of watermark image or text based on type
- 2026-01-25 12:57:21 44bcd80 [webkubor] fix: sync watermark image upload with display state
- 2026-01-25 12:50:06 501fdd9 [webkubor] fix: watermark image upload error by using client-side FileReader

### 移除/重构（remove/chore）
- 2026-01-25 13:30:03 d2bb590 [webkubor] chore: update UI framework todo
- 2026-01-25 13:20:12 802d02b [webkubor] refactor: remove Naive UI framework and implement custom base components (headless UI)
- 2026-01-25 12:53:39 6315843 [webkubor] refactor: extract FileUploader component and replace n-upload in WatermarkSettings
- 2026-01-14 11:31:42 e93346a [webkubor] chore(release): v0.0.1
- 2026-01-14 10:27:04 e605782 [webkubor] chore: add .gitignore and initial requirements

### 其他（other/merge）
- 2026-01-15 18:49:13 db5140f [webkubor] docs(readme): add feature index for easier navigation
- 2026-01-14 10:29:14 ac2289b [webkubor] merge: merge origin/master into main, resolving conflicts using theirs (master)

## 2025-09


### 其他（other/merge）
- 2025-09-04 08:55:35 3c38093 [webkubor] Initial commit
