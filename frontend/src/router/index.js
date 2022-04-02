import {createRouter, createWebHistory} from 'vue-router'
import TextParser from "@/components/TextParser";
import Login from "@/components/LoginButton";
import IGAccount from "@/components/IGAccount";
import HelloWorld from "@/components/HelloWorld";
// eslint-disable-next-line no-unused-vars
import Home from "@/views/Home";
import Text from "@/views/Text";


const routes = [
  {path: '/', name: 'TextParser', component: Text},
  {path: '/login', name: 'Login', component: Login},
  {path: '/instagram', name: 'IGAccount', component: IGAccount},
  {path: '/text', name: 'Parser', component: TextParser},
  {path: '/helloworld', name: 'HelloWorld', component: HelloWorld},
  // {path: '/:catchAll(.*)', redirect: '/'},
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
  routes
});
export default router

