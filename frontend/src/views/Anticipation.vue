<template>
  <n-space vertical size="medium" justify="space-between">
    <n-form size="medium">
      <BaseInput :label="$t('common.sourceText')" :placeholder="$t('common.textPlaceHolder')"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>
        <n-space justify="space-between" size="small">
            <BaseButton :label="$t('common.removeVowels')" @buttonClicked="removeVowels()"/>
            <BaseButton :label="$t('common.copyText')"  @button-clicked="copyText()"/>
        </n-space>
    </n-form>
<!--    <BaseTextBox title="Текст для чтения"-->

      <BaseTextBox :title="$t('common.textContent')" ref="textContent">
<!--      <BaseButton label="скопировать" @buttonClicked="copyText()"/>-->
      <span v-for="item in parsedText" :class="getCharClass(item)">{{item.char}}</span>
      </BaseTextBox>
  </n-space>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {NForm, NSpace} from "naive-ui";
import TextParser from "@/helpers/text-parser";
import BaseTextBox from "@/components/BaseTextBox.vue";
import {useI18n} from "vue-i18n";
export default {
  name: "Anticipation",
  components: {BaseTextBox, BaseButton, BaseInput, NSpace, NForm},
    setup(){
      const { t } = useI18n();
      return{
          t
      }
    },
  data(){
    return {
      sourceText: '',
      parsedText: []
    }
  },
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
    textUpdated(value){
      this.sourceText = value
    },
    removeVowels(){
      let parser = new TextParser(this.sourceText)
      let parsedText = parser.replaceVowels()
      parsedText.forEach(function (item, i, arr){
        if(item.is_vowel){
          parsedText[i].char = '●'
        }
      })
      this.parsedText = parsedText
    },
    getCharClass(item){
      if (item.is_vowel){
        if (this.$store.state.theme === 'darkTheme'){
          return 'grayed-dark'
        }
        return 'grayed'
      }

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