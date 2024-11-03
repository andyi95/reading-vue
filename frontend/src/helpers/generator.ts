// Наборы символов для нижнего, среднего и верхнего рядов
const charSets = {
    lower: "ячсмитьбю",
    middle: "фывапролджэ",
    upper: "йцукеёнгшщзхъ",
    all: "ячсмитьбюфывапролджэйцукеёнгшщзхъ ,.:;!?-—\""
};

interface GenerateOptions {
    row: "lower" | "middle" | "upper" | "all";
    length: number; // Количество слов
    count: number;  // Количество строк
}

// Функция для случайного выбора символа из строки
function getRandomChar(chars: string): string {
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

// Функция для генерации случайного слова
function generateWord(chars: string): string {
    const wordLength = Math.floor(Math.random() * 10) + 1; // Длина слова от 1 до 10
    let word = "";
    for (let i = 0; i < wordLength; i++) {
        word += getRandomChar(chars);
    }
    return word;
}

// Функция генерации строки из случайных слов
function generateStrings({ row, length, count }: GenerateOptions): string[] {
    // Определяем нужный набор символов на основе параметра row
    const charSet = charSets[row];

    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        const words = [];
        for (let j = 0; j < length; j++) {
            words.push(generateWord(charSet));
        }
        result.push(words.join(" ")); // Объединяем слова с пробелами
    }

    return result;
}

export { generateStrings };