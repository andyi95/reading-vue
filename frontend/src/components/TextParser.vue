<template>

<!--  <n-grid :x-gap="12" :y-gap="8" :rows="1">-->
<!--    <n-grid-item>-->


    <n-form size="medium" >
      <n-form-item label-align="center">
      <BaseInput label="Исходный текст" placeholder="Начните вводить текст"
                 v-model:post-body="postBody" @input-updated="textUpdated($event)">

      </BaseInput>
      </n-form-item>
      <n-space justify="space-between" size="medium">
          <BaseButton label="Раскрасить текст!" @button-clicked="updateText()"/>


        <BaseButton label="Подсчёт количества слов" @button-clicked="countWords()"/>


      </n-space>
      <n-space vertical>
        <BaseCheckbox label="Показать только существительные" v-model="onlyNouns" @nSwitched="filterText()"/>
        <BaseCheckbox label="Показать только глаголы" v-model="onlyVerbs" @n-switched="filterText()"/>
        <BaseCheckbox label="Оттенки серого" v-model="grayScale" @n-switched="grayUpdated"></BaseCheckbox>
      </n-space>
    </n-form>


<div v-if="grayScale && fetchedText && fetchedText.length">
  <n-card title="Текст для чтения">
    <span v-for="item in grayedText" :class="item.gray" :key="item.id">{{item.word + ' '}}</span>
  </n-card>

</div>
    <div class="row mb-2 mt-4" v-if="fetchedText && fetchedText.length">
      <p class="text-justify"><span v-for="item in fetchedText" :key="item.id" :style="{color: item.color}">{{item.word + ' ' }}</span></p>
    </div>
    <div class="card-body p-2">
      <div class="list-group" v-if="countedWords && countedWords.length">
        <ol class="list-group list-group-numbered">
          <li class="list-group-item d-flex justify-content-between align-items-start" v-for="word in countedWords"
              :key="word.count">
            <WordCounter :word="word"/>
          </li>
        </ol>
      </div>
    </div>
</template>

<script>
import {api} from "@/helpers";
import debounce from "debounce";
import WordCounter from "@/components/WordCounter";
import BaseInput from "@/components/BaseInput";
import BaseCheckbox from "@/components/BaseCheckbox";
import BaseButton from "@/components/BaseButton";
import { useMessage, NSpace, NForm, NFormItem } from "naive-ui";

export default {
  setup(){
    const message = useMessage();
    return {
      warning(text){
        message.warning(text)
      }
    }
  },
  name: "Form",
  components: {BaseButton, BaseCheckbox, WordCounter, BaseInput, NSpace, NForm, NFormItem},
  data() {
    return {
      fetchedText: [],
      countedWords: [],
      errors: [],
      onlyVerbs: false,
      onlyNouns: false,
      grayScale: true,
      postBody: String,
      grayedText: []
    }
  },
  methods: {
    updateText() {
      api.post('parse/?gray=' + this.grayScale, {
        text: {
          text: this.postBody
        }
      })
          .then(response => {
            this.fetchedText = response.data;
            if (this.onlyVerbs === true || this.onlyVerbs === true) {
              this.filterText();
            }
          })
          .catch(e => {
            this.warning("Что-то пошло не так")
          })
      if(this.grayScale === true){
        this.grayUpdated(true)
      }
    },
    textUpdated(value){
      this.postBody = value;
      this.updateText();
    },
    grayUpdated(value){
      if (this.postBody.length > 0 && this.fetchedText.length === 0){
        this.updateText()
      }
      this.grayScale = value;
      let new_elem = [];
      this.TAGS = ['VERB', 'NOUN', 'INF', 'ADJ'];
      if(value === true){
        this.gr_results = this.fetchedText.reduce(
            (firstData,item)=>{firstData.push({...item,gray: this.TAGS.includes(item.tag) ? 'not-gray': 'grayed'})
          return firstData},[])
        this.grayedText = this.gr_results;
      }
    },
    countWords() {
      api.post('count/', {text: this.postBody})
          .then(response => {
            this.countedWords = response.data
          })
          .catch(e => {
            this.warning("Что-то пошло не так")
          })
    },
    filterText() {
      if (this.onlyVerbs === false && this.onlyNouns === false) {
        this.updateText();
      }
      let nouns = [];
      let verbs = [];
      let union = require('arr-union');
      if (this.onlyNouns === true) {
        nouns = this.fetchedText.filter(function (items) {
          return items.tag === 'NOUN'
        });
      }
      if (this.onlyVerbs === true) {
        verbs = this.fetchedText.filter(function (item) {
          return item.tag === 'VERB' || item.tag === 'INFN'
        });
      }
      this.fetchedText = union(nouns, verbs)
    }
  },


  created() {
    this.updateText = debounce(this.updateText, 300)
  },
}
</script>

<style scoped>
p {
  text-align: left;
}

.grayed {
  color: #E0E0E0;
}


</style>
