<template>
  <div class="file-uploader">
    <input 
      type="file" 
      ref="fileInput" 
      class="hidden-input" 
      :accept="accept" 
      @change="handleFileChange" 
    />
    <n-button @click="triggerUpload" v-bind="$attrs">
      <slot>{{ btnText }}</slot>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NButton } from 'naive-ui';

interface Props {
  accept?: string;
  btnText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  btnText: '选择文件'
});

const emit = defineEmits<{
  (e: 'select', payload: { file: File, url: string }): void
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        emit('select', { file, url: e.target.result as string });
      }
      // Reset input so the same file can be selected again if needed
      if (input) input.value = ''; 
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
.hidden-input {
  display: none;
}
.file-uploader {
  display: inline-block;
}
</style>
