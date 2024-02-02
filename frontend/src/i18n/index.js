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
            title: 'Text tools',
            voice: 'Voice Recorder',
            diff: 'Compare texts'
        },
        common:{
            textContent: 'Text for reading',
            copyText: 'Copy to clipboard',
            convert: 'Convert',
            sourceText: 'Source text',
            textPlaceHolder: 'Start text input...',
            removeVowels: 'Remove vowels',
            yesLabel: 'Yes',
            noLabel: 'No',
            metaDescription: 'Text tools for reading, learning and memorizing. Word counter, text colorizer, text converter, text mixer, text spreader, Schulte table, voice recorder.',
            metaTitle: 'Text tools',
            metaTags: 'text, tools, reading, learning, memorizing, word counter, text colorizer, text converter, text mixer, text spreader, Schulte table, voice recorder',
            warnMessage: 'Something went wrong. Please try again later.'
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
            emojiOption: 'Emoji',
            timeLabel: 'Time',
            size: 'Size',
            errorsLabel: 'Error',
            rateLabel: 'Correct',
            resultsLabel: 'Results',
            easyGameTooltip: 'The guessed tiles will disappear',
            finished: 'Great job! You finished the game in {minutes} minutes {seconds} seconds, making {errors} mistakes. Your speed is {rate} characters per minute.',
            tooManyErrors: 'Too many errors! Get ready!',
            tooManyErrorsTitle: 'Too many errors!'
        },
        anticipation: {
            selectChars: 'Additional characters',
            placeHolderSelect: 'Select characters'
        },
        chaos: {
            sourceText: 'Source text',
            textPlaceHolder: 'Enter text...',
            convertText: 'Convert',
            mode: 'Mode',
            dropLetters: 'Hide letters',
            replaceLetters: 'Replace letters',
            seamlessText: 'Seamless text',
            reverseWords: 'Reverse words',
            substitutionText: 'Substitution letters',
            shuffleLetters: 'Shuffle letters',
            normalForm: 'Lemmatization',
        },
        voice: {
            title: 'Voice Recorder',
            settings: 'Settings',
            resetAlert: 'Current record will be reset. Continue?',
            resetAlertTitle: 'New record'
        },
        diff:{
            title: 'Compare texts',
            compareLabel: 'Compare',
            firstTextPH: 'Enter first text...',
            secondTextPH: 'Enter second text...',
        }
    },
    ru: {
        anticipation: {
            selectChars: 'Дополнительные символы',
            placeHolderSelect: 'Выберите символы'
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
            emojiOption: 'Эмодзи',
            gorbovOption: 'Таблица Горбова',
            timeLabel: 'Время',
            size: 'Размер',
            classicTable: 'Обычная таблица',
            tableFillment: 'Набор символов',
            finished: 'Отличная работа! Вы закончили игру за {minutes} минут {seconds} секунд, совершив {errors} ошибок. Ваша скорость {rate} символов в минуту.',
            errorsLabel: 'Ошибок',
            rateLabel: 'Угадано',
            resultsLabel:'Результаты',
            easyGameTooltip: 'Угаданные плитки будут исчезать',
            tooManyErrors: 'Слишком много ошибок! Соберись!',
            tooManyErrorsTitle: 'Много ошибок!'
        },
        nav: {
            textparser: 'Подсчёт слов',
            spreeder: 'Спридер',
            anticipation: 'Антиципация',
            mixer: 'Дешифровщик',
            parser: 'Цветной текст',
            theme: 'Сменить тему',
            schulte: 'Таблица Шульте',
            title: 'Текстовые инструменты',
            voice: 'Запись голоса',
            diff: 'Сравнение текстов'
        },
        common:{
            textContent: 'Текст для чтения',
            copyText: 'Скопировать текст',
            convert: 'Конвертировать',
            sourceText: 'Исходный текст',
            textPlaceHolder: 'Введите текст...',
            removeVowels: 'Убрать гласные',
            yesLabel: 'Да',
            noLabel: 'Нет',
            metaDescription: 'Инструменты для чтения, обучения и запоминания текстов. Подсчёт слов, раскраска текста, конвертер текста, перемешиватель текста, спридер, таблица Шульте, запись голоса.',
            metaTitle: 'Текстовые инструменты',
            metaTags: 'текст, инструменты, чтение, обучение, запоминание, подсчёт слов, раскраска текста, конвертер текста, перемешиватель текста, спридер, таблица Шульте, запись голоса',
            warnMessage: 'Что-то пошло не так. Попробуйте позже.'
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
            enterTextWarning: 'Поле не должно быть пустым',
            mode: 'Режим',
            dropLetters: 'Скрывать буквы',
            replaceLetters: 'Замена на символы',
            seamlessText: 'Непрерывный текст',
            reverseWords: 'Зеркальное написание',
            substitutionText: 'Замена букв',
            shuffleLetters: 'Перемешивание букв',
            normalForm: 'Лемматизация',
        },
        voice: {
            title: 'Запись голоса',
            settings: 'Настройки',
            resetAlert: 'Текущая запись будет сброшена. Продолжить?',
            resetAlertTitle: 'Новая запись'
        },
        diff: {
            title: 'Сравнение текстов',
            compareLabel: 'Сравнить',
            firstTextPH: 'Введите первый текст...',
            secondTextPH: 'Введите второй текст...',

        }
    }
}

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