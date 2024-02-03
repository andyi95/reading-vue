<script lang="ts">
import DiffMatchPatch from 'diff-match-patch';
import { ref } from 'vue';
import { mapState } from 'vuex';
import TextParser from "@/helpers/parser";
export default {
  methods: {
    copyText() {
      let textToCopy = this.$refs.textContent;
      let blob = textToCopy.$el;
      const range = document.createRange();
      range.selectNode(blob);
      window.getSelection().removeAllRanges()
      const selection = window.getSelection();
      selection.addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges()
    },
  },
  computed: {
    ...mapState(['theme']),
    isDark() {
      return this.theme === 'darkTheme';
    }
  },
  setup() {
    const text1 = ref('');
    const text2 = ref('');
    const diffResult = ref([]);
    const generateDiffHtml = (diffs: []) => {
      let result = [];
      for (let i = 0; i < diffs.length; i++) {
        let operation = diffs[i][0];
        let text = diffs[i][1];
        let cssClass = '';
        switch (operation) {
          case DiffMatchPatch.DIFF_INSERT:
            cssClass = 'diff-ins';
            break;
          case DiffMatchPatch.DIFF_DELETE:
            cssClass = 'diff-del'
            break;
          case DiffMatchPatch.DIFF_EQUAL:
            cssClass = 'diff-equal';
            break;
        }
        result.push({text: text, cssClass: cssClass});
      }
      return result
    };
    const textContent = ref(null);
    const compareTexts = () => {
      const diff = TextParser.compareTexts(text1.value, text2.value);
      diffResult.value = generateDiffHtml(diff);
    };

    return {
      text1,
      text2,
      diffResult,
      compareTexts, textContent
    };
  }
};
</script>

<template>
  <n-space vertical justify="space-between">
  <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
    <n-input v-model:value="text1" :placeholder="$t('diff.firstTextPH')" class="w-full h-32" type="textarea"></n-input>
      <n-input v-model:value="text2" :placeholder="$t('diff.secondTextPH')" class="w-full h-32" type="textarea"></n-input>
  </div>
  <n-button @click="compareTexts" type="primary">{{ $t('diff.compareLabel') }}</n-button>
    <n-card class="text-2xl" v-if="diffResult.length > 0" content-class="text-2xl" :ref="textContent">
      <span class="text-2xl" v-for="(item, index) in diffResult" :key="index"
            :class="[item.cssClass, {'dark': isDark}]">{{ item.text }}</span>
      <template #footer>
      <n-button type="primary" @click="copyText">{{ $t('common.copyText')}}</n-button></template>
    </n-card>
  </n-space>
</template>

<style scoped>

.diff-del {
  background-color: #ffff00;
  text-decoration-line: line-through;
}
.diff-ins {
  background-color: #00ff00;
  text-decoration-line: underline;
}
.diff-del.dark{
  background-color: #fe8a8a;
}
.diff-ins.dark {
  background-color: #6699cc;
}
</style>