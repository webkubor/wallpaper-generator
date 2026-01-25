<template>
  <header class="header">
    <div class="title-container">
      <div class="title-content">
        <h1 class="main-title">✨ 氛围壁纸工坊</h1>
        <p class="subtitle">风有归处，心有颜色。</p>
      </div>
    </div>
    <div class="header-actions" v-if="!hideActions">
      <BaseButton variant="secondary" class="xhs-button" @click="goXHS">
        小红书封面
      </BaseButton>
      <BaseButton variant="primary" class="download-button" @click="$emit('download')">
        <template #icon>
          <Download :size="18" weight="bold" />
        </template>
        导出
      </BaseButton>
    </div>
    <div class="header-actions" v-else>
      <BaseButton variant="primary" @click="$emit('downloadPoster')">
        下载大字报
      </BaseButton>
      <BaseButton variant="secondary" @click="goHome">
        返回
      </BaseButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import BaseButton from '../base/BaseButton.vue';
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
  void router.push({ name: 'Poster' });
};
const goHome = () => {
  void router.push({ name: 'Home' });
};
</script>

<style scoped lang="scss">
.header {
  background: rgba(251, 247, 241, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-morandi-line);
  padding: 14px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-normal);
  animation: slide-down 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .xhs-button {
      font-weight: 600;
      opacity: 0.85;
      &:hover { opacity: 1; }
    }

    .download-button {
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(244, 208, 63, 0.25);
    }
  }
  
  .title-container {
    display: flex;
    align-items: center;
    gap: 14px;
    
    .title-content {
      display: flex;
      flex-direction: column;
      gap: 1px;
      
      .main-title {
        font-size: 22px;
        font-weight: 900;
        letter-spacing: -0.02em;
        margin: 0;
        font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
        color: var(--color-morandi-ink);
        line-height: 1.1;
      }
      
      .subtitle {
        font-size: 11px;
        color: var(--color-morandi-ink-muted);
        margin: 0;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        font-weight: 500;
        opacity: 0.7;
        line-height: 1;
      }
    }
  }
}

@keyframes slide-down {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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
    }
  }
}

/* 极小屏（<= 480px）适配 */
@media (max-width: 480px) {
  .header {
    padding: 10px 12px;

    .header-actions {
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>
