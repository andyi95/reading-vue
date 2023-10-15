
export default class TextParser {
    constructor(text) {
        this.text = text;
        this.vowels_reg = /^[aeiouаяуюоеёэиы]$/i
        this.reText = /[A-Za-zА-Яа-я\s]/g
    }

    replaceVowels() {
        let text = this.text.split('')
        let result = []
        var self = this
        text.forEach(function (item, i, arr) {
            result.push({char: item, idx: i, is_vowel: self.vowels_reg.test(item)})
        })
        return result
    }
}

export function copyText() {
    let textToCopy = this.$refs.textContent;
    let blob = textToCopy.$el;
    const range = document.createRange();
    range.selectNode(blob);
    window.getSelection().removeAllRanges()
    const selection = window.getSelection();
    selection.addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges()
}