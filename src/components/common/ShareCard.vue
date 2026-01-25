<template>
  <BaseModal 
    :show="show" 
    @update:show="handleUpdateShow" 
    width="420px"
    :body-style="{ padding: 0 }"
    :mask-closable="false"
  >
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
    <div class="modal-content" >
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
          <img v-if="wallpaperImage" :src="wallpaperImage" alt="壁纸" class="wallpaper-image" />
          <div v-else class="wallpaper-placeholder">
            <div class="placeholder-icon">🖼️</div>
            <div class="placeholder-text">壁纸预览</div>
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
    </div>

    <!-- 自定义底部 -->
    <div class="modal-footer">
      <div class="footer-actions">
        <BaseButton circle variant="secondary" @click="refreshCard" title="换一换">
          <template #icon>
            <PhArrowsClockwise color="#f4d03f" :size="20" weight="bold" />
          </template>
        </BaseButton>
        <BaseButton variant="primary" @click="handleDownloadCard">
          <template #icon>
            <PhDownload :size="18" weight="bold" />
          </template>
          下载卡片
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseModal from '../base/BaseModal.vue';
import BaseButton from '../base/BaseButton.vue';
import { PhDownload, PhArrowsClockwise } from '@phosphor-icons/vue';
import { formatNow, formatFileTimestamp } from '@/utils/time';
import domtoimage from 'dom-to-image-more';
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
const currentDate = computed(() => formatNow('YYYY/MM/DD'));

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
  // 切换模板：1 -> 2 -> 3 -> 1
  currentTemplate.value = currentTemplate.value === 1 ? 2 : currentTemplate.value === 2 ? 3 : 1;
  // 随机切换字体
  currentFont.value = getRandomFont();
  // 随机选择背景颜色
  const randomColorIndex = Math.floor(Math.random() * cardColors.length);
  selectedColor.value = cardColors[randomColorIndex];
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
    const options = {
      bgcolor: selectedColor.value,
      pixelRatio: 2,
      cacheBust: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'center center'
      }
    };
    const blob = await domtoimage.toBlob(shareCardRef.value, options);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `share-card-${formatFileTimestamp()}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载卡片失败:', error);
  }
};
</script>

<style scoped lang="scss">
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  
  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    
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
    color: var(--text-secondary);
    transition: all 0.15s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.04);
      color: var(--text-primary);
    }
  }
}

.modal-content {
  padding: 24px;
  display: flex;
  justify-content: center;
  background: var(--bg-card);
}

.share-card {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.04;
    mix-blend-mode: multiply;
  }
  
  .card-date-tag {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    z-index: 1;
    position: relative;
    
    .date-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-brand);
      box-shadow: 0 0 8px rgba(244, 208, 63, 0.4);
    }
    
    span {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }
  }
  
  .card-quote-section {
    position: relative;
    margin-bottom: 40px;
    z-index: 1;
    
    .quote-mark {
      font-size: 64px;
      font-family: serif;
      color: var(--color-brand);
      line-height: 1;
      position: absolute;
      opacity: 0.3;
      
      &:first-child {
        top: -24px;
        left: -12px;
      }
      
      &.quote-mark-end {
        bottom: -32px;
        right: -12px;
        transform: rotate(180deg);
      }
    }
    
    .card-quote {
      font-size: 20px;
      line-height: 1.7;
      font-weight: 600;
      text-align: center;
      padding: 0 12px;
      position: relative;
      color: var(--text-primary);
    }
  }
  
  .card-wallpaper {
    height: 220px;
    margin-bottom: 24px;
    z-index: 1;
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border: 4px solid #fff;
    
    .wallpaper-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(1.05) contrast(1.02);
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
  
  .card-footer {
    z-index: 1;
    position: relative;
    margin-top: auto;
    
    .watermark-section {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      opacity: 0.8;
      
      .watermark-icon {
        font-size: 14px;
        color: var(--color-brand);
      }
      
      .card-watermark {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }
    }
  }
}

.modal-footer {
  padding: 16px 24px 20px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  
  .footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    align-items: center;
  }
}

.card-controls {
  padding: 16px 24px;
  background: var(--color-morandi-surface);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .color-palette {
    flex: 1;
    overflow: hidden;
    background: var(--bg-card);
    border-radius: 12px;
    padding: 12px 16px;
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border: 1px solid var(--border-color);
    
    .color-options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      
      .color-btn {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        box-shadow: 
          0 2px 4px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.9);
        }
        
        &.active {
          border-color: #f4d03f;
          border-width: 3px;
          transform: translateY(-2px);
          box-shadow: 
            0 4px 16px rgba(244, 208, 63, 0.25),
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
      }
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
  box-shadow: var(--shadow-lg);
  
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
      font-weight: 300;
      text-transform: none;
      font-size: 24px;
      line-height: 1;
      
      &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 1px;
        background: currentColor;
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
      font-weight: 300;
      font-size: 20px;
      line-height: 1.4;
      text-align: left;
      padding: 0;
      font-style: italic;
    }
  }
  
  .card-wallpaper {
    border-radius: 8px;
    box-shadow: 
      inset 0 1px 1px rgba(0, 0, 0, 0.02),
      0 1px 4px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.02);
    
    &::before {
      opacity: 0.3;
      border-radius: 8px;
    }
    
    .wallpaper-image {
      border-radius: 8px;
      filter: saturate(0.9) brightness(0.96);
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
      font-weight: 300;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
}

// 模板3样式 - 极简国风美学
.share-card.template-3 {
  background: #fefefe;
  border: none;
  box-shadow: var(--shadow-sm);
  padding: 32px;
  
  .card-date-tag {
    position: absolute;
    top: 24px;
    right: 24px;
    margin-bottom: 0;
    
    .date-dot {
      display: none;
    }
    
    span {
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 2px;
      color: #999;
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
  }
  
  .card-quote-section {
    margin-bottom: 40px;
    margin-top: 20px;
    
    .quote-mark {
      display: none;
    }
    
    .card-quote {
      font-size: 22px;
      line-height: 1.8;
      font-weight: 400;
      text-align: center;
      padding: 0;
      letter-spacing: 1px;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 1px;
        background: linear-gradient(90deg, transparent, currentColor, transparent);
        opacity: 0.3;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: -16px;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 1px;
        background: linear-gradient(90deg, transparent, currentColor, transparent);
        opacity: 0.3;
      }
    }
  }
  
  .card-wallpaper {
    height: 180px;
    border-radius: 4px;
    box-shadow: none;
    border: none;
    margin-bottom: 32px;
    position: relative;
    
    &::before {
      display: none;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      pointer-events: none;
    }
    
    .wallpaper-image {
      border-radius: 4px;
      filter: saturate(0.85) contrast(0.95);
    }
    
    .wallpaper-placeholder {
      color: #ccc;
      font-weight: 300;
      font-size: 12px;
    }
  }
  
  .card-footer {
    .watermark-section {
      justify-content: center;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 1px;
        background: currentColor;
        opacity: 0.2;
      }
      
      .watermark-icon {
        display: none;
      }
      
      .card-watermark {
        font-size: 10px;
        font-weight: 400;
        letter-spacing: 3px;
        text-transform: uppercase;
        opacity: 0.6;
      }
    }
  }
}
</style>