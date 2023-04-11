<template>
  <n-card :title="title" class="row mb-2 mt-4 parsed-text">
    <slot/>
  </n-card>
</template>

<script>
import {NCard} from "naive-ui";
export default {
  name: "BaseTextBox",
  components:{NCard},
  props: {
    title: ''
  }
}
</script>

<style scoped>

</style>