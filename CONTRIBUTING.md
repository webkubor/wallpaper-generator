# 贡献指南

感谢你对氛围壁纸工坊的关注！我们欢迎所有形式的贡献，让这个项目变得更好。

## 🤝 如何贡献

### 报告问题
如果你发现了 Bug 或有功能建议：

1. **搜索现有 Issues** - 确保问题还没有被报告过
2. **创建新 Issue** - 使用清晰的标题和详细的描述
3. **提供信息** - 包括复现步骤、期望行为、实际行为

### 提交代码
如果你想为项目贡献代码：

1. **Fork 项目** - 在 GitHub 上 fork 这个仓库
2. **创建分支** - 从 `main` 分支创建你的功能分支
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **编写代码** - 遵循项目的代码规范
4. **测试代码** - 确保你的更改不会破坏现有功能
5. **提交更改** - 使用清晰的提交信息
   ```bash
   git commit -m '新增: 添加了令人惊艳的功能'
   ```
6. **推送分支** - 推送到你的 fork
   ```bash
   git push origin feature/amazing-feature
   ```
7. **创建 MR** - 在 GitLab 上创建 Merge Request

## 📝 代码规范

### 提交信息格式
我们使用中文提交信息，格式如下：
```
类型: 简短描述

详细描述（可选）
```

**类型包括：**
- `新增`: 新功能
- `修复`: Bug 修复
- `优化`: 性能优化或代码改进
- `重构`: 代码重构
- `文档`: 文档更新
- `样式`: 代码格式调整
- `测试`: 测试相关

**示例：**
```
新增: 支持批量导出壁纸功能

- 添加批量选择界面
- 实现多文件打包下载
- 优化导出性能
```

### 代码风格
- 使用 2 个空格缩进
- 使用 TypeScript 类型注解
- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 变量和函数使用 camelCase

### 组件开发规范
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入
import { ref, computed } from 'vue'

// 类型定义
interface Props {
  title: string
}

// Props 和 Emits
const props = defineProps<Props>()
const emit = defineEmits<{
  change: [value: string]
}>()

// 响应式数据
const isVisible = ref(false)

// 计算属性
const displayTitle = computed(() => props.title.toUpperCase())

// 方法
const handleClick = () => {
  emit('change', 'new-value')
}
</script>

<style scoped lang="scss">
// 样式
</style>
```

## 🎯 开发环境设置

### 环境要求
- Node.js 16+
- pnpm（推荐）或 npm

### 安装依赖
```bash
# 克隆项目
git clone git@gitlab.com:webkubor/wallpaper-generator.git
cd wallpaper-generator

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建项目
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🐛 问题报告模板

报告 Bug 时，请包含以下信息：

**问题描述**
简洁清晰地描述问题是什么。

**复现步骤**
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
清晰简洁地描述你期望发生什么。

**实际行为**
清晰简洁地描述实际发生了什么。

**截图**
如果适用，添加截图来帮助解释你的问题。

**环境信息**
- 操作系统: [例如 macOS 12.0]
- 浏览器: [例如 Chrome 96.0]
- 设备: [例如 MacBook Pro]

## 💡 功能建议模板

**功能描述**
清晰简洁地描述你想要的功能。

**解决的问题**
这个功能解决了什么问题？

**替代方案**
你是否考虑过其他替代解决方案？

**附加信息**
添加任何其他关于功能请求的信息或截图。

## 🏷️ 标签说明

我们使用以下标签来分类 Issues 和 MR：

- `bug` - Bug 报告
- `enhancement` - 功能增强
- `documentation` - 文档相关
- `good first issue` - 适合新手的问题
- `help wanted` - 需要帮助
- `question` - 问题咨询
- `wontfix` - 不会修复

## 📋 开发清单

在提交 MR 之前，请确保：

- [ ] 代码遵循项目规范
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试了所有相关功能
- [ ] 构建成功无错误
- [ ] 提交信息清晰明确

## 🎉 贡献者

感谢所有为这个项目做出贡献的人！

## 📄 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下授权。

## 🙋‍♀️ 需要帮助？

如果你有任何问题，可以：

- 创建 Issue 提问
- 查看现有的 Issues 和讨论
- 联系项目维护者

---

**让我们一起让氛围壁纸工坊变得更好！** ✨