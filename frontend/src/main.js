
import VueGtagPlugin from "vue-gtag";
import App from './App.vue'
import {createApp, inject} from "vue";
import store from './store';
import VueClipboard from "vue3-clipboard";
import i18n from "@/i18n";
import router from './router';
import naive from 'naive-ui';


const app = createApp(App);
app.config.compilerOptions.whitespace = 'preserve';
app.use(naive).use(i18n).use(router).use(store).use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
});

app.mount('#app');
