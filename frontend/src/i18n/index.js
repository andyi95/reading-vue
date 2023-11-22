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
            schulte: 'Schulte table',
            title: 'Text tools'
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
        },
        schulte: {
            title: 'Schulte table',
            settings: 'Settings',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset',
            wrong: 'Wrong',
            easyGame: 'Easy game',
            digitsOption: 'Digits',
            ruLetterOptions: 'Russian letters',
            enLetterOptions: 'English letters',
            zhLetterOption: 'Chinese hyeroglyphs',
            gorbovOption: 'Gorbov table',
            classicTable: 'Classic table',
            tableFillment: 'Character set',
            selectOption: 'Game mode',
            timeLabel: 'Time',
            size: 'Size',
            errorsLabel: 'errors',
            rateLabel: 'rate',
            resultsLabel: 'Results',
            easyGameTooltip: 'The guessed tiles will disappear',
            finished: 'Great job! You finished the game in {minutes} minutes {seconds} seconds, making {errors} mistakes. Your speed is {rate} characters per minute.'
        },
        anticipation: {
            selectChars: 'Additional characters',
            placeHolderSelect: 'Select characters',
        }
    },
    ru: {
        anticipation: {
            selectChars: 'Дополнительные символы',
            placeHolderSelect: 'Выберите символы',
        },
        schulte: {
            title: 'Таблица Шульте',
            settings: 'Настройки',
            start: 'Старт',
            stop: 'Стоп',
            reset:'Сброс',
            wrong: 'Неправильно',
            easyGame: 'Лёгкая игра',
            selectOption: 'Режим игры',
            digitsOption: 'Цифры',
            ruLetterOptions: 'Русские буквы',
            enLetterOptions: 'Английские буквы',
            zhLetterOption: 'Китайские иероглифы',
            gorbovOption: 'Таблица Горбова',
            timeLabel: 'Время',
            size: 'Размер',
            classicTable: 'Обычная таблица',
            tableFillment: 'Набор символов',
            finished: 'Отличная работа! Вы закончили игру за {minutes} минут {seconds} секунд, совершив {errors} ошибок. Ваша скорость {rate} символов в минуту.',
            errorsLabel: 'ошибок',
            rateLabel: 'угадано',
            resultsLabel:'Результаты',
            easyGameTooltip: 'Угаданные плитки будут исчезать',
        },
        nav: {
            textparser: 'Подсчёт слов',
            spreeder: 'Спридер',
            anticipation: 'Антиципация',
            mixer: 'Дешифровщик',
            parser: 'Цветной текст',
            theme: 'Сменить тему',
            schulte: 'Таблица Шульте',
            title: 'Текстовые инструменты'
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
    runtimeOnly: false,
    messages,
    datetimeFormats: {
        en: {
            short: {
                year: 'numeric', month: 'short', day: 'numeric'
            }
        },
        ru: {
            short: {
                year: 'numeric', month: 'short', day: 'numeric'
            },
            diff: {
                minute: 'numeric', second: 'numeric'
            }
        },

    }
})