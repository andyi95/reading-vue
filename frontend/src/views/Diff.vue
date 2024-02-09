<script setup lang="ts">
import DiffMatchPatch from 'diff-match-patch';
import { ref, watch, computed, nextTick } from 'vue';
import {useStore} from 'vuex';
import TextParser from "@/helpers/parser";
import {MicCircleSharp} from '@vicons/ionicons5'
import { useSpeechRecognition} from "@vueuse/core";
import { useThemeVars} from "naive-ui";

const store = useStore();
const theme = computed(() => store.state.theme);
const isDark = computed(() => theme.value === 'darkTheme')
const text1 = ref('');
const text2 = ref('');
const text1Ref = ref(null);
const diffResult = ref([]);
const textContent = ref(null);
const currentSegment = ref('');
const lastSegmentLength = ref(0);
const isListening = computed(() => speech.isListening.value)
const toggleSpeechRecognition = () => {
  if (isListening.value){
    speech.stop()
  }
  else {
    lastSegmentLength.value = 0;
    speech.start()
  }
}
const copyText = () => {
  if (!textContent.value) return;
  const range = document.createRange();
  range.selectNode(textContent.value.$el);
  window.getSelection()?.removeAllRanges();
  const selection = window.getSelection();
  selection?.addRange(range);
  document.execCommand('copy');
  selection?.removeAllRanges();
}
const scrollTextInput = () => {
  nextTick(() => {
    const textInputElement = text1Ref.value;
    if (textInputElement){
      text1Ref.value.scrollTo({top: text1Ref.value.value.length})
    }
  })
}
const speech = useSpeechRecognition({
  continuous: true,
  interimResults: true,
  lang: store.getters.localeCode
});


watch(speech.result, (result) => {
  if(speech.isListening.value){
    scrollTextInput()
  }
  currentSegment.value = result.substring(lastSegmentLength.value);
})
watch(speech.isFinal, (isFinal) => {
  if (true) {
    text1.value += currentSegment.value;
    lastSegmentLength.value = text1.value.length;
    currentSegment.value = '';
    scrollTextInput()
  }
})

const themeVars = useThemeVars();
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
const compareTexts = () => {
  if (!text1.value || !text2.value){
    return;
  }
  const diff = TextParser.compareTexts(text1.value, text2.value);
  // @ts-ignore
  diffResult.value = generateDiffHtml(diff);
};

</script>

<template>
  <n-space vertical justify="space-between">
  <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
    <n-input v-model:value="text1"
             :placeholder="$t('diff.firstTextPH')"
             class="w-full" type="textarea" ref="text1Ref" :autosize="{minRows: 4, maxRows: 15}">
      <template #suffix>
              <n-button text class="absolute bottom-0 left-0" @click="toggleSpeechRecognition">
        <n-icon depth="2" size="30" :color="isListening? themeVars.errorColor: themeVars.primaryColor"><MicCircleSharp/></n-icon>
      </n-button>
      </template>
    </n-input>


      <n-input
          v-model:value="text2" :placeholder="$t('diff.secondTextPH')" class="w-full" type="textarea"
          :autosize="{minRows: 4, maxRows: 15}" />
  </div>
  <n-button @click="compareTexts" type="primary">{{ $t('diff.compareLabel') }}</n-button>
    <n-card class="text-2xl" v-if="diffResult.length > 0" content-class="text-2xl" ref="textContent">
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