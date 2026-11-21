# 氛围壁纸工坊 — 现状设计记录

> 由代码反推，未经 owner 确认。`impeccable extract` 实测不可用（Unknown command），以下据现有代码记录，不代表重新选择设计方向。

## 色系与 tokens

色系来源：`public/logo.svg` 的 `#3f3a36`（墨色）、`#9aa7a1`（鼠尾草）、`#c4b2a3`（陶土）、`#f5f1ea`（纸色）。当前 `src/styles/theme.scss` 与这四色一致，是现有 CSS token 真源；保留原值。

- 默认浅色莫兰迪纸面；`[data-theme="dark"]` 覆盖同名 tokens。
- 全局字体与容器来自 `src/styles/global.scss`，字体首选 AlimamaFangYuanTiVF-Thin；容器 max-width 1200px。
- 产品用于生成和预览壁纸；既有画布/模板色值属于内容数据，不在本轮修改。

## 工程配套

- `contrast.config.json` 检查 theme.scss 的文字/背景配对；`pnpm contrast:check`。静态检查只提取首次定义，暗色覆盖仍需浏览器验证。
- agentEyes dev 遥测写入 `log/`，不提交；生产错误尚无本轮新增上报。
- agentGuard block + designTokens（theme.scss 为 token 文件）；pre-commit 串回全局凭据扫描。生成钩子含本机路径，不入库。local hooksPath 使用主检出 `.git/hooks` 绝对路径，由启动 dev 安装。
- 修改 UI 前先读本文件，并执行 `cs skill show ui-design`。

## 待确认与遗留

本草稿风格结论待 owner 确认；存量组件硬编码色值未批量收敛，视觉方向、版式与配色均未改。暗色对比度与真实浏览器验收尚未完成。
