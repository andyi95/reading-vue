<template>
    <n-space vertical size="medium" justify="space-between">
        <n-form size="medium">
            <BaseInput :label="$t('common.sourceText')" :placeholder="$t('common.textPlaceHolder')" v-model:post-body="postBody" @input-updated="textUpdated($event)"/>
          <div class="py-5 w-1/3">
          <n-form-item :label="$t('chaos.mode')">
            <n-select v-model:value="cipherMode"
                      :options="cipherModeOptions"
                      @update:value="modeChanged"
            />

          </n-form-item></div>
        </n-form>
        <n-card  ref="textContent" v-if="convertedText && convertedText.length > 1">
            <span>{{ convertedText }}</span>
            <div class="py-4">
      <n-button type="primary" @click="copyText">{{ $t('common.copyText')}}</n-button></div>
        </n-card>
    </n-space>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {NFormItem, NSelect, useMessage} from "naive-ui";
import TextParser from "@/helpers/parser";
import {api} from "@/helpers";
import {ref} from "vue";
import {debounce} from "lodash-es";

export default {
  name: "Mixer",
  components: {NFormItem, NSelect, BaseButton, BaseInput},
  setup() {
    const message = useMessage();
    const textContent = ref(null);
    return {
      warning(text) {
        message.warning($t('common.warning'))
      },
      textContent
    }
  },
  computed: {
    cipherModeOptions() {
      return [
        {label: this.$t('chaos.shuffleLetters'), value: 'chaosLetters'},
        {label: this.$t('chaos.reverseWords'), value: 'reverseWords'},
        {label: this.$t('chaos.seamlessText'), value: 'seamlessText'},
        {label: this.$t('chaos.replaceLetters'), value: 'replaceLetters'},
        {label: this.$t('chaos.normalForm'), value: 'normalForm'},
      ]
    }
  },
  data() {
    return {
      postBody: '',
      convertedText: '',
      cipherMode: 'chaosLetters',
    }
  },
  methods: {
    textUpdated(value) {
      this.postBody = value;
      this.modeChanged()
    },
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
    async fetchText(){
      try{
        const response = await api.post('/parse/', {text: {text: this.postBody}})
        this.convertedText = response.data.sort(
            (a, b) => a.id - b.id).map(
            item => item.normal_form ? item.normal_form : item.word).join(' ')
        }
      catch (e) {
        this.warning(this.$t('common.warnMessage'))
      }
    },
    async modeChanged(value) {
      if (!this.postBody) {
        return
      }
      const parser = new TextParser(this.postBody)
      if (this.cipherMode === 'chaosLetters') {
        this.convertedText = parser.shuffleText()
      }
      if (this.cipherMode === 'replaceLetters') {
        this.convertedText = parser.replaceLetters()
      }
      if (this.cipherMode === 'seamlessText') {
        this.convertedText = parser.seamlessText()
      }
      if (this.cipherMode === 'reverseWords') {
        this.convertedText = parser.reverseWords()
      }
      if (this.cipherMode === 'normalForm') {
        debounce(this.fetchText, 300)
      }
    },
  }
}
</script>

<style scoped>
.n-card{
    margin-top: 1.5em;
}
.n-card.n-card--bordered .n-card__content{
    text-align: center;
    display: flex;
}
.n-card.n-card--bordered .n-card__content span{
    font-size: 1.2em;
    text-align: justify;
    display: flex;

}
</style>