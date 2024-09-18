<template>
<div id="app" :class="{ 'dark': theme === darkTheme }">

<n-config-provider :theme="theme">
  <n-message-provider>
    <n-layout>
    <n-layout has-sider sider-placement="left">
          <n-layout-sider collapse-mode="width"
                    :collapsed-width="64"
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
    </n-layout>
            <n-layout-footer>
        <Footer/>
      </n-layout-footer>
      </n-layout>
  </n-message-provider>
  </n-config-provider>
  </div>

</template>

<script setup lang="ts">
import {useMainStore} from "@/store/main";
import {useI18n} from "vue-i18n";
import {defineComponent, computed, ref} from "vue";
import {useSeoMeta, useHead} from "@unhead/vue";
import Navigation from "@/components/Navigation.vue";
import {darkTheme} from "naive-ui";
import BugReportCard from "@/components/BugReportCard.vue";
import BugReportButton from "@/components/BugReportButton.vue";
const store = useMainStore();
const {t} = useI18n();
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
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
