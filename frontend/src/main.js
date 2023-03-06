
import DefaultLayout from './layout/index.vue';
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
// app.component('default-layout', DefaultLayout)
app.mount('#app');
