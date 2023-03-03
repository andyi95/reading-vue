<template>
  <div>
<n-switch :id="id" @update:value="$emit('n-switched', $event)"></n-switch>
  <label class="form-check-label" :for="id">{{ label }}</label>
  </div>
</template>

<script>
import { NSwitch } from "naive-ui";

export default {
  name: "BaseCheckbox",
  emits: ['n-switched'],
  props:{
    label: '',
  },
  components: {
    NSwitch
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
