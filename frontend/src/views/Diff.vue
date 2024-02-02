<script lang="ts">
import DiffMatchPatch from 'diff-match-patch';
import { ref } from 'vue';

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
  setup() {
    const text1 = ref('');
    const text2 = ref('');
    const diffResult = ref('');

    const dmp = new DiffMatchPatch();
    const generateDiffHtml = (diffs: []) => {
      let html = [];
      for (let i = 0; i < diffs.length; i++) {
        let operation = diffs[i][0];
        let text = diffs[i][1];
        switch (operation) {
          case DiffMatchPatch.DIFF_INSERT:
            html[i] = '<ins class="diff-ins">' + text + '</ins>';
            break;
          case DiffMatchPatch.DIFF_DELETE:
            html[i] = '<del class="diff-del">' + text + '</del>';
            break;
          case DiffMatchPatch.DIFF_EQUAL:
            html[i] = '<span>' + text + '</span>';
            break;
        }
      }
      return html.join('');
    };

    const compareTexts = () => {
      const diff = dmp.diff_main(text1.value, text2.value);
      diffResult.value = generateDiffHtml(diff);
    };

    return {
      text1,
      text2,
      diffResult,
      compareTexts
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
  <n-button @click="compareTexts" type="primary">Compare</n-button>
    <n-card>
      <div v-html="diffResult"></div>
      <n-button type="primary" @click="copyText">{{ $t('common.copyText')}}</n-button>
    </n-card>
  </n-space>
</template>

<style scoped>
.diff-del {
  background-color: #fe8a8a;
}
.diff-ins {
  background-color: #b4fbb8;
}
</style>