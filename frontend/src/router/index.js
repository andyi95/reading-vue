import {createRouter, createWebHistory} from 'vue-router'

import Anticipation from "@/views/Anticipation.vue";
import Text from "@/views/Text";
import Spreeder from "@/views/Spreeder";


const routes = [
  {path: '/', name: 'TextParser', component: Text, meta: {title: "Морфемы"}},
  {path: '/anticipation', name: 'Anticipation', component: Anticipation, meta: {title: "Антиципация"}},
  {path: '/text', name: 'Parser', component: Text, meta: {title: "Морфемы"}},
  {path: '/spreeder', name: 'Spreeder', component: Spreeder, meta: {title: "Чтение на скорость"}},
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

