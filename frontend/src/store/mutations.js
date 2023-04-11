const state = () => ({
    theme: null,
    content: String
})

export const mutations = {
    switchTheme(state) {
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
    UPDATE_DATA(state, data){
        state.fetchedData = data
    },
    switchLocale(state){
        if(state.locale === 'ru'){
            state.locale = 'en'
        }
        else{
            state.locale = 'ru'
        }
    }
}

