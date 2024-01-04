import { createApp } from "vue";
import App from './App.vue';
import store from './store';
import i18n from "./i18n";
import router from './router';
import naive from 'naive-ui';
import VueGtagPlugin from "vue-gtag";
const app = createApp(App);

app.use(naive)
    .use(i18n)
    .use(router)
    .use(store);

if (process.env.NODE_ENV !== 'development') {
    app.use(VueGtagPlugin, {
        config: {
            // cookie_domain: 'text-tools.ru',
            cookie_domain: 'reader.dev.andyi95.com',
            // id: 'G-181EZLB3NP'  // prod
            id: 'G-K1BZEB1T2Y'  // dev
            // id: process.env.VITE_GTAG_ID
        }
    }, router);
}

app.mount('#app');
