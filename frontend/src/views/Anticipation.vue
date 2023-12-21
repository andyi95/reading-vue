<template>
  <n-space vertical size="medium" justify="space-between">
    <n-form size="medium">
      <BaseInput :label="$t('common.sourceText')" :placeholder="$t('common.textPlaceHolder')"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>

      <div class="py-5 w-1/3">
      <n-form-item :label="$t('anticipation.selectChars')">
        <n-select v-model:value="additionalChars"
                  multiple :options="russianConsonants"
                  :placeholder="$t('anticipation.placeHolderSelect')"
                  @update:value="removeVowels"
        />
      </n-form-item>
        <n-form-item :label="$t('anticipation.Mode')">
          <n-select v-model:value="cipherMode"
                    :options="cipherModeOptions"
                    :placeholder="$t('anticipation.placeHolderSelect')"
                    @update:value="removeVowels"
          />
</n-form-item>
      </div>
    </n-form>
  </n-space>
<BaseTextBox v-if="parsedText.length > 0">
  {{parsedText}}
</BaseTextBox>

      <BaseTextBox ref="textContent" v-if="parsedText.length > 0">
      <div v-if="cipherMode === 'dropLetters'">
        <span v-for="item in parsedText" :class="getCharClass(item)">{{item.char}}</span>
      </div>
        <div v-else>
          {{parsedText.map(item=> item.char).join('')}}
        </div>
        <div class="py-4">
          <BaseButton :label="$t('common.copyText')"  @button-clicked="copyText()"/></div>
      </BaseTextBox>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import { NForm, NFormItem, NSelect, NSpace } from "naive-ui";
import TextParser from "@/helpers/parser";
import BaseTextBox from "@/components/BaseTextBox.vue";
import charSets from "@/helpers/charSets";
export default defineComponent({
  name: "Anticipation",
  components: { BaseTextBox, BaseButton, BaseInput, NSpace, NForm, NSelect, NFormItem },
  setup() {
    const sourceText = ref<string>('');
    const cipherMode = ref<string>('dropLetters');
    const parsedText = ref<any[]>([]);
    const additionalChars = ref<string[]>([]);
    const russianConsonants = charSets.russianAlphabet.selectConsonants;


  const copyText = () => {
          let textToCopy = this.$refs.textContent;
          let blob = textToCopy.$el;
          const range = document.createRange();
          range.selectNode(blob);
          window.?getSelection().?removeAllRanges()
          const selection = window.getSelection();
          selection.addRange(range);
          document.execCommand("copy");
          window.getSelection().removeAllRanges()
      }
    const textUpdated = (value: string) => {
      sourceText.value = value;
      const parser = new TextParser(sourceText.value);
      switch (cipherMode.value) {
        case 'dropLetters':
          parsedText.value = removeVowels();
          break;
        case 'replaceLetters':
          parsedText.value = parser.replaceLetters();
          break;
        case 'seamlessText':
          parsedText.value = parser.seamlessText();
          break;
          // Add other cases as needed
      }
    };
    removeVowels(){
      let parser = new TextParser(this.sourceText)
      let parsedText = parser.replaceVowels()
      parsedText.forEach((item, i) => {
        if (this.additionalChars.includes(item.char.toUpperCase()) || item.is_vowel){
          parsedText[i].char = '●'
          parsedText[i].is_vowel = true
        }
      })
      return parsedText
    },
    getCharClass(item){
      if (item.is_vowel){
        if (this.$store.state.theme === 'darkTheme'){
          return 'grayed-dark'
        }
        return 'grayed'
      }
    }
  },
  computed: {
    cipherModeOptions(){
      return [
        {label: this.$t('anticipation.dropLetters'), value: 'dropLetters'},
        {label: this.$t('anticipation.replaceLetters'), value: 'replaceLetters'},
        {label: this.$t('anticipation.seamlessText'), value: 'seamlessText'},
        {label: this.$t('anticipation.reverseText'), value: 'reverseText'},
        {label: this.$t('anticipation.substitutionText'), value: 'substitutionText'}
      ]
    }
  }
}
</script>

<style scoped>
.n-card > .n-card__content span{
  word-spacing: 1.3em;
  font-size: 14pt;
  /*font-weight: 200;*/
}
.grayed {
  color: #E0E0E0!important;
}
.grayed-dark{
  color: #767676!important;
}
</style>