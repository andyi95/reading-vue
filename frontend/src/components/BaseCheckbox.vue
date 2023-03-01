<template>
<n-switch :id="id" @update:value="$emit('nSwitched', $event)"></n-switch>
  <label class="form-check-label" :for="id">{{ label }}</label>
</template>

<script>
import { NSwitch } from "naive-ui";

export default {
  name: "BaseCheckbox",
  emits: ['n-switched'],
  props:{
    label: ''
  },
  components: {
    NSwitch
  },
  data(){
    return{
      id: null,
      is_switched: Boolean
    }
  },
  mounted() {
    this.id = this._.uid
  }
}
</script>
