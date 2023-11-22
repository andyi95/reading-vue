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

/**
 * @typedef {object} schulteResultsItem
 * @property {number} currentRate
 * @property {number} size
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {number} time
 * @property {number} errors
 */

/**
 * @typedef {object} schulteSettings
 * @property {number} size
 * @property {string} gameMode
 * @property {boolean} easyMode
 * @property {string} tableCharsType
 */
export default createStore({
    state: {
        theme: null,
        sourceText: '',
        fetchedData: [],
        locale: 'ru',
        /** @type {schulteResultsItem[]} */
        schulteResults: [],
        /** @type {schulteSettings} */
        schulteSettings: {
            size: 10, gameMode: 'gorbov', easyMode: true, tableCharsType: 'digits'}
    },
    mutations,
    strict: debug,
    plugins: plugins,
    actions: {
        updateText(context, payload){
            context.commit('UPDATE_TEXT', payload)
        },
        updateSchulteSettings(context, payload){
            context.commit('UPDATE_SCHULTE_SETTINGS', payload)
        },
        updateSchulteResults(context, payload){
            context.commit('UPDATE_SCHULTE_RESULTS', payload)
        }
    },
    getters: {
        sortedSchulteResults(state){
            return state.schulteResults.sort((a, b) => a.time - b.time)
        }
    }
})
