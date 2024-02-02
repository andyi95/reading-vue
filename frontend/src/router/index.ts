import {createRouter, createWebHistory, RouteLocationNormalized, RouteMeta, RouteRecordRaw} from 'vue-router'
import i18n from "@/i18n";

const {t, locale} = i18n.global
const Anticipation = () => import('@/views/Anticipation.vue')
const Text = () => import('@/views/Text.vue')
const Spreeder = () => import('@/views/Spreeder.vue')
const ChaosChars = () => import('@/views/Mixer.vue')
const Schulte = () => import('@/views/Schulte.vue')
const Diff = () => import('@/views/Diff.vue')

const routes: RouteRecordRaw[] = [
  {path: '/', name: 'TextParser', component: Text, meta: {title: t('nav.textparser')}},
  {path: '/anticipation', name: 'Anticipation', component: Anticipation, meta: {title: t('nav.anticipation')}},
  {path: '/text', name: 'Parser', component: Text, meta: {title: t('nav.textparser')}},
  {path: '/spreeder', name: 'Spreeder', component: Spreeder, meta: {title: t('nav.spreeder')}},
  {path: '/mixer', name: 'Mixer', component: ChaosChars, meta: {title: t('nav.mixer')}},
  {path: '/schulte', name: 'Schulte', component: Schulte, meta: {
    title: t('nav.schulte')
  }},
  {path: '/voice', name: 'Voice', component: () => import('@/views/Voice.vue'), meta: {title: t('nav.voice')}},
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {path: '/diff', name: 'Diff', component: Diff, meta: {title: t('nav.diff')}},
  {path: '/:catchAll(.*)', redirect: '/text'}

]
interface RouteLocationWithMeta extends RouteLocationNormalized {
    meta: RouteMeta & { title: string }
}
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes
});
router.beforeEach(async (to, from, next) => {
  // @ts-ignore
  document.title = to.meta.title ? to.meta.title : t('nav.title');
  next();
})

export default router

