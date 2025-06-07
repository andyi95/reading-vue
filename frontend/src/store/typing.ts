import {defineStore} from "pinia";

export const useTypingStore = defineStore('typing', {
    state: () => ({
        targetText: 'Type this text to practice your typing skills.',
        currentIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        characterStatus: [],
    }),
    actions: {
        incrementIndex() {
            this.currentIndex++;
        },
        incrementCorrectCount(){
            this.correctCount++;
        },
        incrementIncorrectCount() {
            this.incorrectCount++;
        },
        reset() {
            this.currentIndex = 0;
            this.correctCount = 0;
            this.incorrectCount = 0;
        }
    },
    getters: {
        characters: (state) => state.targetText.split(''),
    }
})