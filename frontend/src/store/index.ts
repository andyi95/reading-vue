// store/index.ts

import { createStore, createLogger, StoreOptions } from 'vuex';
import VuexPersistence from 'vuex-persist';
import { State, SchulteResultsItem } from '@/helpers/types';
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
            tableCharsType: 'emoji',
        },
        editorContent: {
            lastSaved: new Date(),
            content: ''
        },
        anticipationSettings: {
            fontSize: 16
        },
        mixerSettings: {
            fontSize: 16
        },
        schulteContext: {
            currentRate: 1,
            shuffledGrid: [],
            gridData: [],
            currentItem: null,
            currentIndex: 0,
        },
        showReportCard: false,
        readingMode: false,
    },
    mutations,
    strict: debug,
    plugins,
    actions: {
        toggleBugReport(content, payload){
            content.commit('TOGGLE_BUG_REPORT')
        },
        toggleReadingMode(content, payload){
            content.commit('TOGGLE_READING_MODE')
        },
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
        },
        saveEditorContent( context, payload){
            context.commit('UPDATE_EDITOR_CONTENT', payload)
        },
        updateFontSize(context, {settingsKey, fontSize}: {settingsKey: keyof State, fontSize: number}) {
            context.commit('UPDATE_FONT_SIZE', {settingsKey, fontSize})
        }
    },
    getters: {
        sortedSchulteResults: (state) => {
            return state.schulteResults.sort((a: SchulteResultsItem, b: SchulteResultsItem) => {
                return a.time - b.time;
            });
        },
        localeCode: (state) => {
            const localeCodes: Record<string, string> = {
                'ru': 'ru-RU',
                'en': 'en-US',
            };
            return localeCodes[state.locale];
        }

    },

};

export default createStore(storeOptions);
