<template>
  <div class="design-tips">
    <n-card title="设计建议" size="small">
      <n-collapse>
        <n-collapse-item title="🎨 视觉层级" name="visual">
          <n-text depth="2">
            <p><n-text strong>主体突出：</n-text>封面里的焦点（人物、产品、关键词）一定要放在视觉中心，保持简洁，不要被背景干扰。</p>
            <p><n-text strong>留白：</n-text>适度留白能让信息更有呼吸感，避免内容堆满。</p>
          </n-text>
        </n-collapse-item>

        <n-collapse-item title="🖼️ 图片选择" name="image">
          <n-text depth="2">
            <p><n-text strong>高清真实感：</n-text>避免模糊或过度拼接。小红书用户更偏好真实清晰的照片感。</p>
            <p><n-text strong>统一风格：</n-text>比如清新日系、ins 高级感、国潮风格等，尽量固定一种视觉调性，增强账号辨识度。</p>
            <p><n-text strong>光影氛围：</n-text>自然光 > 闪光灯，营造温暖、轻松、真实的观感。</p>
          </n-text>
        </n-collapse-item>

        <n-collapse-item title="🔠 字体排版" name="typography">
          <n-text depth="2">
            <p><n-text strong>关键词突出：</n-text>封面文字只放 3-6 个字，比如"必看攻略""秋季穿搭"。</p>
            <p><n-text strong>字号分层：</n-text>大字作为标题，小字辅助，不要平均分布。</p>
            <p><n-text strong>字体选择：</n-text>简洁无衬线字体（黑体、圆体）更适合手机端阅读；避免花哨难读的字。</p>
            <p><n-text strong>对比色：</n-text>背景和文字要有足够对比，保证清晰可读。</p>
          </n-text>
        </n-collapse-item>

        <n-collapse-item title="🎨 配色建议" name="color">
          <n-text depth="2">
            <p><n-text strong>统一账号色系：</n-text>封面长期用 2-3 个主色调，养成用户记忆。</p>
            <p><n-text strong>常见搭配：</n-text></p>
            <n-ul>
              <n-li>高级感 → 黑白灰 + 金属色</n-li>
              <n-li>少女感 → 粉色 + 米白 + 浅灰</n-li>
              <n-li>清新感 → 薄荷绿 + 天空蓝 + 米白</n-li>
              <n-li>生活感 → 大地色系（棕、米、绿色）</n-li>
            </n-ul>
          </n-text>
        </n-collapse-item>

        <n-collapse-item title="🪄 其他细节" name="details">
          <n-text depth="2">
            <p><n-text strong>避免信息过载：</n-text>不要在封面放太多文字，正文笔记才是详细说明。</p>
            <p><n-text strong>小红书感：</n-text>可以加点手写风贴纸、图标元素（爱心、箭头、星星），让封面更"软萌"或更"氛围感"。</p>
            <p><n-text strong>一致性：</n-text>系列笔记最好用相似的排版模板，提高识别度。</p>
          </n-text>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NCollapse, NCollapseItem, NText, NUl, NLi } from 'naive-ui';
</script>

<style scoped lang="scss">
.design-tips {
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;
}
</style>
