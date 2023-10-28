import {createRouter, createWebHistory} from 'vue-router'
import {loadLayoutMiddleware} from "@/router/middleware";
const Anticipation = () => import('@/views/Anticipation.vue')
const Text = () => import('@/views/Text.vue')
const Spreeder = () => import('@/views/Spreeder.vue')
const ChaosChars = () => import('@/views/Mixer.vue')
const Schulte = () => import('@/views/Schulte.vue')

const routes = [
  {path: '/', name: 'TextParser', component: Text, meta: {title: "Морфемы"}},
  {path: '/anticipation', name: 'Anticipation', component: Anticipation, meta: {title: "Антиципация"}},
  {path: '/text', name: 'Parser', component: Text, meta: {title: "Морфемы"}},
  {path: '/spreeder', name: 'Spreeder', component: Spreeder, meta: {title: "Чтение на скорость"}},
  {path: '/mixer', name: 'Mixer', component: ChaosChars, meta: {title: "Дешифровщик"}},
  {path: '/schulte', name: 'Schulte', component: Schulte, meta: {
    title: "Тренажер «Шульте» ",
      layout: 'no-scroll'
  }},
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
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? to.meta.title : "Текстовые инструменты"
    await loadLayoutMiddleware(to)
  next()
})

export default router

