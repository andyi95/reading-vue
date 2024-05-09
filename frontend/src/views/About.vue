<template>
  <div class="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5">
    <n-h2 class="mb-1 text-3xl font-extrabold leading-tight text-gray-900 dark:text-gray-50">{{ aboutContent.pageTitle}}</n-h2>
    <p class="mb-12 text-lg text-gray-500 dark:text-gray-300">{{ aboutContent.pageDescription }}</p>
    <div class="wh-full">
    <n-card class="my-3"
        v-for="(item, index) in aboutContent.aboutContent" :key="index" :title="item.title">
      {{ item.content }}
    </n-card>
      </div>
    <n-h3 class="mb-1 text-2xl font-extrabold leading-tight text-gray-900 dark:text-gray-50"> {{ aboutContent.changeLogTitle }}</n-h3>
    <div class="wh-full">
      <n-timeline>
        <n-timeline-item v-for="(item, idx) in changeLog" :key="idx" :time="item.date.toLocaleDateString()" :content="item.content">
        </n-timeline-item>
      </n-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {createI18n, useI18n} from "vue-i18n";

const aboutMessages = {
  en: {
    pageTitle:'Boost Your Reading Skills',
    pageDescription: 'Text Tools is a collection of online tools designed to help users improve their reading, learning, and memorization skills. The site offers a variety of tools, including a word counter, text coloring, text converter, text mixer, speed reading, Schulte table, and voice recording.',
    aboutContent: [
      {
        title: 'Speed Reading',
        content: 'Our unique speed reading tool allows users to enhance their reading speed by adjusting the text presentation speed and structure.'
      },
      {
        title: 'Dynamic Schulte Table',
        content: 'A classic technique designed to improve peripheral vision and reading speed, implemented in an interactive format that allows customization to fit personal needs.'
      },
      {
        title: 'Comprehension',
        content: 'The tools on our site help develop the ability to anticipate and analyze information, which is essential for effective reading and text comprehension.'
      },
      {
        title: 'Text Comparison',
       content: 'Our text comparison tool not only makes it easy to find differences and similarities between two documents, but also supports voice input, making it an excellent tool for practicing dictation and improving verbal skills. This feature is particularly useful for editors, writers, and anyone looking to enhance their note-taking abilities.'
      },
      {
        title: 'Morphological Analysis',
        content: 'Our morphological analysis tool allows users to quickly and accurately determine the morphological structure of a word, which is useful for language learning and text analysis.'
      },
      {
        title: 'Text-to-Speech',
        content: 'The text-to-speech tool allows users to listen to texts in different languages, which is useful for learning pronunciation and practicing listening skills.'
      },
      {
        title: 'Text Editor',
        content: 'Our text editor allows users to format text, change its structure, and color, which is useful for preparing texts for publication and creating educational materials.'
      }
    ],
    changeLogTitle: 'Changelog'
  },
  ru: {
    pageTitle: 'Улучшите навыки чтения',
    pageDescription: 'Text Tools - это коллекция онлайн-инструментов, разработанных для помощи пользователям в улучшении навыков чтения, обучения и запоминания. Сайт предлагает различные инструменты, включая подсчет слов, раскраску текста, конвертер текста, перемешиватель текста, ускоренное чтение, таблицу Шульте и запись голоса.',
    aboutContent: [
      {
        title: 'Ускоренное чтение',
        content: 'Наш уникальный инструмент для ускоренного чтения позволяет пользователю тренировать навыки быстрого восприятия информации, изменяя скорость показа текста и его структуру.'
      },
      {
        title: 'Динамическая таблица Шульте',
        content: 'Эта классическая техника, предназначенная для тренировки периферийного зрения и улучшения скорости чтения, реализована у нас в интерактивном виде, позволяющем пользователю адаптировать сложность заданий под личные потребности.'
      },
      {
        title: 'Улучшение понимания текстов',
        content: 'Инструменты на нашем сайте позволяют развивать способность предвидеть и анализировать информацию, что незаменимо для эффективного чтения и понимания текста'
      },
{
        title: "Сравнение текстов",
        content: "Наш инструмент сравнения текстов не только позволяет легко находить различия и сходства между двумя документами, но и поддерживает ввод текста голосом, что делает его отличным средством для практики диктантов и улучшения навыков устной речи. Это особенно полезно для редакторов, писателей и всех, кто хочет улучшить свои навыки ведения записей."
      },
      {
        title: 'Морфологический анализ',
        content: 'Наш инструмент морфологического анализа позволяет быстро и точно определить морфологическую структуру слова, что полезно для изучения языка и анализа текстов.'
      },
      {
        title: 'Озвучка текста',
        content: 'Инструмент озвучки текста позволяет прослушивать тексты на разных языках, что полезно для изучения произношения и практики аудирования.'
      },
      {
        title: 'Редактор текста',
        content: 'Наш редактор текста позволяет форматировать текст, изменять его структуру и цвет, что полезно для подготовки текстов к публикации и создания учебных материалов.'
      }
    ],
    changeLogTitle: 'Изменения на проекте'
  }
};

const changeLog = [
  {
    date: new Date('04/01/2023'),
    content: 'Добавили спридер'
  },
  {date: new Date('04/20/2023'), content: 'Добавили дешифровщик'},
  {date: new Date('04/01/2022'), content: 'Старт проекта, основная реализация парсера текстов с подсчётом слов'},
  {date: new Date('03/01/2023'), content: 'Добавили модуль с антиципацией текста'},
  {date: new Date('05/01/2023'), content: 'Перевели сайт на английский язык, добавили переключатель языка'},
  {date: new Date('10/18/2023'), content: 'Релиз таблицы Шульте'}
].sort((a, b) => b.date.getTime() - a.date.getTime());
const {t, locale} = useI18n()
const aboutContent = computed(() => aboutMessages[locale.value])
</script>