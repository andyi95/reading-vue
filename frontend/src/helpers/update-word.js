import {reactive, ref} from "vue";

export async function updateWord(sourceText) {
    const word = ref('')

    for (var i = sourceText.length; i > 0; i--) {
        await setTimeout(function () {
            word.value = sourceText[i]
        }, 2000)
    }
    return {word}
}