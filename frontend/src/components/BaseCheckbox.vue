<template>
  <div class="my-0.5 space-x-2">
<n-switch :id="id" @update:value="$emit('n-switched', $event)"/>
  <label class="form-check-label" :for="id">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NSwitch } from "naive-ui";

const props = defineProps({
  label: String
});

const emit = defineEmits(['n-switched']);

const id = ref(`ns-${Math.random().toString(36).substr(2, 9)}`);
</script>