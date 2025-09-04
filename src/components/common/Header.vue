<template>
  <n-layout-header class="header">
    <div class="title-container">
      <div class="title-content">
        <h1 class="main-title">✨ 氛围壁纸工坊</h1>
        <p class="subtitle">风有归处，心有颜色。</p>
      </div>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button tertiary size="small" class="save-template-button" @click="$emit('saveTemplate')">
            <template #icon>
              <n-icon :component="Star" />
            </template>
          </n-button>
        </template>
        保存为个人模板
      </n-tooltip>
    </div>
    <div class="header-actions">
      <n-button color="#f4d03f" strong secondary class="save-config-button" @click="$emit('saveConfig')">
        <template #icon>
          <n-icon :component="FloppyDisk" />
        </template>
        保存配置
      </n-button>
      <n-button type="primary" color="#f4d03f" strong secondary  class="download-button" @click="$emit('download')">
        <template #icon>
          <n-icon :component="Download" />
        </template>
        导出
      </n-button>
      <n-button @click="$emit('openSettings')" class="settings-button">
        <template #icon>
          <n-icon :component="Gear" />
        </template>
        设置
      </n-button>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { NLayoutHeader, NButton, NIcon, NTooltip } from 'naive-ui';
import { PhDownload as Download, PhGear as Gear, PhFloppyDisk as FloppyDisk, PhStar as Star } from "@phosphor-icons/vue";

defineEmits<{
  saveTemplate: [];
  saveConfig: [];
  download: [];
  openSettings: [];
}>();
</script>

<style scoped lang="scss">
.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .download-button {
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(244, 208, 63, 0.3);
      }
    }
    
    .settings-button {
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .title-container {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
    
    .title-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      
      .main-title {
        font-size: 24px;
        font-weight: 800;
        margin: 0;
        font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
        color: var(--n-text-color);
        line-height: 1.2;
      }
      
      .subtitle {
        font-size: 12px;
        color: var(--n-text-color-disabled);
        margin: 0;
        font-style: italic;
        opacity: 0.8;
        line-height: 1;
        font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
      }
    }
  }
}

/* 平板与小屏（<= 768px）适配 */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;

    .title-container {
      display: none; /* 移动端隐藏大标题与副标题 */
    }

    .header-actions {
      width: 100%;
      justify-content: flex-end;
      gap: 8px;

      .n-button {
        padding: 0 10px;
        height: 32px;
      }
    }
  }
}

/* 极小屏（<= 480px）适配 */
@media (max-width: 480px) {
  .header {
    padding: 10px 12px;

    .header-actions {
      justify-content: space-between;
      .save-config-button,
      .download-button,
      .settings-button {
        font-size: 12px;
        padding: 0 8px;
        height: 30px;
      }
      /* 将“保存为模板”图标按钮更靠近标题区域显示为图标即可 */
      :deep(.save-template-button) {
        padding: 0 6px;
        height: 28px;
      }
    }
  }
}
</style>
