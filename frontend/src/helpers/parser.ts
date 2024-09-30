import DiffMatchPatch from "diff-match-patch";
import { Diff } from "diff-match-patch";

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
    private removePunctuation(text: string): string {
        return text.replace(/[^\w\sа-яёa-z]|_/giu, '');
    }
    static removePunctuation(text: string): string {
        const obj = new TextParser(text);
        return obj.removePunctuation(text);
    }
    static compareTexts(text1: string, text2: string): Diff[] {
        const dmp = new DiffMatchPatch();
        return dmp.diff_main(
            TextParser.removePunctuation(text1).toLowerCase(),
            TextParser.removePunctuation(text2).toLowerCase());
    }
    static compareTextsUsingPivots(text1: string, text2: string): ((string | 0)[] | Diff | (string | -1)[] | (string | 1)[])[] {
        const dmp = new DiffMatchPatch();

        // Split texts into sentences or paragraphs based on punctuation
        const splitRegex = /([.!?])\s+/; // This splits on sentence boundaries
        const segments1 = text1.split(splitRegex).filter(segment => segment.trim().length > 0);
        const segments2 = text2.split(splitRegex).filter(segment => segment.trim().length > 0);

        let diffs = [];
        let idx1 = 0, idx2 = 0;

        // Compare segments around identified pivot points
        while (idx1 < segments1.length && idx2 < segments2.length) {
            const segment1 = segments1[idx1];
            const segment2 = segments2[idx2];

            if (segment1 === segment2) {
                // If segments match, add as equal
                diffs.push([DiffMatchPatch.DIFF_EQUAL, segment1]);
                idx1++;
                idx2++;
            } else {
                // Use DiffMatchPatch to find differences within segments
                const innerDiffs = dmp.diff_main(segment1, segment2);
                diffs.push(...innerDiffs);

                // Advance indices based on content overlap or mismatches
                if (segment1.length > segment2.length) {
                    idx2++;
                } else {
                    idx1++;
                }
            }
        }

        // Handle remaining segments in either text
        while (idx1 < segments1.length) {
            diffs.push([DiffMatchPatch.DIFF_DELETE, segments1[idx1]]);
            idx1++;
        }
        while (idx2 < segments2.length) {
            diffs.push([DiffMatchPatch.DIFF_INSERT, segments2[idx2]]);
            idx2++;
        }

        return diffs;
    }


    replaceVowels(): ParsedCharacter[] {
        const cleanedText = this.removePunctuation(this.text)
        return cleanedText.split('').map((item, idx) => ({
            char: item,
            idx,
            is_vowel: this.vowels_reg.test(item)
        }));
    }

    replaceLetters(): string {
        const cleanedText = this.removePunctuation(this.text)
        return cleanedText.toUpperCase().split('').map((item, idx) => (this.replaceMap[item] || item)).join('');
    }

    seamlessText(): string {
        const cleanedText = this.removePunctuation(this.text)
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

        const words = this.removePunctuation(this.text).replace(/[^a-zа-я0-9]|\r\n|\n|\r/gi, ' ').split(' ')
        const newArr = words.map(word =>
            word.length < 3 ? word : shuffleWord(word.replace(/[^a-zа-я0-9]/gi, ''))
        );
        return newArr.join(' ')

    }

    reverseWords(): string {
        const words = this.removePunctuation(this.text).split(/\s+/);
        return words.map(word => word.split('').reverse().join('')).join(' ');
    }
    async fetchNormalForms(): Promise<string[]> {
        const response = await api.post('/parse/', { text: this.text });
        return response.data.map((item: ParseApiResponse) => item.normal_form);
    } catch (e: any) {
        throw e;
    }
}
export function splitText(sourceText: string, chunkSize: number = 5000): string[] {
    let text = sourceText;
    const chunks: string[] = [];
    while (text.length > 0) {
    if (text.length <= chunkSize) {
      chunks.push(text);
      break;
    }

    let chunk = text.slice(0, chunkSize);
    let lastDot = chunk.lastIndexOf('.');
    let lastComma = chunk.lastIndexOf(',');
    let lastSpace = chunk.lastIndexOf(' ');

    let splitIndex = lastDot > 0 ? lastDot : lastComma > 0 ? lastComma : lastSpace > 0 ? lastSpace : 4900;

    chunk = text.slice(0, splitIndex + 1);
    chunks.push(chunk);

    text = text.slice(splitIndex + 1);
  }

  return chunks;
}
export function copyText(element: HTMLElement): void {
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();
}
