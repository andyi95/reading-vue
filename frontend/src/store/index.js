import {createStore, createLogger, useStore} from "vuex";
import {mutations} from "@/store/mutations";
import VuexPersistence from "vuex-persist";
import {window} from "rxjs";

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistence({storage: window.localStorage, key: "store"})
var plugins = [vuexLocal.plugin]
if (debug){
    plugins.push(createLogger())
}
export default createStore({
    state: {
        theme: null,
        sourceText: '',
        fetchedData: []
    },
    mutations,
    strict: debug,
    plugins: plugins,
    actions: {
        updateText(context, payload){
            context.commit('UPDATE_TEXT', payload)
        },
    }
})
