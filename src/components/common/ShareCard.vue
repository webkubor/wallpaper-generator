<template>
  <n-modal 
    :show="show" 
    @update:show="handleUpdateShow" 
    :mask-closable="false"
    :close-on-esc="false"
    class="share-modal"
  >
    <div class="modal-container">
      <!-- 自定义头部 -->
      <div class="modal-header">
        <div class="header-title">
          <div class="title-icon">✨</div>
          <span>分享卡片</span>
        </div>
        <button class="close-btn" @click="handleClose">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- 卡片内容 -->
      <div class="modal-content">
        <div class="share-card" ref="shareCardRef">
          <!-- 日期标签 -->
          <div class="card-date-tag">
            <div class="date-dot"></div>
            <span>{{ currentDate }}</span>
          </div>
          
          <!-- 文案区域 -->
          <div class="card-quote-section">
            <div class="quote-mark">"</div>
            <div class="card-quote">{{ currentQuote }}</div>
            <div class="quote-mark quote-mark-end">"</div>
          </div>
          
          <!-- 壁纸展示区 -->
          <div class="card-wallpaper">
            <div class="wallpaper-frame">
              <img v-if="wallpaperImage" :src="wallpaperImage" alt="壁纸" class="wallpaper-image" />
              <div v-else class="wallpaper-placeholder">
                <div class="placeholder-icon">🖼️</div>
                <div class="placeholder-text">壁纸预览</div>
              </div>
            </div>
          </div>
          
          <!-- 水印区域 -->
          <div class="card-footer">
            <div class="watermark-section">
              <div class="watermark-icon">⚡</div>
              <div class="card-watermark">{{ watermarkSettings.text || '氛围壁纸工坊' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 自定义底部 -->
      <div class="modal-footer">
        <button class="footer-btn secondary" @click="handleClose">
          <span>关闭</span>
        </button>
        <button class="footer-btn primary" @click="handleDownloadCard">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1V11M8 11L11 8M8 11L5 8M2 13H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>下载卡片</span>
        </button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NModal } from 'naive-ui';
import { useQuotes } from '../../hooks/useQuotes';
import { captureAndDownload, generateTimestampFilename } from '../../utils/captureUtils';
import { useWallpaper } from '../../composables/useWallpaper';
import dayjs from 'dayjs';

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
const { watermarkSettings } = useWallpaper();
const currentQuote = ref(getRandomQuote()); // 初始化时就生成一句
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

const handleUpdateShow = (value: boolean) => {
  emit('update:show', value);
};

const handleDownloadCard = async () => {
  if (!shareCardRef.value) return;
  
  try {
    await captureAndDownload(
      shareCardRef.value,
      generateTimestampFilename('share-card'),
      {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      }
    );
  } catch (error) {
    console.error('下载卡片失败:', error);
  }
};
</script>

<style scoped lang="scss">
.share-modal {
  :deep(.n-modal) {
    padding: 0;
  }
}

.modal-container {
  width: 480px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    z-index: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  
  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    
    .title-icon {
      font-size: 20px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }
  
  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.08);
      color: #333;
      transform: scale(1.05);
    }
  }
}

.modal-content {
  padding: 32px;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.share-card {
  width: 400px;
  height: 500px; // 4:5 比例
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  
  
  .card-date-tag {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    z-index: 1;
    position: relative;
    
    .date-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(45deg, #f4d03f, #f39c12);
      box-shadow: 0 2px 4px rgba(244, 208, 63, 0.3);
    }
    
    span {
      font-size: 13px;
      color: #666;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }
  
  .card-quote-section {
    position: relative;
    margin-bottom: 32px;
    z-index: 1;
    
    .quote-mark {
      font-size: 48px;
      color: rgba(244, 208, 63, 0.6);
      font-family: Georgia, serif;
      line-height: 1;
      position: absolute;
      
      &:first-child {
        top: -8px;
        left: -8px;
      }
      
      &.quote-mark-end {
        bottom: -16px;
        right: -8px;
        transform: rotate(180deg);
      }
    }
    
    .card-quote {
      font-size: 18px;
      color: #2c3e50;
      line-height: 1.6;
      font-weight: 500;
      text-align: center;
      padding: 16px 24px;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  }
  
  .card-wallpaper {
    height: 240px; // 固定高度，避免flex导致的超出
    margin-bottom: 24px;
    z-index: 1;
    position: relative;
    
    .wallpaper-frame {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 
        inset 0 2px 4px rgba(0, 0, 0, 0.06),
        0 4px 12px rgba(0, 0, 0, 0.08);
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        pointer-events: none;
      }
      
      .wallpaper-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
      }
      
      .wallpaper-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: #8e9aaf;
        
        .placeholder-icon {
          font-size: 32px;
          opacity: 0.6;
        }
        
        .placeholder-text {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      }
    }
  }
  
  .card-footer {
    z-index: 1;
    position: relative;
    
    .watermark-section {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      
      .watermark-icon {
        font-size: 14px;
        opacity: 0.7;
      }
      
      .card-watermark {
        font-size: 12px;
        color: #8e9aaf;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    }
  }
}

.modal-footer {
  display: flex;
  gap: 16px;
  padding: 24px 32px 32px;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  
  .footer-btn {
    flex: 1;
    height: 48px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &.secondary {
      background: rgba(0, 0, 0, 0.04);
      color: #666;
      
      &:hover {
        background: rgba(0, 0, 0, 0.08);
        color: #333;
        transform: translateY(-1px);
      }
    }
    
    &.primary {
      background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(244, 208, 63, 0.3);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(244, 208, 63, 0.4);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
