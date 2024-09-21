<script setup lang="ts">

import Editor from "@tinymce/tinymce-vue";
import {ref, computed, watch, onMounted} from "vue";
import {RawEditorOptions} from "tinymce";
import {useI18n} from "vue-i18n";
import {debounce} from "lodash-es";
import {useMainStore} from "@/store/main";
import {useMessage} from "naive-ui";

const {t} = useI18n();
const store = useMainStore();
const message = useMessage();
const isDarkTheme = computed(() => store.theme === 'darkTheme');
const content = ref('')
const editorRef = ref(null)
const contentLoaded = ref(false)
const themeOptions = computed(() => {
  return isDarkTheme.value ? {
    skin: 'oxide-dark',
    content_css: 'dark'
  } : {
    skin: 'oxide',
    content_css: 'default',

  }
})
const readingMode = computed(() => store.readingMode);
const toggleReadingMode = () => {
  store.toggleReadingMode();
};
const initOptions: RawEditorOptions = computed(() => {
  return {
    apiKey: 'qio5lqnb7x60kzj2dz6yfeukslhpfm1ufiqo8ll3dkk9ykul',
    height: 750,
    ...themeOptions.value,
    menubar: false,
    branding: false,
    language: 'ru',
    selector: 'textarea#classic',
    toolbar: 'undo redo | fontsize fontfamily | bold italic underline | forecolor backcolor | ' +
        'alignleft aligncenter alignright alignjustify | bullist numlist | searchreplace charmap emoticons',
    plugins: 'lists searchreplace charmap emoticons',
    content_style: 'body { font-family: Arial, sans-serif; font-size: 12pt; }',
  }
})
const debouncedSave = debounce((newValue: string) => {
  store.saveEditorContent(newValue);
}, 1000)

watch(content, (newValue) => {
  if(!contentLoaded.value) return;
  debouncedSave(newValue);
}, { deep: true , immediate: false});

onMounted(() => {
  const tenMinutes = 1000 * 60 * 10;
  const now = Date.now();
  if(!store.editorContent.content){
    return;
  }
  content.value = store.editorContent.content || '';
  contentLoaded.value = true;
})
</script>

<template>
    <n-drawer v-model:show="readingMode" placement="top" width="100%" height="100%" @updateShow="toggleReadingMode">
    <n-drawer-content :title="t('common.readingMode')" class="reading-mode" closable @update:show="toggleReadingMode">
      <div class="p-10 max-w-2xl mx-auto text-justify">
        <div v-if="content">{{ content }}</div>
      </div>
    </n-drawer-content>
    </n-drawer>
<div class="pt-1 pl-16">
  <n-h1 class="m-0">{{ t('editor.title')}}</n-h1>
</div>
  <div class="editor-unit">
  <Editor
      ref="editorRef"
      :init="initOptions"
      v-model="content"
      api-key="qio5lqnb7x60kzj2dz6yfeukslhpfm1ufiqo8ll3dkk9ykul"
  />
    <n-button type="tertiary" @click="manualSave">Сохранить</n-button>
  </div>
</template>

<style scoped>

@media only screen and (min-width: 768px) {
  .editor-unit {
    padding: 60px;
    padding-top: 30px;
    margin-bottom: 30px;
    border-radius: 6px;
  }
}
@media screen and (max-width: 768px){
  .editor-unit {
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 6px;
  }
}

</style>