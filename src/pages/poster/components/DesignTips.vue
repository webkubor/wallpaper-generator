<template>
  <div class="design-tips">
    <BaseCard title="设计建议">
      <div class="collapse-group">
        <details class="collapse-item">
          <summary class="collapse-title">🎨 视觉层级</summary>
          <div class="collapse-content">
            <p><strong>主体突出：</strong>封面里的焦点（人物、产品、关键词）一定要放在视觉中心，保持简洁，不要被背景干扰。</p>
            <p><strong>留白：</strong>适度留白能让信息更有呼吸感，避免内容堆满。</p>
          </div>
        </details>

        <details class="collapse-item">
          <summary class="collapse-title">🖼️ 图片选择</summary>
          <div class="collapse-content">
            <p><strong>高清真实感：</strong>避免模糊或过度拼接。小红书用户更偏好真实清晰的照片感。</p>
            <p><strong>统一风格：</strong>比如清新日系、ins 高级感、国潮风格等，尽量固定一种视觉调性，增强账号辨识度。</p>
            <p><strong>光影氛围：</strong>自然光 > 闪光灯，营造温暖、轻松、真实的观感。</p>
          </div>
        </details>

        <details class="collapse-item">
          <summary class="collapse-title">🔠 字体排版</summary>
          <div class="collapse-content">
            <p><strong>关键词突出：</strong>封面文字只放 3-6 个字，比如"必看攻略""秋季穿搭"。</p>
            <p><strong>字号分层：</strong>大字作为标题，小字辅助，不要平均分布。</p>
            <p><strong>字体选择：</strong>简洁无衬线字体（黑体、圆体）更适合手机端阅读；避免花哨难读的字。</p>
            <p><strong>对比色：</strong>背景和文字要有足够对比，保证清晰可读。</p>
          </div>
        </details>

        <details class="collapse-item">
          <summary class="collapse-title">🎨 配色建议</summary>
          <div class="collapse-content">
            <p><strong>统一账号色系：</strong>封面长期用 2-3 个主色调，养成用户记忆。</p>
            <p><strong>常见搭配：</strong></p>
            <ul>
              <li>高级感 → 黑白灰 + 金属色</li>
              <li>少女感 → 粉色 + 米白 + 浅灰</li>
              <li>清新感 → 薄荷绿 + 天空蓝 + 米白</li>
              <li>生活感 → 大地色系（棕、米、绿色）</li>
            </ul>
          </div>
        </details>

        <details class="collapse-item">
          <summary class="collapse-title">🪄 其他细节</summary>
          <div class="collapse-content">
            <p><strong>避免信息过载：</strong>不要在封面放太多文字，正文笔记才是详细说明。</p>
            <p><strong>小红书感：</strong>可以加点手写风贴纸、图标元素（爱心、箭头、星星），让封面更"软萌"或更"氛围感"。</p>
            <p><strong>一致性：</strong>系列笔记最好用相似的排版模板，提高识别度。</p>
          </div>
        </details>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '../../../components/base/BaseCard.vue';
</script>

<style scoped lang="scss">
.design-tips {
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;
}

.collapse-item {
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
}

.collapse-title {
  cursor: pointer;
  padding: 14px 0;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
  list-style: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &::-webkit-details-marker {
    display: none;
  }
  
  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--text-secondary);
    border-bottom: 2px solid var(--text-secondary);
    transform: rotate(45deg);
    transition: transform 0.2s;
    margin-right: 8px;
  }
}

details[open] .collapse-title::after {
  transform: rotate(225deg);
}

.collapse-content {
  padding-bottom: 16px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  
  p {
    margin: 8px 0;
  }
  
  ul {
    padding-left: 20px;
    margin: 8px 0;
    
    li {
      margin-bottom: 4px;
    }
  }
  
  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
}
</style>