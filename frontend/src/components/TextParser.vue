<template>
  <div class="container">
    <div class="form-group">
      <div class="row mb-2">
      <label for="inputtextp0">Исходный текст для форматирования</label>
      <textarea class="form-control" placeholder="Начните вводить текст..." rows="6" id="inputtextp0" v-model="postBody"
                @input=updateText()></textarea></div>
      <!-- @change="postPost()-->
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-primary" @click="postPost()">
            Раскрасить текст!
          </button>
        <button class="btn btn-primary" @click="countWords()">Подсчёт количества слов</button>
        </div>
      </div>
    <div class="row mb-2 mt-4" v-if="fetchedText && fetchedText.length">
      <p class="text-justify"><span v-for="item in fetchedText" :key="item.word" :style="{color: item.color}">
        {{item.word }}&nbsp;</span></p>
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
import axios from "axios";
import debounce from "debounce";
import WordCounter from "@/components/WordCounter";
import ErrorMessage from "@/components/ErrorMessage";

const instance = axios.create({
  baseURL: "/api/",
  timeout: 1000,
});

export default {
  name: "Form",
  components: {ErrorMessage, WordCounter},
  data() {
    return {
      fetchedText: [
    {
        "word": "Привет,",
        "color": "#0000ff"
    },
    {
        "word": "я",
        "color": "#BACC81"
    },
    {
        "word": "дверь!",
        "color": "#0000ff"
    },
    {
        "word": "Интеграция",
        "color": "#0000ff"
    },
    {
        "word": "традиционно",
        "color": "#478C5C"
    },
    {
        "word": "специфицирует",
        "color": "#000080"
    },
    {
        "word": "социометрический",
        "color": "#009933"
    },
    {
        "word": "анализ",
        "color": "#0000ff"
    },
    {
        "word": "рыночных",
        "color": "#009933"
    },
    {
        "word": "цен.",
        "color": "#0000ff"
    }],
      postBody: '',
      countedWords: [
    {
        "word": "привет",
        "count": 1
    },
    {
        "word": "я",
        "count": 2
    },
    {
        "word": "дверь",
        "count": 10
    },
    {
        "word": "интеграция",
        "count": 1
    },
    {
        "word": "традиционно",
        "count": 1
    },
    {
        "word": "специфицировать",
        "count": 1
    }],
      errors: []
    }
  },
  methods: {
    postPost() {
      instance.post('parse/', {
        text: this.postBody
      })
      .then(response => {this.fetchedText = response.data})
      .catch(e => {
        this.errors.push(e)
      })
    },
    updateText() {
            instance.post('parse/', {
        text: this.postBody
      })
      .then(response => {this.fetchedText = response.data})
      .catch(e => {
        this.errors.push(e)
      })
    },
    countWords(){
      instance.post('count/', {text: this.postBody})
      .then(response => {this.countedWords = response.data})
      .catch(e => {
        this.errors.push(e)
      })
    }
  },
  created() {
    this.updateText = debounce(this.updateText, 300)
  }

  // props: {
  //   'fetchedText': 1
  // }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>