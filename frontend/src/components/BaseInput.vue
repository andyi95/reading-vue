<template>
  <n-form-item :label="label">
      <n-input type="textarea" :placeholder="placeholder" rows="6"
                @input="$emit('input-updated', $event)" v-model="sourceText"/></n-form-item>
</template>


<script lang="ts">
import {defineComponent} from 'vue';
import {NFormItem, NInput} from "naive-ui";

export default defineComponent({
  name: 'BaseInput',
  components: {
    NInput, NFormItem
  },
  emits: ['input-updated'],
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    postBody: String,
    sourceText: {
      type: String,
      default: ''
    }
  },
});
</script>
