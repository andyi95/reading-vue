<template>
  <n-select
    v-model:value="selectedFontSize"
    :options="fontSizeOptions"
    placeholder="Select font size"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const selectedFontSize = ref(10); // Default selected font size

const fontSizeOptions = computed(() => {
  const options = [];
  for (let size = 10; size <= 28; size += 2) {
    options.push({
      label: `${size} pt`,
      value: size
    });
  }
  return options;
});
</script>

<style scoped>
</style>