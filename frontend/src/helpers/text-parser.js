
export default class TextParser {
    constructor(text) {
        this.text = text;
        this.vowels_reg = /[aeiouаяуюоеёэиы]/gi
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