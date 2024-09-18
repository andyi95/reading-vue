import { createApp, getCurrentInstance } from "vue";
import { createHead} from "@unhead/vue";
import App from './App.vue';
import i18n from "./i18n";
import router from './router';
import naive from 'naive-ui';
import VueGtagPlugin from "vue-gtag";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import msClarity from "@/plugins/ms-clarity";
import {useMainStore} from "@/store/main";
import {useComponentStore} from "@/store/componentStore";


const app = createApp(App);
const head = createHead();
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(naive)
    .use(i18n)
    .use(router)
    .use(pinia)
    .use(head)
    // .use(msClarity, {clarityId: 'kdfwwrinuj'})

if (process.env.NODE_ENV !== 'development') {
    app.use(VueGtagPlugin, {
        config: {
            id: 'G-181EZLB3NP',  // prod7
            // id: process.env.VITE_GTAG_ID  // dev
        }
    }, router);
}
app.mixin({
    mounted() {
        const store = useComponentStore();
        this.$nextTick(() => {
            if (this.$el){
                this.$el.addEventListener('click', (event) => {
                    store.logInteraction({
                        event_type: 'click',
                        component: this.$options.name || 'unnamed component',
                        value: null, data: null
                    });
                })
            }
            if (this.$el.tagName === 'INPUT' && this.$el.type === 'text') {
                this.$el.addEventListener('input', (event) => {
                    store.logInteraction({
                        event_type: 'input',
                        component: this.$options.name || 'unnamed component',
                        value: event.target.value, data: event.target.value
                    });
                });
            }
        })
    },
    unmounted() {
        this.$el.removeEventListener('click', this.handleGlobalClick)
        this.$el.removeEventListener('input', this.handleGlobalInput);
    },
})
app.mount('#app');
