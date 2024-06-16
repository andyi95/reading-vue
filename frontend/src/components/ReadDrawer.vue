<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useMainStore} from "@/store/main";
import {computed} from "vue";
const {t} = useI18n();
const store = useMainStore();
const props = defineProps({
  options: {
    type: Object,
    default: () => {}
  },
  fetchedText: {
    type: Array,
    default: () => []
  }
})
const readingMode = computed(() => store.readingMode)
const toggleReadingMode = () => {
  store.toggleReadingMode()
}
const isDarkTheme = computed(() => store.theme === 'darkTheme')
</script>

<template>
  <n-drawer v-model:show="readingMode" placement="top" width="100%" height="100%" @updateShow="toggleReadingMode">
    <n-drawer-content :title="t('common.readingMode')" class="reading-mode" closable @update:show="toggleReadingMode">
      <div v-if="fetchedText && fetchedText.length && ! options.grayScale"
           :class="[{'bg-neutral-200': !options.onlyVerbs && !options.onlyNouns && !isDarkTheme}, 'p-10', 'max-w-2xl', 'mx-auto', 'text-justify']">
        <span v-for="item in fetchedText" :key="item.id" :style="{color: item.color}">{{ item.word + ' ' }}</span>
      </div>
    </n-drawer-content></n-drawer>
</template>

<style scoped>
.reading-mode {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12pt;
  line-height: 1.4;
}

@media (min-width: 425px) {
  .reading-mode {
    font-size: 14pt;
    line-height: 1.6;
  }
}

/* Ensures text is not too wide for reading */
.reading-mode .max-w-2xl {
  max-width: 40rem; /* Optimal line length for reading */
}
</style>