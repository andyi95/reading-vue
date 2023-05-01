import {createRouter, createWebHistory} from 'vue-router'
const Anticipation = () => import('@/views/Anticipation.vue')
const Text = () => import('@/views/Text.vue')
const Spreeder = () => import('@/views/Spreeder.vue')
const ChaosChars = () => import('@/views/Mixer.vue')
import i18n from "@/i18n";

const routes = [
  {path: '/', name: 'TextParser', component: Text, meta: {title: "Морфемы"}},
  {path: '/anticipation', name: 'Anticipation', component: Anticipation, meta: {title: "Антиципация"}},
  {path: '/text', name: 'Parser', component: Text, meta: {title: "Морфемы"}},
  {path: '/spreeder', name: 'Spreeder', component: Spreeder, meta: {title: "Чтение на скорость"}},
  {path: '/mixer', name: 'Mixer', component: ChaosChars, meta: {title: "Дешифровщик"}},
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
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : "Текстовые инструменты"
  next()
})

export default router

