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
            id: process.env.VITE_GTAG_ID
        }
    }, router);
}

app.mount('#app');
