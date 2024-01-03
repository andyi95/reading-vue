<script setup lang="ts">
import {ref, onMounted, watch, computed, defineProps} from "vue";
import WaveSurfer from "wavesurfer.js";
import {CloudDownloadOutline, PlayCircleOutline, StopCircleSharp} from '@vicons/ionicons5';
import {NIcon, useThemeVars} from "naive-ui"
import {saveAs} from "file-saver";

const props = defineProps({
  audioBlob: {
    type: Blob,
    required: true
  }
})
const playbackWaveRef = ref<HTMLElement | null>(null);
const playbackWaveformRef = ref(null);
let playbackWaveSurfer = <WaveSurfer | null>null;
const isPlaying = ref(false);
const playbackRate = ref(1);
const themeVars = useThemeVars();
const downloadUrl = computed(() => {
  return playbackWaveSurfer?.exportWAV(44100, 16, 1, true, {type: 'audio/wav'})
});
const downloadAudio = () => {
  saveAs(downloadUrl.value, `audio-${Date.now()}.wav`)
}
const playAudio = () => {
  playbackWaveSurfer?.playPause()
  isPlaying.value = playbackWaveSurfer?.isPlaying() || false
}

watch(playbackRate, (newRate) => {
  if (playbackWaveSurfer) {
    playbackWaveSurfer.setPlaybackRate(newRate);
  }
});

onMounted(() => {
  playbackWaveSurfer = WaveSurfer.create({
    container: playbackWaveRef.value,
    waveColor: themeVars.value.primaryColor,
    progressColor: themeVars.value.primaryColorHover,
    audioRate: 1,
    barWidth: 5,
  });

  if (props.audioBlob) {
    const audioUrl = URL.createObjectURL(props.audioBlob);
    playbackWaveSurfer.load(audioUrl);
  }

  playbackWaveSurfer.on('ready', () => {
    playbackWaveSurfer.setPlaybackRate(playbackRate.value);
  });
});
</script>

<template>
<n-space vertical>
  <div ref="playbackWaveRef" id="playbackWaveRef"></div>
  <div class="py-1 my-1">
    <n-slider v-model:value="playbackRate" :step="0.1" :min="0.5" :max="2" />
    <n-icon size="50" :color="themeVars.primaryColor">
      <PlayCircleOutline v-if="!isPlaying" @click="playAudio"/>
      <StopCircleSharp v-else @click="playAudio"/>
    </n-icon>
    <n-icon size="50">
      <CloudDownloadOutline @click="downloadAudio"/>
    </n-icon>

  </div>
</n-space>
</template>

<style scoped>

</style>