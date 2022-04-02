<template>
  <div class="container mt-3">
    <div class="form-group">
      <div class="row mb-2">
      <label for="inputtextp0" class="align-right">Исходный текст для форматирования</label>
      <textarea class="form-control" placeholder="Начните вводить текст..." rows="6" id="inputtextp0" v-model="postBody"
                @input=updateText()></textarea></div>
      <!-- @change="postPost()-->
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">


          <button class="btn btn-primary" @click="updateText()">
            Раскрасить текст!
          </button>
        <button class="btn btn-primary" @click="countWords()">Подсчёт количества слов</button>
        </div>
        <div class="d-grid gap-2 d-md-flex">
          <input class="form-check-input" type="checkbox" value="" id="onlyNouns" v-model="onlyNouns">
          <label class="form-check-label" for="onlyNouns">Показать только существительные</label>
          <input class="form-check-input" type="checkbox" value="" id="onlyVerbs" v-model="onlyVerbs">
          <label class="form-check-label" for="onlyVerbs">Показать только глаголы</label>

        </div>
      </div>
    <div class="row mb-2 mt-4" v-if="fetchedText && fetchedText.length">
      <p class="text-justify"><span v-for="item in fetchedText" :key="item.word" :style="{color: item.color}">{{item.word + ' ' }}</span></p>
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
      <div class="accordion accordion-flush container-sm" id="errorsAccordion" v-if="errors && errors.length">
        <ErrorMessage v-for="error of errors" v-bind:key="error" :error="error"/>
      </div>
    </div>
  </div>
</template>

<script>
import {api, fetchText} from "@/helpers";
import debounce from "debounce";
import WordCounter from "@/components/WordCounter";
import ErrorMessage from "@/components/ErrorMessage";


export default {
  name: "Form",
  components: {ErrorMessage, WordCounter},
  data() {
    return {
      fetchedText: [],
      countedWords: [],
      errors: [],
      onlyVerbs: false,
      onlyNouns: false
    }
  },
  methods: {
    updateText() {
            api.post('parse/', {
              text: {
                text: this.postBody
              }
            })
      .then(response => {this.fetchedText = fetchText(response.data, this.onlyNouns, this.onlyVerbs)})
      .catch(e => {
        this.errors.push(e)
      })
    },
    countWords(){
      api.post('count/', {text: this.postBody})
      .then(response => {this.countedWords = response.data})
      .catch(e => {
        this.errors.push(e)
      })
    }
  },
  created() {
    this.updateText = debounce(this.updateText, 300)
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>