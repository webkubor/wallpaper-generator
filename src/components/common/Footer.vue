<template>
  <n-layout-footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="creator-info">
          <n-icon :component="Sparkles" class="creator-icon" />
          <span class="creator-text">Created with ❤️ by <span class="highlight">webkubor(司南烛)</span></span>
        </div>
      </div>
      <div class="footer-right">
        <div class="social-links">
          <n-tooltip trigger="hover">
            <template #trigger>
              <a href="mailto:webkubor@163.com" class="social-link email">
                <n-icon :component="Envelope" class="social-icon" />
              </a>
            </template>
            发送邮件联系
          </n-tooltip>
        </div>
      </div>
    </div>
  </n-layout-footer>
</template>

<script setup lang="ts">
import { NLayoutFooter, NIcon, NTooltip } from 'naive-ui';
import { PhEnvelope as Envelope, PhSparkle as Sparkles } from "@phosphor-icons/vue";
</script>

<style scoped lang="scss">
.footer {
  padding: 16px 24px;
  background: rgba(251, 247, 241, 0.6);
  backdrop-filter: blur(18px);
  border-top: 1px solid var(--morandi-line);
  font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-left {
    .creator-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .creator-icon {
        color: var(--morandi-sage);
        font-size: 18px;
        animation: sparkle 2s ease-in-out infinite;
      }
      
      .creator-text {
        font-size: 14px;
        color: var(--morandi-ink);
        opacity: 0.8;
        
        .highlight {
          background: linear-gradient(135deg, #c7b5a5 0%, #9aa7a1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
          margin-left: 4px;
        }
      }
    }
  }
  
  .footer-right {
    .social-links {
      display: flex;
      gap: 12px;
      align-items: center;
      
      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(154, 167, 161, 0.12);
        border: 1px solid rgba(154, 167, 161, 0.3);
        transition: all 0.3s ease;
        text-decoration: none;
        
        &:hover {
          background: rgba(154, 167, 161, 0.22);
          border-color: rgba(154, 167, 161, 0.55);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(154, 167, 161, 0.22);
        }
        
        .social-icon {
          width: 18px;
          height: 18px;
          color: var(--n-text-color);
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        &.email:hover .social-icon {
          color: #9aa7a1;
          opacity: 1;
        }
      }
    }
  }
}

@keyframes sparkle {
  0%, 100% { 
    opacity: 0.8; 
    transform: scale(1);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1);
  }
}

/* 平板与小屏（<= 768px）适配 */
@media (max-width: 768px) {
  .footer {
    padding: 12px 16px;
    .footer-content {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
    .footer-left {
      .creator-info {
        .creator-text { font-size: 13px; }
      }
    }
    .footer-right {
      width: 100%;
      .social-links {
        justify-content: flex-start;
        .social-link { width: 32px; height: 32px; }
        .social-icon { width: 16px; height: 16px; }
      }
    }
  }
}

/* 极小屏（<= 480px）适配 */
@media (max-width: 480px) {
  .footer {
    display: none; /* 移动端隐藏与操作无关的页脚 */
  }
}
</style>
