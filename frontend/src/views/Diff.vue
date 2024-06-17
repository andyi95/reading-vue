<script setup lang="ts">
import DiffMatchPatch from 'diff-match-patch';
import { ref, watch, computed, nextTick } from 'vue';
import TextParser from "@/helpers/parser";
import {MicCircleSharp} from '@vicons/ionicons5'
import { useSpeechRecognition} from "@vueuse/core";
import { useThemeVars} from "naive-ui";
import {SwapHorizontalOutline} from "@vicons/ionicons5";
import {useMainStore} from "@/store/main";
const store = useMainStore();
const theme = computed(() => store.theme);
const isDark = computed(() => theme.value === 'darkTheme')
const text1 = ref('');
const text2 = ref('');
const text1Ref = ref(null);
const diffResult = ref([]);
const textContent = ref(null);
const currentSegment = ref('');
const lastSegmentLength = ref(0);
const isListening = computed(() => speech.isListening.value)
const isStoppedManually = ref(true);
const toggleSpeechRecognition = () => {
  if (isListening.value){
    isStoppedManually.value = true;
    speech.stop()
  }
  else {
    isStoppedManually.value = false;
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
  lang: store.localeCode
});


watch(speech.result, (result) => {
  if(speech.isListening.value){
    scrollTextInput()
  }
  currentSegment.value = result.substring(lastSegmentLength.value);
  text1.value += currentSegment.value;
  lastSegmentLength.value += result.length - lastSegmentLength.value;
  currentSegment.value = '';
  scrollTextInput()
})
watch(speech.isListening, (isListening) => {
  if (!isListening && !isStoppedManually.value){
    speech.start()
  }
}, {immediate: true})

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
const swapTexts = () => {
  [text1.value, text2.value] = [text2.value, text1.value];

}
const colors = computed(() => ({
  diffDel: isDark.value ? '#fe8a8a' : '#ffff00',
  diffIns: isDark.value ? '#6699cc' : '#00ff00'
}))
</script>

<template>
  <n-space vertical justify="space-between">

    <n-form size="medium">
  <div class="grid grid-cols-1 gap-2 md:grid-cols-2">

      <n-form-item>
        <template #label>
          <div class="inline-flex items-center">
            <span class="w-3 h-3 inline-block rounded-full me-2" :style="{backgroundColor: colors.diffIns}"></span>{{$t('diff.text1Label')}}</div>
        </template>
    <n-input v-model:value="text1"
             :placeholder="$t('diff.firstTextPH')"
             class="w-full" type="textarea" ref="text1Ref" :autosize="{minRows: 4, maxRows: 15}">
      <template #suffix>
              <n-button text class="absolute bottom-0 left-0" @click="toggleSpeechRecognition">
        <n-icon depth="2" size="30" :color="isListening? themeVars.errorColor: themeVars.primaryColor"><MicCircleSharp/></n-icon>
      </n-button>
      </template>
    </n-input>
      </n-form-item>
      <n-form-item>
        <template #label>
          <div class="inline-flex items-center">
            <span class="w-3 h-3 inline-block rounded-full me-2" :style="{backgroundColor: colors.diffDel}"></span>{{$t('diff.text2Label')}}</div>
        </template>
      <n-input
          v-model:value="text2" :placeholder="$t('diff.secondTextPH')" class="w-full" type="textarea"
          :autosize="{minRows: 4, maxRows: 15}" /></n-form-item>
  </div>
    </n-form>
    <n-space>
  <n-button @click="compareTexts" type="primary">{{ $t('diff.compareLabel') }}</n-button>
      <n-button @click="swapTexts" secondary type="primary">
        <span class="pr-1"><n-icon><SwapHorizontalOutline/></n-icon></span>{{$t('diff.swapLabel')}}</n-button>
    </n-space>
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
