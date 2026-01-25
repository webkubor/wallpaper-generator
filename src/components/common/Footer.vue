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
  padding: 16px 24px;
  background: rgba(251, 247, 241, 0.6);
  backdrop-filter: blur(18px);
  border-top: 1px solid var(--color-morandi-line);
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
        color: var(--color-morandi-sage);
        animation: sparkle 2s ease-in-out infinite;
      }
      
      .creator-text {
        font-size: 14px;
        color: var(--color-morandi-ink);
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
          color: var(--text-primary);
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        &.xiaohongshu:hover .social-icon {
          color: #b46a63;
          opacity: 1;
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