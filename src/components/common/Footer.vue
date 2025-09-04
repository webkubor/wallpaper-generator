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
              <a href="https://www.xiaohongshu.com/user/profile/5c3c1581000000000501835d?xsec_token=ABTfMj6hyxBdKl6VBK2GMfj1IL_SbEmMZCldv5T1hs0t0%3D&xsec_source=pc_search" 
                 target="_blank" 
                 class="social-link xiaohongshu">
                <n-icon :component="Heart" class="social-icon" />
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
import { PhEnvelope as Envelope, PhSparkle as Sparkles, PhHeart as Heart } from "@phosphor-icons/vue";
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
