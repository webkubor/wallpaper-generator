<template>
  <n-modal v-model:show="show" preset="card" style="width: 400px;" title="分享卡片">
    <div class="share-card" ref="shareCardRef">
      <!-- 日期 -->
      <div class="card-date">{{ currentDate }}</div>
      
      <!-- 文案 -->
      <div class="card-quote">"{{ currentQuote }}"</div>
      
      <!-- 壁纸展示区 -->
      <div class="card-wallpaper">
        <img v-if="wallpaperImage" :src="wallpaperImage" alt="壁纸" class="wallpaper-image" />
        <div v-else class="wallpaper-placeholder">用户上传的壁纸展示区</div>
      </div>
      
      <!-- 水印 -->
      <div class="card-watermark">白日梦壁纸</div>
    </div>
    
    <template #footer>
      <n-space justify="end">
        <n-button @click="handleClose">关闭</n-button>
        <n-button type="primary" color="#f4d03f" @click="handleDownloadCard">下载卡片</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NModal, NButton, NSpace } from 'naive-ui';
import { useQuotes } from '../../hooks/useQuotes';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';

interface Props {
  show: boolean;
  wallpaperImage?: string;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const shareCardRef = ref<HTMLElement>();
const { getRandomQuote } = useQuotes();
const currentQuote = ref('');
const currentDate = computed(() => dayjs().format('YYYY/MM/DD'));

// 当弹窗打开时生成随机文案
watch(() => props.show, (newShow) => {
  if (newShow) {
    currentQuote.value = getRandomQuote();
  }
});

const handleClose = () => {
  emit('update:show', false);
};

const handleDownloadCard = async () => {
  if (!shareCardRef.value) return;
  
  try {
    const canvas = await html2canvas(shareCardRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `share-card-${dayjs().format('YYYYMMDD-HHmmss')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('下载卡片失败:', error);
  }
};
</script>

<style scoped lang="scss">
.share-card {
  width: 320px;
  height: 400px; // 4:5 比例
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  
  .card-date {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .card-quote {
    font-size: 16px;
    color: #333;
    line-height: 1.5;
    margin-bottom: 20px;
    font-weight: 500;
    font-style: italic;
  }
  
  .card-wallpaper {
    flex: 1;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .wallpaper-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .wallpaper-placeholder {
      color: #999;
      font-size: 14px;
      text-align: center;
    }
  }
  
  .card-watermark {
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 12px;
    color: #999;
    font-weight: 500;
  }
}
</style>
