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
            <h4 class="template-title">{{ template.name }}</h4>
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
              加载
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
              删除
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
import { NIcon, NButton, useMessage } from 'naive-ui';
import { PhDownload as Download, PhTrash as Trash, PhImage as ImageSquare } from "@phosphor-icons/vue";
import { templateDB, type Template } from '../utils/indexedDB';

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
const message = useMessage();

// 加载所有模板
const loadTemplates = async () => {
  try {
    templates.value = await templateDB.getAllTemplates();
  } catch (error) {
    console.error('加载模板失败:', error);
  }
};

// 删除模板
const handleDeleteTemplate = async (id: string) => {
  try {
    await templateDB.deleteTemplate(id);
    await loadTemplates(); // 重新加载模板列表
    message.success('模板删除成功');
  } catch (error) {
    console.error('删除模板失败:', error);
    message.error('删除模板失败');
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
  if (config.watermarkSettings?.text) {
    parts.push(`水印: ${config.watermarkSettings.text}`);
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.template-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.template-preview {
  position: relative;
  width: 100%;
  height: 120px;
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
  padding: 12px 16px;
  flex: 1;
}

.template-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--n-text-color);
  line-height: 1.4;
}

.template-description {
  margin: 0;
  font-size: 12px;
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
  padding: 12px 16px;
  border-top: 1px solid var(--n-border-color);
  display: flex;
  gap: 8px;
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
