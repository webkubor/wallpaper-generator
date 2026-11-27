# 氛围壁纸工坊 — 现状设计记录

> 由代码反推，未经 owner 确认。`impeccable extract` 实测不可用（Unknown command），以下据现有代码记录，不代表重新选择设计方向。

## 色系与 tokens

应用界面的墨色、鼠尾草、陶土和纸色来自 `src/styles/theme.scss`。品牌标识单独使用已确认的青柚绿，其渐变色值为 `#CBF381`、`#A3EA85`、`#69DCA3`。

- 默认浅色莫兰迪纸面；`[data-theme="dark"]` 覆盖同名 tokens。
- 全局字体与容器来自 `src/styles/global.scss`，字体首选 AlimamaFangYuanTiVF-Thin；容器 max-width 1200px。
- 产品用于生成和预览壁纸；既有画布/模板色值属于内容数据，不在本轮修改。

## 品牌标识

2026-11-27 定稿。用画幅内的一道风线表现壁纸工坊的氛围感。透明标识存放于 `public/brand-mark.svg`，使用深色展示底。标签页、项目首页和安装图标使用 `public/logo.svg` 的 `#2B2A27` 深色底，标识路径与渐变沿用母版。用 `pnpm generate-icons` 更新 192px 和 512px 安装图标。

## 工程配套

- `contrast.config.json` 检查 theme.scss 的文字/背景配对；`pnpm contrast:check`。静态检查只提取首次定义，暗色覆盖仍需浏览器验证。
- agentEyes dev 遥测写入 `log/`，不提交；生产错误尚无本轮新增上报。
- agentGuard block + designTokens（theme.scss 为 token 文件）；pre-commit 串回全局凭据扫描。生成钩子含本机路径，不入库。local hooksPath 使用主检出 `.git/hooks` 绝对路径，由启动 dev 安装。
- 修改 UI 前先读本文件，并执行 `cs skill show ui-design`。

## 待确认与遗留

本草稿风格结论待 owner 确认；存量组件硬编码色值未批量收敛，视觉方向、版式与配色均未改。暗色对比度与真实浏览器验收尚未完成。
