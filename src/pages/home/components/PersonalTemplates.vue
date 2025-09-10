<template>
  <div class="template-section">
    <div class="personal-templates">
      <div v-if="templates.length > 0" class="template-grid">
        <div 
          v-for="template in templates" 
          :key="template.id" 
          class="template-card"
        >
          <div class="template-preview">
            <img :src="template.previewImage" :alt="template.name" class="template-thumbnail" />
          </div>
          <div class="template-info">
            <h4 
              v-if="editingId !== template.id" 
              class="template-title" 
              @dblclick="() => startEdit(template)"
              title="双击编辑名称"
            >
              {{ template.name }}
            </h4>
            <n-input
              v-else
              v-model:value="editingName"
              size="small"
              autofocus
              placeholder="输入模板名称"
              @blur="() => handleSaveName(template)"
              @keyup.enter="() => handleSaveName(template)"
              @keyup.esc="cancelEdit"
            />
            <div class="template-meta">
              <span class="template-time">{{ formatDisplayTime(template.timestamp) }}</span>
            </div>
            <p class="template-description">{{ formatTemplateDescription(template) }}</p>
          </div>
          <div class="template-actions">
            <n-button 
              size="small" 
              color="#f4d03f"
              dashed
              @click="$emit('loadTemplate', template)" 
              class="load-btn"
            >
              <template #icon>
                <n-icon :component="Download" />
               </template>
            </n-button>
            <n-button 
              size="small" 
              color="#ef4444"
              dashed
              @click="handleDeleteTemplate(template.id)" 
              class="delete-btn"
            >
              <template #icon>
                <n-icon :component="Trash" />
              </template>
            </n-button>
          </div>
        </div>
      </div>
      
      <div v-else class="template-empty">
        <div class="empty-content">
          <n-icon :component="ImageSquare" size="32" class="empty-icon" />
          <p class="empty-text">暂无个人模板</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NIcon, NButton, NInput } from 'naive-ui';
import { formatDisplayTime } from '@/utils/time';
import { PhDownload as Download, PhTrash as Trash, PhImage as ImageSquare } from "@phosphor-icons/vue";
import { templateDB, type Template } from '@/utils/indexedDB';

// Props
defineProps<{
  refreshTrigger?: number;
}>();

// Emits
defineEmits<{
  (event: 'loadTemplate', template: Template): void;
}>();

// 响应式数据
const templates = ref<Template[]>([]);
const editingId = ref<string | null>(null);
const editingName = ref('');

// 加载所有模板
const loadTemplates = async () => {
  try {
    templates.value = await templateDB.getAllTemplates();
  } catch (error) {
    console.error('加载模板失败:', error);
  }
};

// 开始编辑名称
const startEdit = (template: Template) => {
  editingId.value = template.id;
  editingName.value = template.name;
};

// 取消编辑
const cancelEdit = () => {
  editingId.value = null;
  editingName.value = '';
};

// 保存名称（失焦或回车）
const handleSaveName = async (template: Template) => {
  const newName = editingName.value.trim();
  if (!newName) {
    // 空名称则还原并退出
    cancelEdit();
    return;
  }
  if (newName === template.name) {
    cancelEdit();
    return;
  }
  try {
    const updated: Template = { ...template, name: newName };
    await templateDB.saveTemplate(updated);
    await loadTemplates(); // 重新加载模板列表
    window.$message?.success('模板名称已更新');
  } catch (e) {
    console.error('更新模板名称失败:', e);
    window.$message?.error('更新模板名称失败');
  } finally {
    cancelEdit();
  }
};

// 时间格式化改为复用通用工具函数（formatDisplayTime）

// 删除模板
const handleDeleteTemplate = async (id: string) => {
  try {
    await templateDB.deleteTemplate(id);
    await loadTemplates(); // 确保删除后刷新列表
    window.$message.success('模板删除成功');
  } catch (error) {
    console.error('删除模板失败:', error);
    window.$message.error('删除模板失败');
  }
};

// 格式化模板描述
const formatTemplateDescription = (template: Template) => {
  const config = template.config;
  const parts = [];
  
  // 设备信息
  if (config.previewSettings?.selectedDevice) {
    const deviceNames: Record<string, string> = {
      'iphone': 'iPhone',
      'ipad': 'iPad',
      'mac': 'Mac',
      'car': '车机',
      'combo': '组合设备',
      'custom': '自定义'
    };
    parts.push(deviceNames[config.previewSettings.selectedDevice] || '未知设备');
  }
  
  // 水印信息
  
  // 标题信息
  if (config.titleSettings?.show && config.titleSettings?.text) {
    parts.push(`标题: ${config.titleSettings.text}`);
  }
  
  return parts.length > 0 ? parts.join(' • ') : '个人模板配置';
};

// 组件挂载时加载模板
onMounted(() => {
  loadTemplates();
});

// 不再需要暴露方法，通过 useWallpaper 直接管理
</script>

<style scoped lang="scss">
/* 个人模板样式 */
.template-section {
  margin-top: 16px;
}

.personal-templates {
  transition: all 0.3s ease;
}

.template-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(244, 208, 63, 0.1);
  border: 1px solid rgba(244, 208, 63, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  
  &:hover {
    background: rgba(244, 208, 63, 0.2);
    transform: scale(1.1);
  }
  
  .chevron-icon {
    color: #f4d03f;
    font-size: 14px;
    transition: all 0.3s ease;
  }
}

/* 模板工坊头部样式 */
.template-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 0;
  margin-top: 8px;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 12px 12px 0 0;
  
  .header-content {
    flex: 1;
    
    .workshop-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--n-text-color);
      margin: 0 0 4px 0;
      background: linear-gradient(135deg, #f4d03f 0%, #ff9a56 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .workshop-subtitle {
      font-size: 14px;
      color: var(--n-text-color-disabled);
      margin: 0;
      font-style: italic;
      opacity: 0.8;
    }
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .star-icon {
      font-size: 24px;
      color: #f4d03f;
      opacity: 0.6;
      animation: twinkle 2s ease-in-out infinite alternate;
    }
    
    .template-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: rgba(244, 208, 63, 0.1);
      border: 1px solid rgba(244, 208, 63, 0.3);
      border-radius: 50%;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(244, 208, 63, 0.2);
        transform: scale(1.1);
      }
      
      .chevron-icon {
        color: #f4d03f;
        font-size: 14px;
        transition: all 0.3s ease;
      }
    }
  }
}

@keyframes twinkle {
  0% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.1); }
}

.template-content {
  margin-top: 0;
  padding: 16px;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-top: none;
  border-radius: 0 0 12px 12px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 400px; /* 固定高度 */
  overflow-y: auto; /* 垂直滚动 */
  padding-right: 8px; /* 为滚动条留出空间 */
  grid-auto-rows: minmax(180px, auto); /* 设置最小行高 */
}

.template-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  transition: all 0.3s ease;
  height: 100%; /* 确保卡片填满网格行高 */
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 6px rgba(0, 0, 0, 0.1),
      0 10px 15px rgba(0, 0, 0, 0.1),
      0 20px 25px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
}

.template-preview {
  position: relative;
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.template-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.template-info {
  padding: 10px 12px;
  flex: 1;
}

.template-title {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--n-text-color);
  line-height: 1.4;
}

.template-description {
  margin: 0;
  font-size: 11px;
  color: var(--n-text-color-disabled);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.template-actions {
  padding: 10px 12px;
  border-top: 1px solid var(--n-border-color);
  display: flex;
  gap: 6px;
}

.template-meta {
  margin: 4px 0 6px;
}

.template-time {
  font-size: 11px;
  color: var(--n-text-color-disabled);
}

/* 响应式：小屏幕保持单列显示 */
@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
  .template-preview {
    height: 120px; /* 小屏可适当增大预览高度，便于点击 */
  }
}



.template-empty {
  padding: 32px 20px;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  .empty-icon {
    color: var(--n-text-color-disabled);
    opacity: 0.6;
  }
  
  .empty-text {
    margin: 0;
    color: var(--n-text-color-disabled);
    font-size: 14px;
  }
}
</style>
