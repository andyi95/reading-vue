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
            diff: 'Compare texts',
            editor: 'Text editor'
        },
        common:{
            textContent: 'Text for reading',
            copyText: 'Copy to clipboard',
            convert: 'Convert',
            sourceText: 'Source text',
            textPlaceHolder: 'Start text input...',
            removeVowels: 'Remove vowels',
            yesLabel: 'Yes',
            errorMessage: 'Something went wrong. Please try again later.',
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
            textContent: 'Text for reading',
            metaTitle: 'Text tools',
            metaTags: 'text, reading, word counter, text colorizer, morphemes, morphological analysis, text to speech',
            metaDescription: 'Text tools for reading, learning and memorizing. Word counter, text colorizer, morphological analysis, text to speech.',
            textToSpeech: 'Text to speech'
        },
        spreeder: {
            sourceText: 'Source text',
            textPlaceHolder: 'Enter your text...',
            wordsPerMinute: 'words per minute',
            startLabel: 'Start',
            stopLabel: 'Stop',
            resetLabel: 'Reset',
            metaTitle: 'Spreader',
            metaTags: 'text, reading, speed reading, spreader, words per minute',
            metaDescription: 'Spreader is a tool for speed reading. It helps to read faster and understand better.'
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
            tooManyErrorsTitle: 'Too many errors!',
            metaTitle: 'Schulte table',
            metaTags: 'table, game, memory, speed reading, attention, concentration, schulte table, schulte',
            metaDescription: 'Schulte table is a tool for training attention and memory. It is also used for speed reading.'
        },
        anticipation: {
            selectChars: 'Additional characters',
            placeHolderSelect: 'Select characters',
            metaTitle: 'Anticipation',
            metaTags: 'text, reading, anticipation, speed reading, attention, concentration',
            metaDescription: 'Anticipation is a tool for training attention and speed reading. It helps to read faster and understand better.'
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
            metaTitle: 'Text mixer',
            metaTags: 'text, reading, text mixer, text converter, text chaos, text transformation',
            metaDescription: 'Text mixer is a tool for text transformation. It helps to read and understand the text better.'
        },
        voice: {
            title: 'Voice Recorder',
            settings: 'Settings',
            resetAlert: 'Current record will be reset. Continue?',
            resetAlertTitle: 'New record',
            metaTitle: 'Voice Recorder',
            metaTags: 'text, reading, voice recorder, voice, sound, speech, speed reading',
            metaDescription: 'Voice recorder is a tool for recording and listening to voice messages. It helps to improve pronunciation and speech.'
        },
        diff:{
            title: 'Compare texts',
            compareLabel: 'Compare',
            firstTextPH: 'Enter first text...',
            secondTextPH: 'Enter second text...',
            metaTitle: 'Compare texts',
            metaTags: 'text, reading, compare texts, text comparison, text analysis, speech recognition',
            metaDescription: 'Compare texts is a tool for comparing two texts with speech recognition. It helps to find differences and similarities between texts.',
            text1Label: 'First text',
            text2Label: 'Second text',
            swapLabel: 'Swap texts'
        },
        editor: {
            title: 'Text editor',
            description: 'Simple online text editor',
            metaTitle: 'Text editor',
            metaTags: 'text. editing, editor, online editor, text editor, free online editor, text processor, online text editor, text editor, ',
        }
    },
    ru: {
        anticipation: {
            selectChars: 'Дополнительные символы',
            placeHolderSelect: 'Выберите символы',
            metaTitle: 'Антиципация',
            metaTags: 'текст, чтение, антиципация, скорочтение, внимание, концентрация',
            metaDescription: 'Антиципация - это инструмент для тренировки внимания и скорочтения. Он помогает читать быстрее и понимать лучше.'
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
            tooManyErrorsTitle: 'Много ошибок!',
            metaTitle: 'Таблица Шульте',
            metaTags: 'таблица, игра, память, скорочтение, внимание, концентрация, таблица Шульте, Шульте',
            metaDescription: 'Таблица Шульте - это инструмент для тренировки внимания и памяти. Также используется для скорочтения.'
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
            diff: 'Сравнение текстов',
            editor: 'Редактор'
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
            removeVowels: 'Убрать гласные',
            textContent: 'Текст для чтения',
            metaTitle: 'Подсчёт слов',
            textToSpeech: 'Озвучить текст',
            metaTags: 'текст, чтение, подсчёт слов, раскраска текста, морфемы, морфологический анализ, озвучка текста, текст в речь',
            metaDescription: 'Инструменты для чтения, обучения и запоминания текстов. Подсчёт слов, раскраска текста, морфологический анализ, озвучка текста.'
        },
        spreeder: {
            sourceText: 'Исходный текст',
            textPlaceHolder: 'Вставьте или введите текст для упражнения',
            wordsPerMinute: 'слов в минуту',
            startLabel: 'Начать',
            stopLabel: 'Стоп',
            resetLabel: 'Сброс',
            metaTitle: 'Спридер',
            metaTags: 'текст, чтение, скорочтение, спридер, слов в минуту',
            metaDescription: 'Спридер - это инструмент для скорочтения. Он помогает читать быстрее и понимать лучше.'

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
            metaTitle: 'Дешифровщик',
            metaTags: 'текст, чтение, дешифровщик, конвертер текста, хаос текста, трансформация текста',
            metaDescription: 'Дешифровщик - это инструмент для трансформации текста. Он помогает читать и понимать текст лучше.'

        },
        voice: {
            title: 'Запись голоса',
            settings: 'Настройки',
            resetAlert: 'Текущая запись будет сброшена. Продолжить?',
            resetAlertTitle: 'Новая запись',
            metaTitle: 'Запись голоса',
            metaTags: 'текст, чтение, запись голоса, голос, звук, речь, скорочтение',
            metaDescription: 'Запись голоса - это инструмент для записи и прослушивания с настройкой скорости. Он помогает улучшить произношение и речь.'
        },
        diff: {
            title: 'Сравнение текстов',
            compareLabel: 'Сравнить',
            firstTextPH: 'Введите первый текст...',
            secondTextPH: 'Введите второй текст...',
            metaTitle: 'Сравнение текстов',
            metaTags: 'текст, чтение, сравнение текстов, анализ текста, распознавание речи',
            metaDescription: 'Сравнение текстов - это инструмент для сравнения двух текстов с распознаванием речи. Он помогает найти различия и сходства между текстами.',
            text1Label: 'Первый текст',
            text2Label: 'Второй текст',
            swapLabel: 'Поменять тексты местами'
        },
        editor: {
            title: 'Текстовый редактор',
            description: 'Простой онлайн редактор текста',
            metaTitle: 'Текстовый редактор',
            metaTags: 'текст. редактирование, редактор, онлайн редактор, текстовый редактор, бесплатный онлайн редактор, редактор текста, он-лайн редактор, текстовый процессор',
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