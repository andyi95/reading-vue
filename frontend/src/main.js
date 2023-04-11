
import VueGtagPlugin from "vue-gtag";
import App from './App.vue'
import {createApp, inject} from "vue";
import store from './store';
import VueClipboard from "vue3-clipboard";

import router from './router';
import naive from 'naive-ui';

document.title = 'Текстовые инструменты'

const app = createApp(App);
app.config.compilerOptions.whitespace = 'preserve';
app.use(naive).use(router).use(store).use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
});
app.use(VueGtagPlugin, {
    config: {
        id: 'G-181EZLB3NP'
    }
}, router)
app.mount('#app');
