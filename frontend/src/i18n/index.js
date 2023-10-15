import {createI18n} from "vue-i18n";

import store from "@/store";

const messages = {
    en: {
        nav: {
            textparser: 'Word count',
            spreeder: 'Spreader',
            anticipation: 'Anticipation',
            mixer: 'Text mixer',
            parser: 'Color text',
            theme: 'Change theme',
        },
        common:{
            textContent: 'Text for reading',
            copyText: 'Copy to clipboard',
            convert: 'Convert',
            sourceText: 'Source text',
            textPlaceHolder: 'Start text input...',
            removeVowels: 'Remove vowels'
        },
        textparser: {
            sourceText: 'Source text',
            textPlaceHolder: 'Enter your text...',
            totalSymbols: 'Total symbols',
            withoutSpaces: 'Without spaces',
            cntWords: 'Words amount',
            paintText: 'Color text',
            copyText: 'Copy text',
            countWords: 'Count words',
            onlyNouns: 'Show only nouns',
            onlyVerbs: 'Show only verbs',
            grayScale: 'Use gray scale',
            textContent: 'Text for reading'
        },
        spreeder: {
            sourceText: 'Source text',
            textPlaceHolder: 'Enter your text...',
            wordsPerMinute: 'words per minute',
            startLabel: 'Start',
            stopLabel: 'Stop',
            resetLabel: 'Reset'
        }
    },
    ru: {
        nav: {
            textparser: 'Подсчёт слов',
            spreeder: 'Спридер',
            anticipation: 'Антиципация',
            mixer: 'Дешифровщик',
            parser: 'Цветной текст',
            theme: 'Сменить тему'
        },
        common:{
            textContent: 'Текст для чтения',
            copyText: 'Скопировать текст',
            convert: 'Конвертировать',
            sourceText: 'Исходный текст',
            textPlaceHolder: 'Введите текст...',
            removeVowels: 'Убрать гласные'
        },
        textparser: {
            sourceText: 'Исходный текст',
            textPlaceHolder: 'Начните вводить текст',
            totalSymbols: 'Всего символов',
            withoutSpaces: 'Без пробелов',
            cntWords: 'Количество слов',
            paintText: 'Раскрасить текст',
            copyText: 'Скопировать текст',
            countWords: 'Подсчёт слов',
            onlyNouns: 'Показать только существительные',
            onlyVerbs: 'Показать только глаголы',
            grayScale: 'Оттенки серого',
            removeVowels: 'Убрать гласные'
        },
        spreeder: {
            sourceText: 'Исходный текст',
            textPlaceHolder: 'Вставьте или введите текст для упражнения',
            wordsPerMinute: 'слов в минуту',
            startLabel: 'Начать',
            stopLabel: 'Стоп',
            resetLabel: 'Сброс'
        },
        chaos: {
            sourceText: 'Исходный текст',
            textPlaceHolder: 'Введите текст...',
            convertText: 'Конвертировать',
            enterTextWarning: 'Поле не должно быть пустым'
        }
    }
}
const storage = JSON.parse(localStorage.getItem('store'))

const storedLocale = store.state.locale || "ru"
export default createI18n({
    locale: storedLocale,
    fallbackLocale: 'ru',
    legacy: false,
    messages
})