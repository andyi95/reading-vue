type ParsedCharacter = {
    char: string;
    idx: number;
    is_vowel: boolean;
};

type ParseApiResponse = {
    id: number;
    word: string;
    tag: string;
    normal_form: string;
};

import {api} from './api';

export default class TextParser {
    text: string;
    vowels_reg: RegExp;
    reText: RegExp;
    replaceMap: { [key: string]: string };

    constructor(text: string) {
        this.text = text;
        this.vowels_reg = /^[aeiouаяуюоеёэиы]$/i;
        this.reText = /[A-Za-zА-Яа-я]/;
        this.replaceMap = {
            'А': '@', 'В': '8', 'Е': '№', 'К': '<', 'М': 'M', 'Н': 'Н', 'О': '0',
            'Р': '%', 'С': '$', 'Т': '7', 'У': 'Y', 'Х': 'X', 'Ь': 'b', 'Я': '9',
            'A': '4', 'B': '8', 'C': '<', 'E': '3', 'G': '6', 'H': '#', 'I': '!',
            'J': ']', 'K': 'X', 'L': '1', 'M': 'M', 'N': 'И', 'O': '0', 'P': '9',
            'Q': 'O', 'R': '2', 'S': '$', 'T': '7', 'U': 'Y', 'V': '√', 'W': 'W',
            'X': '%', 'Y': 'Y', 'Z': '2'
        };
    }
    private removePuntuation(text: string): string {
        return text.replace(/[^\w\sа-яa-z]|_/giu, '');
    }

    replaceVowels(): ParsedCharacter[] {
        const cleanedText = this.removePuntuation(this.text)
        return cleanedText.split('').map((item, idx) => ({
            char: item,
            idx,
            is_vowel: this.vowels_reg.test(item)
        }));
    }

    replaceLetters(): string {
        const cleanedText = this.removePuntuation(this.text)
        return cleanedText.toUpperCase().split('').map((item, idx) => (this.replaceMap[item] || item)).join('');
    }

    seamlessText(): string {
        const cleanedText = this.removePuntuation(this.text)
        return cleanedText
            .toUpperCase()
            .split('')
            .filter(char => this.reText.test(char)).join('');

    }

    renderVowelsAsHTML(vowelClass: string): string {
        return this.text.split('').map(char => {
            return this.vowels_reg.test(char)
                ? `<span class="${vowelClass}">${char}</span>`
                : char;
        }).join('');
    }

    shuffleText(): string {
        const reg = /^[a-zа-я]+$/i;

        function getRandomInt(n: number){
            let min = Math.ceil(1)
            let max = Math.floor(n-1)
            return Math.floor(Math.random() * (max - min) + min);
        }

        function shuffleWord(word: string) {
            let arr = word.split('');
            let n = arr.length;
            for(var i = 0; i < n; ++i){
                if(i===0 || i >= n -1 || !reg.test(arr[i])){
                    continue
                }
                let j = getRandomInt(n);
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr.join('');
        }

        const words = this.removePuntuation(this.text).replace(/[^a-zа-я0-9]|\r\n|\n|\r/gi, ' ').split(' ')
        const newArr = words.map(word =>
            word.length < 3 ? word : shuffleWord(word.replace(/[^a-zа-я0-9]/gi, ''))
        );
        return newArr.join(' ')

    }

    reverseWords(): string {
        const words = this.removePuntuation(this.text).split(/\s+/);
        return words.map(word => word.split('').reverse().join('')).join(' ');
    }
    async fetchNormalForms(): Promise<string[]> {
        const response = await api.post('/parse/', { text: this.text });
        return response.data.map((item: ParseApiResponse) => item.normal_form);
    } catch (e: any) {
        throw e;
    }
}
export function copyText(element: HTMLElement): void {
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();
}
