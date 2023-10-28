const state = () => ({
    theme: null,
    content: String
})

export const mutations = {
    SWITCH_THEME(state) {
        if ([undefined, null].indexOf(state.theme) > -1) {
            state.theme = 'darkTheme'
        }
        else{
            state.theme = null
        }
    },
    UPDATE_TEXT(state, text){
        state.sourceText = text
    },
    SWITCH_LOCALE(state){
        if(state.locale === 'ru'){
            state.locale = 'en'
        }
        else{
            state.locale = 'ru'
        }
    },
    UPDATE_SCHULTE_SETTINGS(state, settings){
        state.schulteSettings = settings
    },
    UPDATE_SCHULTE_RESULTS(state, results){
        state.schulteResults = [
            ...state.schulteResults.filter(item => item.startTime !== results.startTime),
            results
        ]
    }
}

