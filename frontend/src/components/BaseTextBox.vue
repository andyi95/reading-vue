<template>
 <n-card :title="title" class="base-text-box">
    <div class="text-content" ref="textContent">
      <slot/>
    </div>
    <div v-if="showCopyButton" class="py-4">
      <n-button type="primary" @click="copyText">{{ copyButtonText }}</n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {defineProps, ref, computed, useSlots} from "vue";

interface Props {
  title?: string;
  copyButtonText?: string;
  showCopyButton?: boolean;
  showContent?: boolean;
}
const textContent = ref('');
const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    copyButtonText: {
      type: String,
      default: 'Copy Text'
    },
    showCopyButton: {
      type: Boolean,
      default: true
    },
    showContent: {
      type: Boolean,
      default: true
    },
});
const slots = useSlots();
const copyText = () => {
  if (textContent.value) {
    const range = document.createRange();
    range.selectNodeContents(textContent.value);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges(); // Clear selection after copy
    }
  }
}
</script>

<style scoped>
.n-card > .n-card__content {
  word-spacing: 0.4em;
  letter-spacing: 0.05em;
  font-size: 16pt;
  text-align: justify;
}

@media (max-width: 768px) {
  .n-card > .n-card__content {
    word-spacing: 0.2em;
    letter-spacing: 0.02em;
    font-size: 12pt;
  }
}

.grayed {
  color: #E0E0E0!important;
}

.grayed-dark {
  color: #767676!important;
}
</style>