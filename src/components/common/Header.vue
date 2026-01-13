<template>
  <n-layout-header class="header">
    <div class="title-container">
      <div class="title-content">
        <h1 class="main-title">✨ 氛围壁纸工坊</h1>
        <p class="subtitle">风有归处，心有颜色。</p>
      </div>
    </div>
    <div class="header-actions" v-if="!hideActions">
      <n-button tertiary class="xhs-button" @click="goXHS">
        小红书封面
      </n-button>
      <n-button type="primary" strong secondary class="download-button" @click="$emit('download')">
        <template #icon>
          <n-icon :component="Download" />
        </template>
        导出
      </n-button>
    </div>
    <div class="header-actions" v-else>
      <n-button type="primary" @click="$emit('downloadPoster')">
        下载大字报
      </n-button>
      <n-button secondary @click="goHome">
        返回
      </n-button>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { NLayoutHeader, NButton, NIcon } from 'naive-ui';
import { useRouter } from 'vue-router';
import { PhDownload as Download } from "@phosphor-icons/vue";

interface Props {
  hideActions?: boolean;
}

defineProps<Props>();

defineEmits<{
  download: [];
  downloadPoster: [];
}>();

const router = useRouter();
const goXHS = () => {
  router.push('/xhs');
};
const goHome = () => {
  router.push('/');
};
</script>

<style scoped lang="scss">
.header {
  background: rgba(251, 247, 241, 0.7);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--morandi-line);
  box-shadow: 0 12px 32px rgba(72, 62, 54, 0.12);
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
        box-shadow: 0 6px 16px rgba(154, 167, 161, 0.35);
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
        color: var(--morandi-ink);
        line-height: 1.2;
      }
      
      .subtitle {
        font-size: 12px;
        color: var(--morandi-ink-muted);
        margin: 0;
        font-style: italic;
        opacity: 0.9;
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
      .download-button {
        font-size: 12px;
        padding: 0 8px;
        height: 30px;
      }
    }
  }
}
</style>
