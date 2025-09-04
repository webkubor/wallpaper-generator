<template>
  <n-layout-footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="creator-info">
          <n-icon :component="Sparkles" class="creator-icon" />
          <span class="creator-text">Created with ❤️ by <span class="highlight">webkubor</span></span>
        </div>
      </div>
      <div class="footer-right">
        <div class="social-links">
          <n-tooltip trigger="hover">
            <template #trigger>
              <a href="https://www.xiaohongshu.com/user/profile/5c3c1581000000000501835d?xsec_token=ABTfMj6hyxBdKl6VBK2GMfj1IL_SbEmMZCldv5T1hs0t0%3D&xsec_source=pc_search" 
                 target="_blank" 
                 class="social-link xiaohongshu">
                <svg viewBox="0 0 24 24" class="social-icon">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 5.728-.896 5.728-.514 2.267-2.718 2.267-2.718 2.267s-.637.131-1.022.131c-.386 0-1.022-.131-1.022-.131s-2.204 0-2.718-2.267c0 0-.727-3.87-.896-5.728C8.296 8.16 8.16 7.68 8.16 7.68s.136-.48.136-.96c0-.48-.136-.96-.136-.96s.136-.48.136-.96c0-.48-.136-.96-.136-.96s.48-.48.96-.48.96.48.96.48.48.48.48.96c0 .48-.48.96-.48.96s.48.48.48.96c0 .48-.48.96-.48.96s.48.48.48.96c0 .48-.48.96-.48.96s.48.48.48.96c0 .48-.48.96-.48.96z" fill="#ff2442"/>
                </svg>
              </a>
            </template>
            访问我的小红书
          </n-tooltip>
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(244, 208, 63, 0.2);
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
        color: #f4d03f;
        font-size: 18px;
        animation: sparkle 2s ease-in-out infinite;
      }
      
      .creator-text {
        font-size: 14px;
        color: var(--n-text-color);
        opacity: 0.8;
        
        .highlight {
          background: linear-gradient(135deg, #f4d03f 0%, #ff9a56 100%);
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
        background: rgba(244, 208, 63, 0.1);
        border: 1px solid rgba(244, 208, 63, 0.3);
        transition: all 0.3s ease;
        text-decoration: none;
        
        &:hover {
          background: rgba(244, 208, 63, 0.2);
          border-color: rgba(244, 208, 63, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 208, 63, 0.2);
        }
        
        .social-icon {
          width: 18px;
          height: 18px;
          color: var(--n-text-color);
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        &.xiaohongshu:hover .social-icon {
          color: #ff2442;
          opacity: 1;
        }
        
        &.email:hover .social-icon {
          color: #f4d03f;
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
</style>
