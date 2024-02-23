import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import i18n from "@/i18n";

const {t, locale} = i18n.global
const Anticipation = () => import('@/views/Anticipation.vue')
const Text = () => import('@/views/Text.vue')
const Spreeder = () => import('@/views/Spreeder.vue')
const ChaosChars = () => import('@/views/Mixer.vue')
const Schulte = () => import('@/views/Schulte.vue')
const Diff = () => import('@/views/Diff.vue')

const routes: RouteRecordRaw[] = [
  {path: '/', name: 'TextParser', component: Text, meta: {title: t('nav.textparser'),
    tags: t('textparser.metaTags'), description: t('textparser.metaDescription')
  }},
  {path: '/anticipation', name: 'Anticipation', component: Anticipation, meta: {
    title: t('nav.anticipation'), tags: t('anticipation.metaTags'), description: t('anticipation.metaDescription')
  }},
  {path: '/text', name: 'Parser', component: Text, meta: {
    title: t('nav.textparser'), tags: t('textparser.metaTags'), description: t('textparser.metaDescription')
  }},
  {path: '/spreeder', name: 'Spreeder', component: Spreeder, meta: {
    title: t('nav.spreeder'), tags: t('spreeder.metaTags'), description: t('spreeder.metaDescription')
  }},
  {path: '/mixer', name: 'Mixer', component: ChaosChars, meta: {
    title: t('nav.mixer'), tags: t('chaos.metaTags'), description: t('chaos.metaDescription')
  }},
  {path: '/schulte', name: 'Schulte', component: Schulte, meta: {
    title: t('nav.schulte'), tags: t('schulte.metaTags'), description: t('schulte.metaDescription')
  }},
  {path: '/voice', name: 'Voice', component: () => import('@/views/Voice.vue'), meta: {
    title: t('nav.voice'), tags: t('voice.metaTags'), description: t('voice.metaDescription')
  }},
  {path: '/diff', name: 'Diff', component: Diff, meta: {
      title: t('nav.diff'), tags: t('diff.metaTags'), description: t('diff.metaDescription')
    }},
  {path: '/editor', name: 'Editor', component: () => import('@/views/Editor.vue'), meta: {
    title: t('editor.metaTitle'), tags: t('editor.metaTags'), description: t('editor.metaDescription')}
    },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {path: '/:catchAll(.*)', redirect: '/text'}

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes
});


export default router
