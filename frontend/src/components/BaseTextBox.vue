<template>
  <n-card title="Текст для чтения">

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