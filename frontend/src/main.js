import {fakeBackend} from "./helpers";
fakeBackend();

import App from './App.vue'
import {createApp} from "vue";
import router from './router'

import { errorInterceptor, initFacebookSdk } from "./helpers";
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
errorInterceptor();

initFacebookSdk().then(startApp);

function startApp() {
    createApp(App).use(router).mount('#app');
}
