<template>
<div id="app" :class="{ 'dark': theme === darkTheme }">

<n-config-provider :theme="theme">
  <n-message-provider>
    <div class="hidden md:block">
          <n-layout-header class="w-full flex justify-end items-center px-2 py-1">
            <!-- Mobile Burger Button -->
 <!-- Header Pane for Icons -->
      <!-- Theme and Locale Toggles -->
      <div class="flex items-center space-x-4">
        <n-icon @click="toggleReadMode" v-if="route.meta.hasReadMode" size="30">
          <Book /></n-icon>
        <n-icon @click="changeTheme" size="30">
          <Moon v-if="!isDarkTheme"></Moon>
          <Sunny v-else></Sunny>
        </n-icon>
        <n-button @click="changeLocale">
          {{ locale === 'en' ? 'ru' : 'en' }}
        </n-button>
      </div>
      </n-layout-header>
    <n-layout has-sider sider-placement="left">
                <n-layout-sider collapse-mode="width"
                    :collapsed-width="48"
                          show-trigger="arrow-circle"
                          bordered
                    :width="200">
            <Navigation/>
          </n-layout-sider>
        <n-layout-content >
    <router-view/>
        </n-layout-content>
      <BugReportCard />
      <BugReportButton />
    </n-layout></div>
    <div class="md:hidden flex">
          <n-layout>
          <Navigation/>
        <n-layout-content >
    <router-view/>
        </n-layout-content>
      <BugReportCard />
      <BugReportButton />
          </n-layout>
    </div>

            <n-layout-footer>
        <Footer/>
      </n-layout-footer>

  </n-message-provider>
  </n-config-provider>
  </div>

</template>

<script setup lang="ts">

import {Moon, Sunny, Book} from "@vicons/ionicons5";
import {useMainStore} from "@/store/main";
import {useI18n} from "vue-i18n";
import {defineComponent, computed, ref} from "vue";
import {useSeoMeta, useHead} from "@unhead/vue";
import Navigation from "@/components/Navigation.vue";
import {darkTheme} from "naive-ui";
import BugReportCard from "@/components/BugReportCard.vue";
import BugReportButton from "@/components/BugReportButton.vue";
import {useRoute} from "vue-router";

const { t, locale } = useI18n();
const store = useMainStore();
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const isDarkTheme = computed(function (){
  return store.theme === 'darkTheme'
})
const c_locale = computed(function (){
  return store.locale
})
const route = useRoute();
const changeTheme = () => {
  store.toggleTheme();
  locale.value = c_locale.value
}
const changeLocale = () => {
  store.toggleLocale();
  locale.value = c_locale.value
}
const toggleReadMode = () => {
  store.toggleReadingMode();
}
const currentLanguage = computed(() => store.locale)
useSeoMeta({
  ogTitle: 'Текстовые инструменты',
  ogDescription: 'Инструменты для чтения, обучения и запоминания текстов. Подсчёт слов, раскраска текста, конвертер текста, перемешиватель текста, спридер, таблица Шульте, запись голоса.',
  ogImage: 'https://text-tools.ru/img/og.png',
  twitterImage: 'https://text-tools.ru/img/og.png',
  image: 'https://text-tools.ru/img/og.png'
})
useHead({
  meta: [
    {
      name: 'title',
      content: t('common.metaTitle')
    },
    {
      name: 'description',
      content: t('common.metaDescription')
    },
    {
      name: 'keywords',
      content: t('common.metaTags')
    }
  ]
})
const theme = computed(() => {
  return store.theme === 'darkTheme' ? darkTheme : null
})
</script>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

body, #app, .n-layout-scroll-container, .n-config-provider, .n-layout--static--positioned{
  min-height: 100vh;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  /*height: 100%;*/

}

.n-layout-scroll-container{
  padding-left: .75rem;
  padding-right: .75rem;
  padding-top: .50rem;
  padding-bottom: .25rem;
}
</style>
