<template>
  <n-layout-footer class="footer" bordered>
    <div class="footer-content">
      <div class="footer-left">
        <p class="footer-text">
          <n-icon :component="Code" class="footer-icon" /> 
          Designed & Developed by <span class="highlight">webkubor</span>
        </p>
      </div>
      <div class="footer-right">
        <p class="footer-text">
          <n-icon :component="Envelope" class="footer-icon" /> 
          <a href="mailto:webkubor@163.com">webkubor@163.com</a>
        </p>
      </div>
    </div>
  </n-layout-footer>
</template>

<script setup lang="ts">
import { NLayoutFooter, NIcon } from 'naive-ui';
import { PhCode as Code, PhEnvelope as Envelope } from "@phosphor-icons/vue";
</script>

<style scoped lang="scss">
.footer {
  padding: 12px 24px;
  color: var(--n-text-color);
  font-size: 14px;
  min-height: 50px;
  background-color: var(--n-color-modal);
  border-top: 1px solid var(--n-border-color);
  backdrop-filter: blur(10px);
  font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
  
  .footer-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .footer-left, .footer-right {
    display: flex;
    align-items: center;
  }
  
  .footer-text {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.5px;
  }
  
  .highlight {
    color: var(--n-primary-color);
    font-weight: 600;
    letter-spacing: 1px;
  }

  a {
    color: var(--n-primary-color);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    padding-bottom: 2px;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: var(--n-primary-color-hover);
      transition: width 0.3s ease;
    }

    &:hover {
      color: var(--n-primary-color-hover);
      
      &:after {
        width: 100%;
      }
    }
  }
  
  .footer-icon {
    color: var(--n-primary-color);
    font-size: 16px;
  }
}
</style>
