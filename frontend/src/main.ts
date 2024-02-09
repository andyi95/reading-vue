import { createApp } from "vue";
import { createHead} from "@unhead/vue";
import App from './App.vue';
import store from './store';
import i18n from "./i18n";
import router from './router';
import naive from 'naive-ui';
import VueGtagPlugin from "vue-gtag";
const app = createApp(App);
const head = createHead();
app.use(naive)
    .use(i18n)
    .use(router)
    .use(store)
    .use(head);

if (process.env.NODE_ENV !== 'development') {
    app.use(VueGtagPlugin, {
        config: {
            // 'cookie_domain': 'text-tools.ru',
            cookie_domain: 'reader.dev.andyi95.com',
            // id: 'G-181EZLB3NP',  // prod7
            id: 'G-K1BZEB1T2Y'  // dev
        }
    }, router);
}

app.mount('#app');
