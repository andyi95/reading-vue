<template>
  <div id="app" :class="{ 'dark': theme === darkTheme }">
    <n-config-provider :theme="theme">
      <n-message-provider>
        <!-- Header and Sider for large screens -->
        <n-layout v-if="isDesktop">
          <n-layout-header class="w-full flex justify-end items-center px-2 py-1">
            <!-- Header Pane for Icons -->
            <div class="flex items-center space-x-4">
              <n-icon @click="toggleReadMode" v-if="route.meta.hasReadMode" size="30">
                <Book /></n-icon>
              <n-icon @click="changeTheme" size="30">
                <Moon v-if="!isDarkTheme" />
                <Sunny v-else />
              </n-icon>
              <n-button @click="changeLocale">
                {{ locale === 'en' ? 'ru' : 'en' }}
              </n-button>
            </div>
          </n-layout-header>

          <!-- Sidebar for larger screens -->
          <n-layout has-sider>
          <n-layout-sider collapse-mode="width"
                          :collapsed-width="48"
                          show-trigger="arrow-circle"
                          bordered default-collapsed
                          :width="200">
            <Navigation />
          </n-layout-sider>

          <n-layout-content>
            <!-- Single router-view for all screen sizes -->
            <router-view />
          </n-layout-content>
        </n-layout>
          <BugReportCard />
          <BugReportButton />
        </n-layout>

        <!-- Layout for small screens -->
        <n-layout v-else>
          <!-- Mobile Layout -->
          <div class="mobile-header flex justify-between items-center px-2 py-1">
            <!-- Theme and Locale Toggles in Mobile -->
            <div class="flex items-center space-x-4">
              <n-icon @click="toggleReadMode" v-if="route.meta.hasReadMode" size="30">
                <Book /></n-icon>
              <n-icon @click="changeTheme" size="30">
                <Moon v-if="!isDarkTheme" />
                <Sunny v-else />
              </n-icon>
              <n-button @click="changeLocale">
                {{ locale === 'en' ? 'ru' : 'en' }}
              </n-button>
            </div>
          </div>

          <n-layout-content>
            <Navigation />
            <!-- Single router-view reused for mobile -->
            <router-view />
          </n-layout-content>

        </n-layout>

        <n-layout-footer>
          <Footer />
        </n-layout-footer>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">

import {Moon, Sunny, Book} from "@vicons/ionicons5";
import {useMainStore} from "@/store/main";
import {useI18n} from "vue-i18n";
import {defineComponent, computed, ref, onMounted, onBeforeUnmount} from "vue";
import {useSeoMeta, useHead} from "@unhead/vue";
import Navigation from "@/components/Navigation.vue";
import {darkTheme} from "naive-ui";
import BugReportButton from "@/components/BugReportButton.vue";
import {useRoute} from "vue-router";
import BugReportCard from "@/components/BugReportCard.vue";

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
const isDesktop = computed(() => windowWidth.value >= 768); // Tailwind 'md' breakpoint

const handleResize = () => {
  windowWidth.value = window.innerWidth;
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
});
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
.ck-balloon-panel, .ck-powered-by, .ck-balloon-panel_visible, .ck-powered-by-balloon{
  display: none!important;
}
.n-layout-scroll-container {
  padding: 0.75rem;
}


</style>
