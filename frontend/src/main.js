import {fakeBackend} from "./helpers";
fakeBackend();

import App from './App.vue'
import {createApp} from "vue";
import router from './router'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/base.css'

const app = createApp(App);
app.config.compilerOptions.whitespace = 'preserve';
app.use(router).mount('#app');
