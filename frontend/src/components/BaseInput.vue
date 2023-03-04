<template>

<!--      <label for="inputtextp0" class="align-right">{{ label }}</label>-->
  <n-form-item :label="label">
      <n-input type="textarea" :placeholder="placeholder" rows="6" id="inputtextp0"
                @input="$emit('input-updated', $event)" v-model="sourceText"/></n-form-item>
</template>


<script>
import {NInput} from "naive-ui";

export default {
  name: "BaseInput",
  components: {
    NInput
  },
  emits: ['input-updated'],
  props: {
    label: '',
    placeholder: '',
    postBody: String,
    sourceText: ''
  },

}

</script>

<style scoped>

</style>