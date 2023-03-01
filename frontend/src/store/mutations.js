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
    setText(state, text){
        state.content = text
    }
}

