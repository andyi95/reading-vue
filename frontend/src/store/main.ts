import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { State, SchulteResultsItem } from '@/helpers/types';

export const useMainStore = defineStore('mainStore', () => {
    const theme = ref<null | string>(null);
    const sourceText = ref('');
    const fetchedData = ref<any[]>([]);
    const locale = ref('ru');
    const schulteResults = ref<SchulteResultsItem[]>([]);
    const schulteSettings = ref({
        size: 10,
        gameMode: 'gorbov',
        easyMode: true,
        tableCharsType: 'emoji',
    });
    const editorContent = ref({
        lastSaved: new Date(),
        content: ''
    });
    const anticipationSettings = ref({
        fontSize: 16
    });
    const mixerSettings = ref({
        fontSize: 16
    });
    const schulteContext = ref({
        currentRate: 1,
        shuffledGrid: [],
        gridData: [],
        currentItem: null,
        currentIndex: 0,
    });
    const showReportCard = ref(false);
    const readingMode = ref(false);

    const sortedSchulteResults = computed(() => {
        return schulteResults.value.sort((a, b) => a.time - b.time);
    });

    const localeCode = computed(() => {
        const localeCodes: Record<string, string> = {
            'ru': 'ru-RU',
            'en': 'en-US',
        };
        return localeCodes[locale.value];
    });

    // Actions are methods in Pinia
    function toggleBugReport() {
        showReportCard.value = !showReportCard.value;
    }
    function toggleTheme() {
        theme.value = theme.value ? null : 'darkTheme';
    }

    function toggleLocale() {
        locale.value = locale.value === 'ru' ? 'en' : 'ru';
    }

    function toggleReadingMode() {
        readingMode.value = !readingMode.value;
    }

    function updateText(newText: string) {
        sourceText.value = newText;
    }
    function updateSchulteSettings(settings: any) {
        schulteSettings.value = settings;
    }
    function updateSchulteResults(results: SchulteResultsItem) {
        schulteResults.value = [
            ...schulteResults.value.filter(item => item.startTime !== results.startTime),
            results,
        ];
    }
    function updateSchulteContext(context: any) {
        schulteContext.value = context;
    }
    function saveEditorContent(content: string) {
        editorContent.value = {
            lastSaved: new Date(),
            content: content,
        };
    }
    function updateFontSize(settingsKey: string, fontSize: number) {
        const settings = settingsKey === 'anticipationSettings' ? anticipationSettings : mixerSettings;
        settings.value.fontSize = fontSize;
    }
    function isDarkTheme() {
        return theme.value === 'darkTheme';
    }

    return {
        theme,
        sourceText,
        fetchedData,
        locale,
        schulteResults,
        schulteSettings,
        editorContent,
        anticipationSettings,
        mixerSettings,
        schulteContext,
        showReportCard,
        readingMode,
        sortedSchulteResults,
        localeCode,
        toggleBugReport,
        toggleReadingMode,
        updateText,
        toggleTheme,
        updateSchulteSettings,
        updateSchulteResults,
        updateSchulteContext,
        saveEditorContent,
        toggleLocale,
        isDarkTheme,
        updateFontSize
    };
}, {persist: true});