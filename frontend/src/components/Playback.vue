<script setup lang="ts">
import {ref, onMounted, watch, computed, defineProps} from "vue";
import WaveSurfer from "wavesurfer.js";
import {CloudDownloadOutline, PlayCircleOutline, StopCircleSharp} from '@vicons/ionicons5';
import {NGrid, NIcon, useThemeVars} from "naive-ui"
import {saveAs} from "file-saver";

const props = defineProps({
  audioBlob: {
    type: Blob,
    required: true
  }
})
const playbackWaveRef = ref<HTMLElement | null>(null);
let playbackWaveSurfer = <WaveSurfer | null>null;
const isPlaying = ref(false);
const playbackRate = ref(1);
const themeVars = useThemeVars();
const downloadUrl = computed(() => {
  return URL.createObjectURL(props.audioBlob)
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
const speedOptions = [1, 1.5, 2, 2.5]
</script>

<template>
  <div ref="playbackWaveRef" id="playbackWaveRef"></div>
  <div class="flex items-center py-1 my-1 justify-between">
        <n-icon size="50" :color="themeVars.primaryColor">
          <PlayCircleOutline v-if="!isPlaying" @click="playAudio"/>
          <StopCircleSharp v-else @click="playAudio"/>
        </n-icon>

<div class="flex items-center space-x-2">
    <n-button
        v-for="speedOption in speedOptions"
        :key="speedOption"
        :type="playbackRate === speedOption ? 'primary' : 'default'"
        @click="playbackRate = speedOption">{{ speedOption }}x
    </n-button>
</div>
    <n-icon size="50">
      <CloudDownloadOutline @click="downloadAudio"/>
    </n-icon>
  </div>
</template>

<style scoped>

</style>