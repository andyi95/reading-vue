import {createRouter, createWebHistory} from 'vue-router'

import HelloWorld from "@/components/HelloWorld";
// eslint-disable-next-line no-unused-vars
import Home from "@/views/Home";
import Text from "@/views/Text";
import Spreeder from "@/views/Spreeder";


const routes = [
  {path: '/', name: 'TextParser', component: Text, meta: {title: "Морфемы"}},
  // {path: '/login', name: 'Login', component: Login},
  {path: '/text', name: 'Parser', component: Text, meta: {title: "Морфемы"}},
  {path: '/helloworld', name: 'HelloWorld', component: HelloWorld},
  {path: '/spreeder', name: 'Spreeder', component: Spreeder, meta: {title: "Чтение на скорость"}},
  {path: '/:catchAll(.*)', redirect: '/text'},
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
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

