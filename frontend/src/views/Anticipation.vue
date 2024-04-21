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

                    <n-form-item :label="$t('common.fontSize')">
              <FontSizeSelect v-model:value="fontSize"/>
            </n-form-item>
      </div>
    </n-form>
  </n-space>

  <BaseTextBox ref="textContent" v-if="parsedText.length > 0">
    <span v-for="item in parsedText" :class="getCharClass(item)">{{item.char}}</span>
  </BaseTextBox>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {NCollapseItem, NForm, NFormItem, NSelect, NSlider, NSpace} from "naive-ui";
import BaseTextBox from "@/components/BaseTextBox.vue";
import charSets from "@/helpers/charSets";
import TextParser from "@/helpers/parser";
import FontSizeSelect from "@/components/FontSizeSelect.vue";
export default {
  name: "Anticipation",
  components: {
    FontSizeSelect,
    NSlider, NCollapseItem, BaseTextBox, BaseButton, BaseInput, NSpace, NForm, NSelect, NFormItem},
  data(){
    return {
      sourceText: '',
      parsedText: [],
      additionalChars: [],
      russianConsonants: charSets.russianAlphabet.selectConsonants,
      fontSize: 16,
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
      this.removeVowels()
    },
    removeVowels(){
      let parser = new TextParser(this.sourceText)
      let parsedText = parser.replaceVowels()
      parsedText.forEach((item, i) => {
        if (this.additionalChars.includes(item.char.toUpperCase()) || item.is_vowel){
          parsedText[i].char = '●'
          parsedText[i].is_vowel = true
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
  },
  computed: {
        fontSizeCSS() {
      return this.fontSize + 'pt'
    }
  }
}
</script>

<style scoped>
.n-card > .n-card__content span{
  word-spacing: 0.4em;
  letter-spacing: 0.05em;
  font-size: v-bind('fontSizeCSS');
  text-align: justify;
}
@media (max-width: 768px) {
    .n-card > .n-card__content span {
        word-spacing: 0.2em;
        letter-spacing: 0.02em;
        font-size: v-bind('fontSizeCSS');
  text-align: justify;
    }
}
.grayed {
  color: #E0E0E0!important;
}
.grayed-dark{
  color: #767676!important;
}
</style>