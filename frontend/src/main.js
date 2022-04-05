import {fakeBackend} from "./helpers";
fakeBackend();

import App from './App.vue'
import {createApp} from "vue";
import router from './router';

document.title = 'Текстовые инструменты'
const app = createApp(App);
app.config.compilerOptions.whitespace = 'preserve';
app.use(router).mount('#app');
