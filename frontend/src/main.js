
import VueGtagPlugin from "vue-gtag";
import App from './App.vue'
import {createApp, inject} from "vue";
import store from './store';

import router from './router';
import naive from 'naive-ui';

document.title = 'Текстовые инструменты'

const app = createApp(App);
app.config.compilerOptions.whitespace = 'preserve';
app.use(naive);
app.use(router);
app.use(store);
app.use(VueGtagPlugin, {
    config: {
        id: process.env.G_ANALYTICS_TID
    }
}, router)
app.mount('#app');
