<template>

  <n-form size="medium" >
      <BaseInput label="Исходный текст" placeholder="Начните вводить текст"
                 v-model:post-body="postBody" @input-updated="textUpdated($event)">

      </BaseInput>
    <n-space size="medium" class="pb-3">
      <n-card>Всего символов <n-tag :bordered="false">{{charsTotal}}</n-tag></n-card>
      <n-card>Без пробелов <n-tag :bordered="false">{{charsClean}}</n-tag></n-card>
      <n-card>Количество слов<n-tag :bordered="false">{{fetchedText.length}}</n-tag></n-card>
    </n-space>
    <n-space justify="space-between" size="medium">
      <BaseButton label="Раскрасить текст!" @button-clicked="updateText()"/>


      <BaseButton label="Подсчёт количества слов" @button-clicked="countWords()"/>


    </n-space>
    <n-space vertical justify="space-between" class="py-2">
      <BaseCheckbox label="Показать только существительные" v-model:value="options.onlyNouns" @nSwitched="radioUpdated('nouns', $event)"/>
      <BaseCheckbox label="Показать только глаголы" v-model:value="options.onlyVerbs" @n-switched="radioUpdated('verbs', $event)"/>
      <BaseCheckbox label="Оттенки серого" v-model:gray-scale="options.grayScale" @n-switched="grayUpdated($event)"></BaseCheckbox>
    </n-space>
  </n-form>

    <n-card title="Текст для чтения" v-if="grayedText.length && options.grayScale" class="row mb-2 mt-4">
      <span v-for="item in grayedText" :class="item.gray" :key="item.id">{{item.word + ' '}}</span>
    </n-card>

    <n-card title="Текст для чтения" class="row mb-2 mt-4" v-if="fetchedText && fetchedText.length && ! options.grayScale">
    <span v-for="item in fetchedText" :key="item.id" :style="{color: item.color}">{{item.word + ' ' }}</span>
    </n-card>

<div  v-if="countedWords.length" style="padding-top: 2em">
  <n-list hoverable style="padding: 0.8em">
    <n-list-item v-for="word in countedWords">
      <n-card><span>{{word.word}}</span>
        <n-tag type="success" style="position: absolute; right: 10px;">{{word.count}}</n-tag>
      </n-card>
    </n-list-item>
  </n-list></div>
</template>

<script>
import {api} from "@/helpers";
import debounce from "debounce";
import WordCounter from "@/components/WordCounter";
import BaseInput from "@/components/BaseInput";
import BaseCheckbox from "@/components/BaseCheckbox";
import BaseButton from "@/components/BaseButton";
import { useMessage, NSpace, NForm, NFormItem, NList, NListItem, NTag} from "naive-ui";
import {parsedText, countedText} from "@/store/mock";


export default {
  setup(){
    const message = useMessage();
    return {
      warning(text){
        message.warning(text)
      }
    }
  },
  name: "Text",
  components: {BaseButton, BaseCheckbox, WordCounter, BaseInput, NSpace, NForm, NFormItem, NListItem, NList, NTag},
  data() {
    return {
      fetchedText: [],
      cachedText: [],
      countedWords: [],
      errors: [],
      options: {
        onlyVerbs: false,
        onlyNouns: false,
        grayScale: false,
      },
      grayedText: [],
      sourceText: '',
      reText: /[A-Za-zА-Яа-я\s]/g
    }
  },
  computed:{
    charsTotal(){
      let match = this.sourceText.match(this.reText);
      if (match){
        return match.length
      }
      return 0
    },
    charsClean(){
      let match = this.sourceText.replace(/ /g,'').match(this.reText);
      if (match){
        return match.length
      }
      return 0
    }

  },
  methods: {
    updateText() {
      if(process.env.NODE_ENV === 'development') {
        this.fetchedText = parsedText.data
      }
      else {
        api.post('parse/', {
          text: {
            text: this.sourceText
          }
        })
            .then(response => {
              this.fetchedText = response.data;
              if (this.options.onlyVerbs === true || this.options.onlyVerbs === true) {
                this.filterText();
              }
            })
            .catch(e => {
              this.warning("Что-то пошло не так")
            })
      }
      if(this.options.grayScale === true){
        this.grayUpdated(true)
      }
    },
    textUpdated(value){
      this.sourceText = value;
      this.updateText();
    },
    radioUpdated(type, value){
      if (type === 'verbs'){
        this.options.onlyVerbs = value
        this.filterText()
      }
      if (type === 'nouns'){
        this.options.onlyNouns = value
        this.filterText()
      }
      if (type === 'gray'){
        this.options.grayScale = value
        if (value){
          this.grayUpdated(value)
        }
      }
    },
    grayUpdated(value){
      this.options.grayScale = value;
      let gr_results = []
      const TAGS = ['VERB', 'NOUN', 'INF', 'ADJ'];
      var grayText = function (tag){
        if(TAGS.includes(tag)){
          return 'not-gray'
        }
        if (this.$store.state.theme === 'darkTheme') {
          return 'grayed-dark'
        }

        return 'grayed'
      }.bind(this)
      if(value === true){
        gr_results = this.fetchedText.reduce(
            (firstData,item)=>{firstData.push({
              ...item,gray: grayText(item.tag)
            })
              return firstData},[])
        this.grayedText = gr_results;
      }
    },
    countWords() {
      if (process.env.NODE_ENV === 'development'){

        return;
      }
      api.post('count/', {text: this.sourceText})
          .then(response => {
            this.countedWords = response.data
          })
          .catch(e => {
            this.warning("Что-то пошло не так")
          })
    },
    filterText() {
      if (this.options.onlyNouns || this.options.onlyVerbs){
        this.cachedText = this.fetchedText
      }
      if (!this.options.onlyVerbs && !this.options.onlyNouns) {
        this.fetchedText = this.cachedText
        return;
      }
      let nouns = [];
      let verbs = [];
      let union = require('arr-union');
      if (this.options.onlyNouns === true) {
        nouns = this.fetchedText.filter(function (items) {
          return items.tag === 'NOUN'
        });
      }
      if (this.options.onlyVerbs === true) {
        verbs = this.fetchedText.filter(function (item) {
          return item.tag === 'VERB' || item.tag === 'INFN'
        });
      }
      this.fetchedText = union(nouns, verbs)
    }
  },


  created() {
    this.updateText = debounce(this.updateText, 300)
    if(process.env.NODE_ENV !== 'development') {
      return;
    }
    this.countedWords = countedText.data
    this.fetchedText = parsedText.data
    this.sourceText = parsedText.sourceText
  },
}
</script>

<style scoped>
p {
  text-align: left;
}
.n-card.n-card--bordered .n-card__content span{
  font-size: 1.2em;
}
/*.n-card > .n-card__content, .n-card > .n-card__footer*/
.grayed {
  color: #E0E0E0;
}
.grayed-dark{
  color: #767676
}


</style>
