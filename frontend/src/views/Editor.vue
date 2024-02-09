<script setup lang="ts">

import {QuillEditor} from "@vueup/vue-quill";
import {ref, computed} from "vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {useStore} from "vuex";
const store = useStore();
const isDarkTheme = computed(() => store.state.theme === 'darkTheme');
const content = ref('')

</script>

<template>
  <QuillEditor theme="snow" v-model:content="content" content-type="html" :class="{'quill-editor-dark': isDarkTheme}"/>
</template>

<style scoped>
/* Dark theme styles for Quill toolbar */
.quill-editor-dark .ql-toolbar {
  background-color: #333; /* Dark background */
  color: #fff!important; /* Light text */
  div {
    @apply bg-white;
  }
}
.quill-editor-dark .ql-snow {
  stroke: #f3faff!important;
}

.quill-editor-dark .ql-toolbar.ql-snow {
  color: #fff; /* Light text for dropdown labels */
}

.quill-editor-dark .ql-toolbar.ql-snow button {
  color: #fff; /* Light text for buttons */
}
</style>