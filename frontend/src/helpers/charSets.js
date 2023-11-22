// Define the Russian alphabet
const russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

// Convert the alphabet into an array of objects
export default {
    russianAlphabet: {
        select: russianAlphabet.split('').map(letter => {
            return { value: letter, label: letter };
        }),
        selectConsonants: russianAlphabet.split('').filter(letter => {
            return !/[АЕЁИОУЫЭЮЯ]/.test(letter);
        }).map(letter => {
            return { value: letter, label: letter };
        })
    }
}