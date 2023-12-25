<template>
    <n-space vertical size="medium" justify="space-between">
        <n-form size="medium">
            <BaseInput :label="$t('common.sourceText')" :placeholder="$t('common.textPlaceHolder')" v-model:post-body="postBody" @input-updated="textUpdated($event)"/>
          <n-form-item :label="$t('chaos.mode')">
            <n-select v-model:value="cipherMode"
                      :options="cipherModeOptions"
                      @update:value="modeChanged"
            />

          </n-form-item>
        </n-form>
        <n-card  v-if="convertedText && convertedText.length > 1">
            <span ref="textContent">{{ convertedText }}</span>
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
export default {
    name: "Mixer",
    components: {NFormItem, NSelect, BaseButton, BaseInput},
    setup(){
        const message = useMessage();
        return{
            warning(text){
                message.warning(text)
            }
        }
    },
  computed: {
    cipherModeOptions(){
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
        textUpdated(value){
          this.postBody = value;
            this.modeChanged()
        },
      async fetchNormalForms(text){
          const chunkSize = 100;
          let words = text.split(' ')
        for(let i = 0; i < words.length; i += chunkSize){
          const chunk = words.slice(i, i + chunkSize).join(' ')
          api.post('/parse', {text: {text: chunk}})
        }

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
 async modeChanged(value){
   if (!this.postBody){
     return
   }
   const parser = new TextParser(this.postBody)
   if (this.cipherMode === 'chaosLetters'){
     this.convertedText = parser.shuffleText()
   }
   if (this.cipherMode === 'replaceLetters'){
     this.convertedText = parser.replaceLetters()
   }
   if (this.cipherMode === 'seamlessText'){
     this.convertedText = parser.seamlessText()
   }
   if (this.cipherMode === 'reverseWords'){
     this.convertedText = parser.reverseWords()
   }
   if (this.cipherMode === 'normalForm'){
     api.post('/parse', {text: {text: this.postBody}}).then(res => {
       this.convertedText = res.data.map(item => item.normal_form).join(' ')

     }).catch(err => {
       this.warning(err.response.data.message)
     })
   }
 },
        chaosChars(){
            const reg = /^[a-zа-я]+$/i;
            function getRandomInt(n){
                var min = Math.ceil(1)
                var max = Math.floor(n-1)
                return Math.floor(Math.random() * (max - min) + min);
            }
            function shuffleWord(word){
                var output = ''
                var isGet = 1
                var arr = word.split('')
                var n = arr.length;
                for(var i = 0; i < n; ++i){
                    if(i===0 || i >= n -1 || !reg.test(arr[i])){
                        continue
                    }
                    var j = getRandomInt(n);
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
                return arr.join('');
            }
            var words = this.postBody.replace(/[^a-zа-я0-9]|\r\n|\n|\r/gi, ' ').split(' ')
            var newArr = []
            for (var word of words){
                if (word.length < 3){
                    newArr.push(word)
                    continue;
                }
                newArr.push(shuffleWord(word.replace(/[^a-zа-я0-9]/gi, '')))
            }
            this.convertedText = newArr.join(' ')
        }
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