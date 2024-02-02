<script lang="ts">

import {MicCircleSharp, PauseCircleOutline, StopCircleOutline} from "@vicons/ionicons5";

export default {
  props: ['isRecording', 'isPaused'],
  methods: {
    toggleRecording() {
      this.$emit('toggle-recording');
    },
    pauseRecording() {
      this.$emit('pause-recording');
    }
  },
  components: {
    MicCircleSharp,
    PauseCircleOutline,
    StopCircleOutline
  }
}
</script>

<template>
  <div class="flex-1 items-center">
    <n-button v-if="!isRecording" text @click="toggleRecording">
      <n-icon depth="2" size="100"><MicCircleSharp/></n-icon>
    </n-button>
    <n-button v-if="isRecording && !isPaused" text @click="pauseRecording">
      <n-icon depth="2" size="100"><PauseCircleOutline/></n-icon>
    </n-button>
    <n-button v-if="isRecording && isPaused" text @click="pauseRecording">
      <n-icon depth="2" size="100"><MicCircleSharp/></n-icon>
    </n-button>
    <n-button v-if="isRecording" text @click="toggleRecording">
      <n-icon depth="2" size="100"><StopCircleOutline/></n-icon>
    </n-button>
  </div>
</template>

<style scoped>

</style>