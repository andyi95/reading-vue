<template>

  <div class="flex relative md:hidden max-w-screen-xl">
      <n-button
          @click="show = true" class="content-end justify-end fixed z-10 end-5"
          :bordered="false" aria-label="Open main menu">
        <span class="sr-only">Open main menu</span>
        <div class="burger-menu">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0,0,256,256">
            <g fill="#63e2b7" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M2,9v2h46v-2zM2,24v2h46v-2zM2,39v2h46v-2z"></path></g></g>
          </svg></div>
      </n-button>
  </div>

  <div class="hidden md:flex flex-col" id="navbar-default">
<n-menu v-model:value="activeKey" mode="vertical" :options="navLinks"/>
  </div>
  <n-drawer v-model:show="show" width="50vw"
            class="md:hidden"
            :max-width="190">
    <n-drawer-content closable>
      <n-menu v-model:value="activeKey" mode="vertical" :options="navLinks" style="height: 70vh"/>

      <!-- Theme and Locale Toggles for Mobile -->
      <div class="flex justify-center mt-2 space-x-2">
        <n-icon @click="toggleReadMode" v-if="route.meta.hasReadMode" size="30">
          <Book/></n-icon>
        <n-icon @click="changeTheme" size="30">
          <Moon v-if="!isDarkTheme"></Moon>
          <Sunny v-else></Sunny>
        </n-icon>
        <n-button @click="changeLocale">
          {{locale === 'en' ? 'ru': 'en'}}
        </n-button>
      </div>

    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import type {Component} from 'vue';
import {computed, watch, h, ref} from "vue";
import {RouterLink } from 'vue-router';
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {Moon, Sunny, Book} from "@vicons/ionicons5";
import {useHead, useSeoMeta} from "@unhead/vue";
import {useMainStore} from "@/store/main";
import { NIcon } from 'naive-ui';

import {DocumentText, Speedometer, Eye, Key, Grid, Mic, GitCompare, Create} from '@vicons/ionicons5';
import {KeyboardAltOutlined, ShuffleRound} from '@vicons/material';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const  navLinks = [
  {
    label: () =>
        h(
        RouterLink,
        {
          to: {
            name: 'TextParser'
          }
        },
        {default: () => t('nav.textparser')}
),
key: 'textparser',
    icon: renderIcon(DocumentText)
},
{
  label: () =>
      h(
          RouterLink,
          {
            to: {
              name: 'Spreeder'
            },
          },{ default: () => t('nav.spreeder')}
      ),
      key: 'spreeder',
  icon: renderIcon(Speedometer)
},
{
  label: () =>
      h(
          RouterLink,
          {
            to: {
              name: 'Anticipation'
            },
          },{ default: () => t('nav.anticipation')}
      ),
      key: 'anticipation',
  icon: renderIcon(Eye)
},
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'Keyboard'
              }, },
            { default: () => t('nav.typing')}
        ),
  key: 'keyboard',
    icon: renderIcon(KeyboardAltOutlined)
  },
{
  label: () =>
      h(
          RouterLink,
          {
            to: {
              name: 'Mixer'
            },
          },{ default: () => t('nav.mixer')}
      ),
      key: 'mixer',
  icon: renderIcon(ShuffleRound)
},
{
  label: () =>
      h(RouterLink, {to: {name: 'Schulte'}}, {default: () => t('nav.schulte')}),
      key: 'schulte',
  icon: renderIcon(Grid)
},
{
  label: () =>
      h(RouterLink, {to: {name: 'Voice'}}, {default: () => t('nav.voice')}),
      key: 'voice',
  icon: renderIcon(Mic)
},
{
  label: () =>
      h(RouterLink, {to: {name: 'Diff'}}, {default: () => t('nav.diff')}),
      key: 'diff',
  icon: renderIcon(GitCompare)
},
  {
    label: () =>
        h(RouterLink, {to: {name: 'Editor'}}, {default: () => t('nav.editor')}), key: 'editor',
    icon: renderIcon(Create)
  }
]
const { t, locale } = useI18n();
const store = useMainStore();
const router = useRouter();
const route = useRoute();
const show = ref(false);
const activeKey = computed(() => {
  return route.name?.toString().toLowerCase() || 'textparser'
});

const c_locale = computed(function (){
  return store.locale
})
const isDarkTheme = computed(function (){
  return store.theme === 'darkTheme'
})
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
  title: computed(() => t('common.metaTitle')),
  description: computed(() => t('common.metaDescription')),
  keywords: computed(() => t('common.metaTags')),
})
let head = useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://text-tools.ru' + route.path
    }
  ],
  htmlAttrs: {
    lang: currentLanguage.value
  },
  meta: [
    {
      name: 'title',
      content: route.meta.title
    },
    {
      "http-equiv": 'content-language',
      content: currentLanguage.value
    },
    {
      name: 'description',
      content: route.meta.description as string
    },
    {
      name: 'keywords',
      content: route.meta.tags as string
    }
  ]
})
watch(
    () => route.path,
    (newPath) => {
      useHead({
        title: route.meta.title,
        link: [
          {
            rel: 'canonical',
            href: 'https://text-tools.ru' + route.path
          }
        ],
        htmlAttrs: {
          lang: currentLanguage.value
        },
        meta: [
          {
            "http-equiv": 'content-language',
            content: currentLanguage.value
          },
          {
            name: 'description',
            content: route.meta.description as string
          },
          {
            name: 'keywords',
            content: route.meta.tags as string
          }
        ]
      })
    })

</script>

<style>
.burger-menu {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  overflow: hidden;
}
.n-drawer .n-drawer-content .n-drawer-body-content-wrapper {
  padding: 0;
}

</style>
