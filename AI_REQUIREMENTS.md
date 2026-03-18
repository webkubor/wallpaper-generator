# AI 需求文档

## 2026-01-13
- PWA 改造：接入 vite-plugin-pwa、补齐更新与离线提示、安装与 iOS 引导、生成 PWA 图标与 manifest 配置、同步入口图标与清单链接。

## 2026-01-13
- Vercel 部署配置：新增 vercel.json 并调整 Vite base 适配 Vercel 构建环境。
- 修复构建：补充 workbox-window 依赖，解决 vite-plugin-pwa 构建时缺包。

- [2026-01-14] v0.0.1: 优化 Vercel 缓存策略 (Cache-Control)

## 2026-03-15
- AI 原生化改造 (WebMCP)：
  - 接入 WebMCP 协议，在 `index.html` 注入探测桩。
  - 创建 `src/utils/webmcp.ts` 运行时，将 Vue 响应式状态映射至 `window.mcp`。
  - 定义 `get_config`, `update_config`, `export_wallpaper` 等工具集。
  - 通过 `App.vue` 同步预览 DOM，使 AI 具备物理截图能力。
  - 新增 `llms.txt` 供 AI 代理快速理解项目架构。
