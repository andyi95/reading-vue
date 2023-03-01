import {createStore, createLogger, useStore} from "vuex";
import {mutations} from "@/store/mutations";


const debug = process.env.NODE_ENV !== 'production'

export default createStore({
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
