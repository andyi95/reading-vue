<template>
<n-space>
  <n-card id="currentWord">{{ word }}</n-card>
</n-space>
</template>

<script>
import {onMounted, ref, reactive} from "vue";

// export default {
//   name: "WordCard",
//   async setup(){
//     const word = ref('');
//     const sourceText = reactive({
//       text: this.sourceText
//     })
//     async function wordUpdate(words){
//       words = words === undefined ? this.sourceText: words
//       for (var i = words.length; i > 0; i--){
//         setTimeout(() => {
//           word.value = words[i];
//         }, 2000)
//       }
//     }
//     onMounted(async () => {
//       await wordUpdate(sourceText.text)
//     })
//     return {
//       word, wordUpdate
//     }
//   },

//   props: {
//     sourceText: null
//   }
// }
</script>

<style scoped>

</style>