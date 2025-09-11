<template>


    <div class="template-section">
        <h3>预设模板</h3>
        <div class="template-grid">
            <div v-for="template in templates" :key="template.id" class="template-card"
                :class="{ 'template-card-selected': selectedTemplateId === template.id }"
                @click="applyTemplate(template)">
                <div class="template-preview">
                    <div class="template-title" :style="{ fontFamily: template.config.selectedFont }">
                        {{ template.config.title }}
                    </div>
                    <div class="template-subtitle" :style="{ fontFamily: template.config.subtitleFont }">
                        {{ template.config.subtitle }}
                    </div>
                </div>
                <div class="template-info">
                    <span class="template-name">{{ template.name }}</span>
                    <span class="template-desc">{{ template.description }}</span>
                </div>
            </div>
        </div>
    </div>

</template>


<script lang="ts" setup>
import { ref } from 'vue';
import posterConfig from './poster-templates.json';
import type { Template } from '@/types/interfaces/poster';


// 当前选中的模板
const selectedTemplateId = ref('wuxia');
let emit = defineEmits(['applyTemplate']);


const templates = ref<Template[]>(posterConfig.templates);



emit('applyTemplate', templates.value[0].config);


const applyTemplate = (template: Template) => {
    selectedTemplateId.value = template.id;
    emit('applyTemplate', template.config);
};
</script>
<style scoped lang="scss">

.template-section {
    width: 100%;
    max-width: 600px; /* Limit max width for better readability */
    margin: 0 auto;
    
    h3 {
      text-align: center;
      margin-bottom: 16px;
      color: var(--text-color);
    }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr); /* Two columns on PC */
      gap: 16px;
      max-height: 60vh;
      overflow-y: auto;
      margin-bottom: 16px;
      padding: 10px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Single column on mobile */
      }
    }
  }



  .template-card {
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  background: rgba(255, 255, 255, 0.09);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent 70%);
    top: -60px;
    right: -60px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &.template-card-selected {
    border-color: var(--primary-color);
    background: rgba(212, 175, 55, 0.1);
    color: var(--primary-color);
    box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
    
    &::before {
      opacity: 1;
      background: linear-gradient(135deg, rgba(255, 235, 180, 0.25), transparent 70%);
    }
    box-shadow: 0 0 0 2px var(--primary-color);
    
    .template-preview {
      border-color: var(--primary-color);
    }
    
    :deep(.n-card-header) {
      color: var(--primary-color);
    }
  }
}

.template-preview {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  border: 1px solid var(--n-border-color);
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  position: relative;
  overflow: hidden;

  .template-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 2px;
  }

  .template-subtitle {
    font-size: 9px;
    opacity: 0.7;
  }
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .template-name {
    font-weight: 600;
    font-size: 13px;
  }

  .template-desc {
    font-size: 11px;
    opacity: 0.6;
  }
}
</style>