<template>
  <n-space vertical size="medium" justify="space-between">
    <n-form size="medium">
      <BaseInput label="Текст для чтения" placeholder="Вставьте или введите текст для упражнения"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>
<BaseButton label="Убрать гласные" @buttonClicked="removeVowels()"/>
    </n-form>
<!--    <BaseTextBox title="Текст для чтения"-->

    <n-card title="Текст для чтения" v-if="parsedText && parsedText.length">
<!--      <BaseButton label="скопировать" @buttonClicked="copyText()"/>-->
      <span v-for="item in parsedText" :class="getCharClass(item)">{{item.char}}</span>
    </n-card>
  </n-space>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {NForm, NSpace} from "naive-ui";
import TextParser from "@/helpers/text-parser";
import BaseTextBox from "@/components/BaseTextBox.vue";
export default {
  name: "Anticipation",
  components: {BaseTextBox, BaseButton, BaseInput, NSpace, NForm},
  data(){
    return {
      sourceText: '',
      parsedText: []
    }
  },
  methods: {
    copyText(){
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
.n-card .n-card__content span{
  font-size: 1.2em;
}
.n-card > .n-card__content, .n-card{
  word-spacing: 1.3em;
  color: rgba(31, 34, 37, 0.89);
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