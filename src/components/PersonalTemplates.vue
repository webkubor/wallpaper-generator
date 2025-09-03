<template>
  <div class="template-section">
    <div class="personal-templates">
      <div class="template-toggle" @click="templatesExpanded = !templatesExpanded">
        <n-icon 
          :component="templatesExpanded ? ChevronLeft : ChevronRight" 
          class="chevron-icon"
        />
      </div>
      
      <div v-show="templatesExpanded" class="template-content">
        <div v-if="templates.length > 0" class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.id" 
            class="template-card"
          >
            <div class="template-image-wrapper">
              <img :src="template.previewImage" :alt="template.name" class="template-image" />
              <div class="template-overlay">
                <n-button 
                  size="small" 
                  type="primary" 
                  circle
                  @click="$emit('loadTemplate', template)" 
                  class="action-btn load-btn"
                >
                  <template #icon>
                    <n-icon :component="Download" />
                  </template>
                </n-button>
                <n-button 
                  size="small" 
                  type="error" 
                  circle
                  @click="handleDeleteTemplate(template.id)" 
                  class="action-btn delete-btn"
                >
                  <template #icon>
                    <n-icon :component="Trash" />
                  </template>
                </n-button>
              </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NIcon, NButton, useMessage } from 'naive-ui';
import { PhCaretLeft as ChevronLeft, PhCaretRight as ChevronRight, PhDownload as Download, PhTrash as Trash, PhImage as ImageSquare } from "@phosphor-icons/vue";
import { templateDB, type Template } from '../utils/indexedDB';

// Props
defineProps<{
  refreshTrigger?: number;
}>();

// Emits
const emit = defineEmits<{
  loadTemplate: [template: Template];
}>();

// 响应式数据
const templates = ref<Template[]>([]);
const templatesExpanded = ref(false);
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
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  
  &:hover {
    background: var(--n-color-hover);
    transform: scale(1.1);
  }
  
  .chevron-icon {
    color: var(--n-text-color-disabled);
    font-size: 14px;
    transition: all 0.3s ease;
  }
}

.template-content {
  margin-top: 12px;
  padding: 20px;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.template-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    .template-overlay {
      opacity: 1;
    }
    
    .template-image {
      transform: scale(1.05);
    }
  }
}

.template-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.template-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.template-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn {
  backdrop-filter: blur(10px);
  border: none !important;
  
  &.load-btn {
    background: rgba(24, 160, 88, 0.9) !important;
    
    &:hover {
      background: rgba(24, 160, 88, 1) !important;
    }
  }
  
  &.delete-btn {
    background: rgba(208, 48, 80, 0.9) !important;
    
    &:hover {
      background: rgba(208, 48, 80, 1) !important;
    }
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
