// store/index.ts

import { createStore, createLogger, StoreOptions } from 'vuex';
import VuexPersistence from 'vuex-persist';
import { State, SchulteResultsItem, SchulteSettings } from '../helpers/types';
import { mutations } from './mutations';

const debug = process.env["NODE_ENV"] !== 'production';

const vuexLocal = new VuexPersistence<State>({
    storage: window.localStorage,
    key: 'store',
});

const plugins = [vuexLocal.plugin];
if (debug) {
    plugins.push(createLogger());
}

const storeOptions: StoreOptions<State> = {
    state: {
        theme: null,
        sourceText: '',
        fetchedData: [],
        locale: 'ru',
        schulteResults: [],
        schulteSettings: {
            size: 10,
            gameMode: 'gorbov',
            easyMode: true,
            tableCharsType: 'digits',
        },
        schulteContext: {
            currentRate: 1,
            shuffledGrid: [],
            gridData: [],
            currentItem: null,
            currentIndex: 0,
        },
    },
    mutations,
    strict: debug,
    plugins,
    actions: {
        updateText(context, payload){
            context.commit('UPDATE_TEXT', payload)
        },
        updateSchulteSettings(context, payload){
            context.commit('UPDATE_SCHULTE_SETTINGS', payload)
        },
        updateSchulteResults(context, payload){
            context.commit('UPDATE_SCHULTE_RESULTS', payload)
        },
        updateSchulteContext(context, payload){
            context.commit('UPDATE_SCHULTE_CONTEXT', payload)
        }
    },
    getters: {
        sortedSchulteResults: (state) => {
            return state.schulteResults.sort((a: SchulteResultsItem, b: SchulteResultsItem) => {
                return a.time - b.time;
            });
        }
    },
};

export default createStore(storeOptions);
