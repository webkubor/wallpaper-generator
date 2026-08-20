# 更新日志（CHANGELOG）

来源分支: main（线上分支）  | 实际引用: origin/main

由Git提交记录自动汇总，按月份（YYYY-MM）分组，分类展示主要类型：
- 功能（feat）
- 修复（fix）
- 移除/重构（remove/chore）
- 其他（other/merge）

---


## 2026-08


### 功能（feat）
- 2026-08-18 14:40:26 7f01b85 [webkubor] feat: 为英文 README 添加开源徽章（license/CI/release）

### 修复（fix）
- 2026-08-18 14:43:57 318acfb [webkubor] fix(ci): 修复 release 步骤多行输出错误，用布尔值代替 commit 列表
- 2026-08-18 14:36:01 bb861d0 [webkubor] fix(ci): pnpm-workspace.yaml 补 packages 字段解决 CI setup-node cache 报错 [skip ci]

### 移除/重构（remove/chore）
- 2026-08-18 14:11:58 d07556a [webkubor] chore: 开源发布准备
- 2026-08-10 14:59:39 510d44b [webkubor] chore(deps): upgrade to Vite 8 + vue-router 5 + unplugin 21/32 (TS6)

### 其他（other/merge）
- 2026-08-20 21:10:40 bafacb1 [webkubor] ci: 主干分支 master 改名 main，同步全部引用
- 2026-08-18 06:45:28 40da73b [webkubor] docs: auto-update CHANGELOG [skip ci]
- 2026-08-18 06:41:19 9bd22c3 [webkubor] docs: auto-update CHANGELOG [skip ci]
- 2026-08-18 06:37:43 e5b1f23 [webkubor] docs: auto-update CHANGELOG [skip ci]
- 2026-08-18 14:33:24 9cd794a [webkubor] ci: 添加自动化发布 workflow（build + CHANGELOG + Release）
- 2026-08-12 14:39:24 d2ae961 [webkubor] security: 从 git 移除 .env（含 Gemini API Key），补 .gitignore 规则

## 2026-01


### 功能（feat）
- 2026-01-13 19:00:32 d7b5ab4 [webkubor] Feat 提交莫兰迪色系优化

### 修复（fix）
- 2026-01-14 09:30:00 144998e [webkubor] Fix XHS cover navigation and update PWA/versioning
- 2026-01-13 19:17:59 66a405b [webkubor] fix export clone placement

### 移除/重构（remove/chore）
- 2026-01-06 13:50:23 776f2f4 [webkubor] refactor(types): 将类型定义文件移动到src/types目录并更新配置

### 其他（other/merge）
- 2026-01-13 19:54:37 bbb920e [webkubor] 提交修改 banner
- 2026-01-13 19:54:26 f09e3e8 [webkubor] 提交修改版本
- 2026-01-13 19:24:23 d051716 [webkubor] switch capture to dom-to-image-more
- 2026-01-13 19:19:13 bef6992 [webkubor] restore export scale handling
- 2026-01-13 19:15:56 c655398 [webkubor] refine toolbar header actions
- 2026-01-13 18:41:31 b4b9109 [webkubor] UI 提交

## 2025-09


### 功能（feat）
- 2025-09-10 10:20:28 89690fe [webkubor] feat  自适应裁减问题
- 2025-09-10 10:13:30 8e4bf61 [webkubor] feat 融合配置
- 2025-09-08 09:39:25 42482d7 [webkubor] feat(标题设置): 添加字体大小配置选项
- 2025-09-06 14:13:36 6e9a57f [webkubor] feat: 将标题设置移至独立的折叠面板中
- 2025-09-06 12:22:12 240e0ea [webkubor] feat: 支持副标题多行显示及换行功能
- 2025-09-05 23:05:19 0100b2c [webkubor] feat: 为海报编辑器添加标题和副标题的拖拽功能
- 2025-09-05 22:39:46 b3e1906 [webkubor] feat: 更新字体名称并添加海报光照效果开关
- 2025-09-05 22:20:26 abadd81 [webkubor] feat: 优化模板卡片样式，添加悬停和选中状态的视觉效果
- 2025-09-05 21:57:22 09a7350 [webkubor] feat: 移除自定义字体选项并优化控制栏背景样式
- 2025-09-05 21:38:14 c24958f [webkubor] feat: 优化竖排文字方向和模板副标题显示逻辑
- 2025-09-05 18:26:16 e9911f6 [webkubor] feat: 为小红书海报编辑器添加副标题显示开关功能
- 2025-09-05 18:24:36 f6e7f39 [webkubor] feat: 使用主标题作为海报下载文件名并清理特殊字符
- 2025-09-05 18:19:35 469e811 [webkubor] feat: 优化海报编辑器字体大小单位并移除文字占比限制功能
- 2025-09-05 18:04:32 2d32e17 [webkubor] feat: 将字体大小单位从 px 改为 em 并优化海报布局样式
- 2025-09-05 17:17:22 c13620f [webkubor] feat: 优化竖排文字方向并添加武侠和极简黑白海报模板
- 2025-09-05 17:02:02 eb5e88b [webkubor] feat: 为海报编辑器添加文字阴影效果并优化布局样式
- 2025-09-05 16:22:26 c82fdb0 [webkubor] feat: 新增小红书海报下载功能并优化模板选择界面
- 2025-09-05 15:46:53 ef6af1c [webkubor] feat: 使用 naive-ui 重构设计提示组件并优化模板预览布局
- 2025-09-05 15:38:42 0071479 [webkubor] feat: 新增字体选择、文字排版和预设模板功能
- 2025-09-05 14:54:18 93b56a5 [webkubor] feat: 将vue-router移至生产依赖并添加小红书封面编辑功能
- 2025-09-05 14:38:32 71d4bbe [webkubor] feat: 重构模板管理功能并统一时间格式化工具
- 2025-09-05 14:09:45 1128eeb [webkubor] feat: 添加模板和配置保存时的用户反馈提示
- 2025-09-04 18:00:02 15bd793 [webkubor] feat: 为移动端添加自适应布局和底部抽屉组件
- 2025-09-04 17:30:20 f54c952 [webkubor] feat: 添加背景设置到模板保存和加载功能中
- 2025-09-04 17:17:20 a3b1c9e [webkubor] feat  移除消息提示测试
- 2025-09-04 17:16:24 7f388de [webkubor] feat  更新配置
- 2025-09-04 16:46:56 5a7f6d9 [webkubor] feat 提交配置
- 2025-09-04 15:40:45 4f66939 [webkubor] feat: 添加全局消息提示插件并集成到应用中
- 2025-09-04 15:09:21 3e6188f [webkubor] feat: 更新分享卡片UI样式并优化壁纸编辑器按钮颜色
- 2025-09-04 12:35:39 f4a855d [webkubor] feat: 添加分享卡片的颜色选择和模板切换功能
- 2025-09-04 11:52:11 11107ef [webkubor] feat: 优化分享卡片模态框的UI设计和交互体验
- 2025-09-04 10:50:32 627b313 [webkubor] feat: 更新刘海屏UI样式并调整页面布局和图标
- 2025-09-04 10:44:16 92ca41a [webkubor] feat: 优化页面SEO和PWA支持，美化页面UI组件样式
- 2025-09-04 10:30:27 1b18129 [webkubor] feat: 更新应用标题、图标和界面布局
- 2025-09-04 10:15:45 0ce69f9 [webkubor] feat: 添加个人模板页面标题和应用副标题样式
- 2025-09-04 10:09:46 8b6a604 [webkubor] feat: 添加壁纸下载时的文件名自定义功能
- 2025-09-03 22:11:18 7a12ad8 [webkubor] feat: 增加标题显示开关并优化重置配置功能
- 2025-09-03 19:08:41 6a3620e [webkubor] feat  删除多余样式
- 2025-09-03 19:06:44 140d670 [webkubor] feat: 将设置面板抽离为独立的SettingsToolbar组件
- 2025-09-03 18:58:25 59f3944 [webkubor] feat: 添加页脚组件和设置模态框组件并优化响应式布局
- 2025-09-03 18:39:13 881faff [webkubor] feat: 添加保存和加载个人壁纸模板功能
- 2025-09-03 18:17:52 6337537 [webkubor] feat: 添加配置管理功能，支持保存和重置壁纸设置
- 2025-09-03 17:48:30 50bf53f [webkubor] feat: 添加iPhone刘海显示开关及相关样式调整
- 2025-09-03 17:42:03 3076a2c [webkubor] feat: 为iPhone组件添加刘海屏和摄像头UI设计
- 2025-09-03 17:35:59 0702f9a [webkubor] feat: 为所有设备框架添加基于壁纸颜色的动态阴影效果
- 2025-09-03 16:20:41 6c80b8c [webkubor] feat: 添加壁纸下载设置选项，支持选择是否包含背景下载
- 2025-09-03 16:04:44 cbde2e6 [webkubor] feat: 添加自定义尺寸预览组件并调整设备框架布局
- 2025-09-03 15:36:34 68ac843 [webkubor] feat: 更新网站标题和头部样式，优化品牌标识
- 2025-09-03 15:13:18 55e4e48 [webkubor] feat: 移除@vueuse/gesture依赖并重构拖拽功能实现
- 2025-09-03 15:04:50 b2dbca4 [webkubor] feat: 为标题和水印添加拖拽功能
- 2025-09-03 14:58:47 24f4e7c [webkubor] feat: 抽离 HomeIndicator 组件并优化 iPad 锁屏布局
- 2025-09-03 14:30:55 d16b50f [webkubor] feat: 使用dayjs实现动态时间显示并根据壁纸自适应文本颜色
- 2025-09-03 14:17:43 61fb392 [webkubor] feat: 添加标题设置组件并优化水印和手机界面样式
- 2025-09-03 12:35:28 0afaf56 [webkubor] feat: 添加iPhone底部指示条并调整底部图标位置样式
- 2025-09-03 12:34:01 8074cd9 [webkubor] feat: 将锁屏底部图标替换为手电筒和相机图标
- 2025-09-03 12:30:21 9420adf [webkubor] feat: 在锁屏界面添加日期显示并优化时间格式
- 2025-09-03 11:44:41 fbb2edc [webkubor] feat: 添加基于壁纸颜色自动调整水印文字颜色的功能
- 2025-09-03 11:41:19 3819743 [webkubor] feat: 新增背景设置组件并优化设备框架样式
- 2025-09-03 11:19:41 c72a6be [webkubor] feat: 优化组合设备预览时的样式和动画效果
- 2025-09-03 11:16:49 12b3cca [webkubor] feat: 增加图片上传校验和消息提示功能
- 2025-09-03 10:22:17 ef10c63 [webkubor] feat: 新增车机和组合设备预览功能
- 2025-09-03 10:13:40 8f0ade4 [webkubor] feat: 重构设备框架组件并简化壁纸编辑器界面
- 2025-09-02 19:30:59 459c71a [webkubor] feat: 为iPad和Mac设备添加框架UI组件和样式
- 2025-09-02 19:29:29 245348f [webkubor] feat: 重构设备预览框架并优化水印位置样式
- 2025-09-02 19:14:53 a9df576 [webkubor] feat 提交配置
- 2025-09-02 18:54:43 adf3cf6 [webkubor] feat: 优化水印样式并调整设备预览尺寸
- 2025-09-02 18:47:41 ea8520e [webkubor] feat: 升级vue-cropper并优化图片编辑器布局和缩放功能
- 2025-09-02 18:25:27 c634147 [webkubor] feat: 添加页面底部版权信息和联系方式
- 2025-09-02 18:17:07 b7f3c16 [webkubor] feat: 新增图片裁剪功能并优化页面布局与主题切换
- 2025-09-02 18:06:19 ea6ec4a [webkubor] feat: 新增图片水印功能并优化界面布局为两栏式设计
- 2025-09-02 17:35:13 6ed6c5a [webkubor] feat: 实现主题切换并优化按钮样式
- 2025-09-02 17:33:17 97abc90 [webkubor] feat 修改框架
- 2025-09-02 17:17:21 252370d [webkubor] feat  删除无用的配置

### 修复（fix）
- 2025-09-05 17:07:26 6e0cc45 [webkubor] fix: 修复标题描边样式默认值并更新模板颜色配置
- 2025-09-04 11:20:54 1db50a8 [webkubor] fix: 修复模板加载事件的TypeScript类型定义语法

### 移除/重构（remove/chore）
- 2025-09-05 22:40:43 1df2cfe [webkubor] refactor: 将字体 Chinese3 重命名为 Wuxia 以更好地表达武侠风格
- 2025-09-05 18:21:36 6f9b276 [webkubor] refactor: 将文字排版布局的布尔值改为字符串枚举类型
- 2025-09-05 16:30:33 b7e14f6 [webkubor] refactor: 将海报模板和字体配置抽离到独立JSON文件
- 2025-09-05 14:12:19 784342a [webkubor] chore: 添加生成变更日志脚本并更新开发服务器配置
- 2025-09-04 15:44:13 804ff5e [webkubor] refactor: 移除 NMessageProvider 组件并使用全局消息通知
- 2025-09-04 11:42:45 76450ff [webkubor] refactor: 将拖拽功能移至独立文件并优化分享卡片组件
- 2025-09-04 11:29:32 7923cb4 [webkubor] refactor: 重构壁纸和分享卡片的截图下载逻辑到独立工具函数
- 2025-09-04 11:13:06 c586bf4 [webkubor] refactor: 将个人模板组件移至设置面板中显示
- 2025-09-04 09:51:21 ee4ca8b [webkubor] refactor: 将背景和字体设置移至全局状态管理并统一颜色处理逻辑
- 2025-09-03 19:17:13 594c5f0 [webkubor] refactor: 将组件状态管理迁移至useWallpaper组合式API
- 2025-09-03 19:01:35 b58dac5 [webkubor] refactor: 将页面头部组件抽离为独立的Header组件
- 2025-09-03 18:49:08 eca18f0 [webkubor] refactor: 重新设计主题切换和个人模板的UI布局
- 2025-09-03 18:42:03 cf6e36c [webkubor] refactor: 将设置组件移至 toolbar 目录并统一相对路径引用
- 2025-09-03 12:23:34 54ac792 [webkubor] refactor: 优化iPhone锁屏界面布局和水印显示效果
- 2025-09-03 10:50:22 35ac42e [webkubor] refactor: 将壁纸背景移至各设备框架内部并优化布局样式
- 2025-09-02 19:22:44 abd04e2 [webkubor] chore: 移除壁纸组件中的冗余注释
- 2025-09-02 19:16:08 01b8567 [webkubor] refactor: 将手机相关组件移动至iphone目录

### 其他（other/merge）
- 2025-09-05 23:48:10 fefe06b [webkubor] 删除: 移除小红书封面编辑器组件和设计提示组件
- 2025-09-05 22:14:14 63ab751 [webkubor] 优化: 改进海报编辑器页面的布局和响应式设计
- 2025-09-05 21:52:07 c47214d [webkubor] 移除vampire-wars字体并优化文字渲染样式
- 2025-09-05 16:48:31 8ef2032 [webkubor] 样式: 调整海报高度限制并新增黑金科幻等模板样式
- 2025-09-05 16:40:12 f23d958 [webkubor] 样式: 更新模板卡片选中状态样式并简化主题色系统为金色调
- 2025-09-05 14:13:32 4bace70 [webkubor] docs: 删除CHANGELOG文件以迁移至其他格式
- 2025-09-04 09:09:30 602e041 [webkubor] 添加新文件
- 2025-09-04 09:08:57 61e2e9b [webkubor] 添加更新日志
- 2025-09-04 09:07:49 a481a49 [webkubor] 添加新文件
- 2025-09-04 16:36:00 e68c52c [webkubor] 优化: 重构设置面板布局并调整设备默认尺寸
- 2025-09-04 16:08:24 60e11a8 [webkubor] 优化: 改进消息提示组件的样式和动画效果
- 2025-09-04 15:14:51 fd71c52 [webkubor] 优化: 将分享卡片刷新按钮移至底部工具栏
- 2025-09-04 12:46:50 51b771f [webkubor] 优化: 改进分享卡片的下载功能并简化样式设置
- 2025-09-04 10:56:04 3b5de7f [webkubor] 优化: 重新设计iPhone刘海区域样式并实现动态尺寸计算
- 2025-09-03 17:37:06 0359f33 [webkubor] style: 优化设备布局和界面样式，调整下载模态框外观
- 2025-09-03 15:54:40 b5ceff4 [webkubor] docs: 将下载按钮移至顶部导航栏并优化样式
- 2025-09-03 15:46:05 fc11356 [webkubor] 优化: 统一字体选项配置并重构字体选择器组件
- 2025-09-03 15:44:47 aa2a6ff [webkubor] 样式: 更新页脚设计并统一字体选项配置
- 2025-09-03 15:30:50 bae8dbc [webkubor] 样式: 更新主题配色方案并添加毛玻璃效果和渐变样式
- 2025-09-03 15:24:51 73e1cbc [webkubor] 优化: 简化主题切换逻辑并重构颜色配置代码
- 2025-09-03 15:18:40 35d8d3c [webkubor] QQ
- 2025-09-03 15:07:02 c1382e7 [webkubor] 优化: 用原生事件处理替换VueUse手势库实现拖拽功能
- 2025-09-03 14:47:15 af798f1 [webkubor] 优化: 移除SVG固定尺寸并添加响应式大小控制
- 2025-09-03 14:39:23 5d0621e [webkubor] 提交
- 2025-09-02 19:06:57 30bffd7 [webkubor] style: 移除页面布局的宽度限制和全局样式
- 2025-09-02 18:58:02 f247cb9 [webkubor] 样式: 调整设置面板宽度并将默认设备改为iPad
- 2025-09-02 17:52:24 8312c46 [webkubor] docs: 更新项目文档，添加产品需求和开发细节说明