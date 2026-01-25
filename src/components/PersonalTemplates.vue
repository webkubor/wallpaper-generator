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
            <BaseInput
              v-else
              :model-value="editingName"
              @update:model-value="(val) => editingName = String(val)"
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
            <BaseButton 
              size="sm" 
              variant="secondary"
              class="action-btn"
              @click="$emit('loadTemplate', template)" 
              title="加载模板"
            >
              <template #icon>
                <Download :size="16" />
               </template>
            </BaseButton>
            <BaseButton 
              size="sm" 
              variant="danger"
              class="action-btn"
              @click="handleDeleteTemplate(template.id)" 
              title="删除模板"
            >
              <template #icon>
                <Trash :size="16" />
              </template>
            </BaseButton>
          </div>
        </div>
      </div>
      
      <div v-else class="template-empty">
        <div class="empty-content">
          <ImageSquare :size="32" class="empty-icon" />
          <p class="empty-text">暂无个人模板</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { formatDisplayTime } from '../utils/time';
import { PhDownload as Download, PhTrash as Trash, PhImage as ImageSquare } from "@phosphor-icons/vue";
import { templateDB, type Template } from '../utils/indexedDB';
import BaseButton from './base/BaseButton.vue';
import BaseInput from './base/BaseInput.vue';

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
    await loadTemplates();
    window.$message?.success('模板名称已更新');
  } catch (e) {
    console.error('更新模板名称失败:', e);
    window.$message?.error('更新模板名称失败');
  } finally {
    cancelEdit();
  }
};

// 删除模板
const handleDeleteTemplate = async (id: string) => {
  try {
    await templateDB.deleteTemplate(id);
    await loadTemplates(); // 重新加载模板列表
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

// 暴露方法给父组件
defineExpose({
  loadTemplates
});
</script>

<style scoped lang="scss">
/* 个人模板样式 */
.template-section {
  margin-top: 16px;
}

.personal-templates {
  transition: all 0.3s ease;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.template-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.template-preview {
  position: relative;
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
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
  color: var(--text-primary);
  line-height: 1.4;
  cursor: text;
}

.template-description {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
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
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.action-btn {
  width: 28px;
  height: 28px;
  padding: 0;
}

.template-meta {
  margin: 4px 0 6px;
}

.template-time {
  font-size: 11px;
  color: var(--text-secondary);
}

/* 响应式：小屏幕保持单列显示 */
@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
  .template-preview {
    height: 120px; 
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
    color: var(--text-secondary);
    opacity: 0.6;
  }
  
  .empty-text {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
  }
}
</style>