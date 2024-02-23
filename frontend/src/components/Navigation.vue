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

  <div class="hidden md:flex" id="navbar-default">
<n-menu v-model:value="activeKey" mode="horizontal" :options="navLinks" style="height: 60px"/>
    <div class="ml-auto flex items-center space-x-4">
      <n-icon @click="changeTheme" size="30">
        <Moon v-if="!isDarkTheme" ></Moon>
        <Sunny v-else></Sunny>
      </n-icon>
      <n-button @click="changeLocale">
        {{locale === 'en' ? 'ru': 'en'}}
        </n-button>
    </div>
  </div>
  <n-drawer v-model:show="show" width="50vw"
            class="md:hidden"
            :max-width="190">
    <n-drawer-content closable>
      <n-menu v-model:value="activeKey" mode="vertical" :options="navLinks" style="height: 70vh"/>

      <!-- Theme and Locale Toggles for Mobile -->
      <div class="flex justify-center mt-2 space-x-2">
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
import {computed, watch, h, ref} from "vue";
import {RouterLink } from 'vue-router';
import {useThemeVars} from 'naive-ui';
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {Moon, Sunny} from "@vicons/ionicons5";
import {useHead, useSeoMeta} from "@unhead/vue";

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
key: 'text'
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
      key: 'spreeder'
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
      key: 'anticipation'
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
      key: 'mixer'
},
{
  label: () =>
      h(RouterLink, {to: {name: 'Schulte'}}, {default: () => t('nav.schulte')}),
      key: 'schulte'
},
{
  label: () =>
      h(RouterLink, {to: {name: 'Voice'}}, {default: () => t('nav.voice')}),
      key: 'voice'
},
{
  label: () =>
      h(RouterLink, {to: {name: 'Diff'}}, {default: () => t('nav.diff')}),
      key: 'diff'
},
  {
    label: () =>
        h(RouterLink, {to: {name: 'Editor'}}, {default: () => t('nav.editor')}), key: 'editor'
  }
]
const { t, locale } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();
const show = ref(false);
const activeKey = computed(() => {
  return route.name?.toString().toLowerCase() || 'textparser'
});

const c_locale = computed(function (){
  return store.state.locale
})
const isDarkTheme = computed(function (){
  return store.state.theme === 'darkTheme'
})
const changeTheme = () => {
  store.commit('SWITCH_THEME')
  locale.value = c_locale.value
}
const changeLocale = () => {
  store.commit('SWITCH_LOCALE')
  locale.value = c_locale.value
}
const currentLanguage = computed(() => store.state.locale)
useSeoMeta({
  title: computed(() => t('common.metaTitle')),
  description: computed(() => t('common.metaDescription')),
  keywords: computed(() => t('common.metaTags')),
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
router.beforeEach(async (to, from, next) => {
  const description = to.meta.description ? to.meta.description : t('common.metaDescription');
  const tags = to.meta.tags ? to.meta.tags : t('common.metaTags');
  const title = to.meta.title ? to.meta.title : t('common.metaTitle');

  // @ts-ignore
  // document.title = to.meta.title ? to.meta.title : t('nav.title');
  next();
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
