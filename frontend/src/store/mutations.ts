import {SchulteContext, SchulteResultsItem, SchulteSettings, State} from '@/helpers/types';


type SettingsOptions = 'anticipationSettings' | 'mixerSettings';

export const mutations = {
    SWITCH_THEME(state: State) {
        state.theme = state.theme ? null : 'darkTheme';
    },
    UPDATE_TEXT(state: State, text: string) {
        state.sourceText = text;
    },
    SWITCH_LOCALE(state: State) {
        state.locale = state.locale === 'ru' ? 'en' : 'ru';
    },
    UPDATE_SCHULTE_SETTINGS(state: State, settings: SchulteSettings) {
        state.schulteSettings = settings;
    },
    UPDATE_SCHULTE_RESULTS(state: State, results: SchulteResultsItem) {
        state.schulteResults = [
            ...state.schulteResults.filter(item => item.startTime !== results.startTime),
            results,
        ];
    },
    UPDATE_SCHULTE_CONTEXT(state: State, context: SchulteContext) {
        state.schulteContext = context;
    },
    UPDATE_EDITOR_CONTENT(state: State, content: string){
        state.editorContent = {
            lastSaved: new Date(),
            content: content,
        };
    },
    UPDATE_FONT_SIZE(state: State, {settingsKey, fontSize}: {settingsKey: SettingsOptions, fontSize: number}) {
        state[settingsKey].fontSize = fontSize
    },
    TOGGLE_BUG_REPORT(state: State){
        state.showReportCard = !state.showReportCard;
    },
    TOGGLE_READING_MODE(state: State){
        state.readingMode = !state.readingMode;
    }
};
