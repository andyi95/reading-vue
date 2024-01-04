<script setup lang="ts">
import {computed, defineProps} from 'vue';
import {NTime} from "naive-ui";

const props = defineProps({
  correct: {
    type: Number,
    required: true
  },
  errors: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  }
});
const timerCountFormatted = computed(() => {
  return new Date(props.time * 1000)
});
</script>

<template>

  <n-card :segmented="{content: 'soft'}" header-class="text-center" class="md:my-2 my-3">
    <template #header>
      <div class="text-xl md:text-2xl">
      {{ $t('schulte.timeLabel')}}: <n-time :time="timerCountFormatted" format="mm:ss"></n-time></div>
    </template>
    <div class="flex justify-between text-xl">
      <span>{{ $t('schulte.rateLabel') }}: </span>
      <span>{{ correct }}</span>
    </div>
    <div class="flex justify-between text-xl">
      <span>{{ $t('schulte.errorsLabel') }}:</span>
      <span>{{ errors }}</span>
    </div>
  </n-card>
</template>

<style scoped>

</style>