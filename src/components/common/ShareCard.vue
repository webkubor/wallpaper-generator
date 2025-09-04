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
        <div class="share-card" ref="shareCardRef" :class="`template-${currentTemplate}`" :style="{ backgroundColor: selectedColor, fontFamily: currentFont.value, color: textColor }">
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

      <!-- 颜色选择 -->
      <div class="card-controls">
        <div class="color-palette">
          <div class="color-options">
            <button 
              v-for="color in cardColors" 
              :key="color"
              class="color-btn"
              :class="{ active: selectedColor === color }"
              :style="{ backgroundColor: color }"
              @click="selectedColor = color"
            ></button>
          </div>
        </div>
        
        <button class="refresh-btn" @click="refreshCard">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M13.65 2.35C12.2 0.9 10.2 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L9 5h7V-2l-2.35 2.35z" fill="currentColor"/>
          </svg>
        </button>
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
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { getContrastTextColor } from '../../utils/colorUtils';
import { useQuotes } from '../../hooks/useQuotes';
import { useWallpaper } from '../../composables/useWallpaper';

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
const { getRandomQuote, getRandomFont, cardColors } = useQuotes();
const { watermarkSettings } = useWallpaper();
const currentQuote = ref(getRandomQuote()); // 初始化时就生成一句
const currentDate = computed(() => dayjs().format('YYYY/MM/DD'));

// 卡片颜色和模板
const selectedColor = ref(cardColors[0]);
const currentTemplate = ref(1);
const currentFont = ref(getRandomFont());

// 使用颜色工具分析背景色并计算文本颜色
const textColor = ref('#333333');

// 分析背景色并更新文本颜色
const updateTextColor = async () => {
  try {
    const color = await getContrastTextColor(selectedColor.value);
    textColor.value = color;
  } catch (error) {
    console.error('颜色分析失败:', error);
    textColor.value = '#333333';
  }
};

// 监听背景色变化
watch(selectedColor, updateTextColor, { immediate: true });

// 刷新卡片内容和模板
const refreshCard = () => {
  currentQuote.value = getRandomQuote();
  // 切换模板：1 -> 2, 2 -> 1
  currentTemplate.value = currentTemplate.value === 1 ? 2 : 1;
  // 随机切换字体
  currentFont.value = getRandomFont();
};

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
    const canvas = await html2canvas(shareCardRef.value, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });
    
    const link = document.createElement('a');
    link.download = `share-card-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
  width: 420px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  background: #ffffff;
  
  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    
    .title-icon {
      font-size: 16px;
    }
  }
  
  .close-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #999;
    transition: all 0.15s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.04);
      color: #666;
    }
  }
}

.modal-content {
  padding: 24px;
  display: flex;
  justify-content: center;
  background: #ffffff;
}

.share-card {
  width: 360px;
  height: 450px; // 4:5 比例
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  
  
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
    }
  }
  
  .card-wallpaper {
    height: 200px; // 固定高度，避免flex导致的超出
    margin-bottom: 20px;
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
  gap: 12px;
  padding: 16px 24px 20px;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  
  .footer-btn {
    flex: 1;
    height: 40px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    
    &.secondary {
      background: #f5f5f5;
      color: #666;
      
      &:hover {
        background: #e8e8e8;
        color: #333;
      }
    }
    
    &.primary {
      background: #007AFF;
      color: #ffffff;
      
      &:hover {
        background: #0056CC;
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}

.card-controls {
  padding: 16px 24px;
  background: #fafbfc;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .color-palette {
    flex: 1;
    overflow: hidden;
    
    .color-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .color-btn {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        position: relative;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        &.active {
          border-color: #007AFF;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
          
          &::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #007AFF;
            font-size: 14px;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }
  
  .refresh-btn {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    margin-left: 12px;
    border: none;
    border-radius: 8px;
    background: #f0f0f0;
    color: #666;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #e0e0e0;
      color: #333;
      transform: translateY(-1px);
    }
    
    svg {
      animation: none;
      width: 16px;
      height: 16px;
    }
    
    &:active svg {
      animation: spin 0.4s ease-in-out;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 模板2样式 - 极简线条设计
.share-card.template-2 {
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  
  .card-date-tag {
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    
    .date-dot {
      display: none;
    }
    
    span {
      color: #333;
      font-weight: 300;
      text-transform: none;
      font-size: 24px;
      line-height: 1;
      
      &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 1px;
        background: #333;
        margin-right: 8px;
        vertical-align: middle;
      }
    }
  }
  
  .card-quote-section {
    .quote-mark {
      display: none;
    }
    
    .card-quote {
      color: #333;
      font-weight: 300;
      font-size: 20px;
      line-height: 1.4;
      text-align: left;
      padding: 0;
      font-style: italic;
    }
  }
  
  .card-wallpaper .wallpaper-frame {
    border-radius: 0;
    border: 1px solid #ddd;
    box-shadow: none;
    
    &::before {
      display: none;
    }
    
    .wallpaper-placeholder {
      color: #999;
      font-weight: 300;
    }
  }
  
  .card-footer .watermark-section {
    border-top: 1px solid #eee;
    padding-top: 12px;
    justify-content: center;
    
    .watermark-icon {
      display: none;
    }
    
    .card-watermark {
      color: #666;
      font-weight: 300;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
}
</style>
