import { createApp } from "vue";
import { createHead} from "@unhead/vue";
import App from './App.vue';
import i18n from "./i18n";
import router from './router';
import naive from 'naive-ui';
import VueGtagPlugin from "vue-gtag";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const head = createHead();
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(naive)
    .use(i18n)
    .use(router)
    .use(pinia)
    .use(head)
    // .use(msClarity, {clarityId: 'kdfwwrinuj'})

if (process.env.NODE_ENV !== 'development') {
    app.use(VueGtagPlugin, {
        config: {
            id: 'G-181EZLB3NP',
            params:{
                app_version: '3.1.0'
            }
            // id: process.env.VITE_GTAG_ID  // dev
        }
    }, router);
}

app.mount('#app');
