<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="creator-info">
          <Sparkles class="creator-icon" :size="18" weight="fill" />
          <span class="creator-text">Created with ❤️ by <span class="highlight">webkubor(司南烛)</span></span>
        </div>
      </div>
      <div class="footer-right">
        <div class="social-links">
          <a href="https://www.xiaohongshu.com/user/profile/5c3c1581000000000501835d?xsec_token=ABTfMj6hyxBdKl6VBK2GMfj1IL_SbEmMZCldv5T1hs0t0%3D&xsec_source=pc_search" 
             target="_blank" 
             class="social-link xiaohongshu"
             title="访问我的小红书">
            <Heart class="social-icon" :size="18" weight="fill" />
          </a>
          <a href="mailto:webkubor@163.com" 
             class="social-link email"
             title="发送邮件联系">
            <Envelope class="social-icon" :size="18" weight="fill" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { PhEnvelope as Envelope, PhSparkle as Sparkles, PhHeart as Heart } from "@phosphor-icons/vue";
</script>

<style scoped lang="scss">
.footer {
  padding: 20px 32px;
  background: rgba(251, 247, 241, 0.4);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-morandi-line);
  font-family: inherit;
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .footer-left {
    .creator-info {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .creator-icon {
        color: var(--color-brand);
        opacity: 0.8;
      }
      
      .creator-text {
        font-size: 13px;
        color: var(--text-secondary);
        letter-spacing: 0.02em;
        
        .highlight {
          color: var(--text-primary);
          font-weight: 700;
          margin-left: 2px;
        }
      }
    }
  }
  
  .footer-right {
    .social-links {
      display: flex;
      gap: 16px;
      align-items: center;
      
      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        transition: all var(--transition-fast);
        opacity: 0.6;
        
        &:hover {
          opacity: 1;
          color: var(--color-brand-active);
          transform: translateY(-2px);
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