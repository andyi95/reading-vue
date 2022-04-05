<template>

  <div class="ms-2 me-auto">
    {{ word.word }}
  </div>
  <span class="badge bg-primary rounded-pill">{{ word.count }}</span>

</template>

<script>
export default {
  name: "WordCounter",
  props: {
    word: {
      word: String,
      count: Number
    }
  },
}
</script>

<style scoped>

</style>