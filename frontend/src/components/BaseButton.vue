<template>
<n-button type="primary" :id="id" @click="$emit('button-clicked')">{{ label }}</n-button>
</template>

<script>
import { NButton } from "naive-ui";

export default {
  name: "BaseButton",
  props:{
    label: ''
  },
  emits: ['button-clicked'],
  components: {
    NButton
  },
  data(){
    return{
      id: null
    }
  },
  mounted() {
    this.id = this._.uid
  }
}
</script>
