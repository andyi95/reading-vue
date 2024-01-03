<script setup lang="ts">
import {CloudDownloadOutline, MicCircleSharp, PlayCircleOutline, StopCircleSharp} from '@vicons/ionicons5'
import {NIcon, NSpace, SelectOption, useMessage, useThemeVars} from "naive-ui";
import {computed, onMounted, ref, watch} from "vue";
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'
import { debounce } from 'lodash-es';
import Playback from "@/components/Playback.vue";
const waveformRef = ref<HTMLElement | null>(null);
let waveSurfer = <WaveSurfer | null>null;

const isRecording = ref(false)
const playbackRate = ref(1)
const mediaRecorder = ref<RecordPlugin | null>(null)
const downloadUrl = ref<string | null>(null)
const audioChunks = ref<Blob[]>([])
const message = useMessage();
const deviceOptions = ref<SelectOption[]>([])
const selectedDevice = ref<string | null>(null)

const warning = (text: string) => {
  message.warning(text)
}
const themeVars = useThemeVars();
const microphoneColor = computed(() => {
  return isRecording.value ? themeVars.value.primaryColor : themeVars.value.actionColor
});
const setPlaybackRate = debounce((rate: number) => {
  waveSurfer?.setPlaybackRate(rate, true);
  waveSurfer?.play()
}, 100)

const toggleRecording = async () => {
  isRecording.value = !isRecording.value
  if (isRecording.value) {
    await startRecording()
  } else {
    await stopRecording()
  }
}

const isPlaying = ref(false)

watch(playbackRate, (rate: number) => {
  setPlaybackRate(rate)
})
let audioBlob = <Blob | null>null
const startRecording = async () => {
  if (!waveSurfer){
    createWaveSurfer()
  }
  if (!navigator.mediaDevices || !mediaRecorder.value) {
    warning('Your browser does not support recording')
    return
  }

  try {
    audioChunks.value = []
    mediaRecorder.value.startMic()
    mediaRecorder.value.startRecording();
    mediaRecorder.value.on('record-end', (event) => {
      audioChunks.value.push(event)
      audioBlob = new Blob(audioChunks.value)
    })
  } catch (e) {
    warning('e')
    console.log(e)
  }
}
const stopRecording = async () => {
  mediaRecorder.value?.stopRecording();
  mediaRecorder.value?.stopMic();
  if (audioChunks.value.length === 0) {
    return
  }
  audioBlob = new Blob(audioChunks.value)
}

const createWaveSurfer = () => {
  if (waveSurfer){
    waveSurfer.destroy()
  }
  waveSurfer = WaveSurfer.create({
    container: waveformRef.value!,
    waveColor: themeVars.value.primaryColor,
    progressColor: themeVars.value.primaryColorHover,
    audioRate: 1,
    barWidth: 5,
  })
  mediaRecorder.value = waveSurfer.registerPlugin(RecordPlugin.create({
    renderRecordedAudio: false,
    scrollingWaveform: false,
  }));
}
onMounted(async () => {
  RecordPlugin.getAvailableAudioDevices().then((microphones) => {
    microphones.forEach((microphone) => {
      deviceOptions.value.push({
        label: microphone.label,
        value: microphone.deviceId
      })
    });
    selectedDevice.value = microphones[0].deviceId
  })
});

</script>

<template>
  <n-select :options="deviceOptions" placeholder="Select a microphone" v-model:value="selectedDevice"/>
  <div class="flex flex-col items-center">
  <n-space size="large">
    <n-icon size="100" :color="microphoneColor"><MicCircleSharp @click="toggleRecording"/></n-icon>
  </n-space>
  </div>
  <div id="waveform" ref="waveformRef"></div>
<Playback v-if="!isRecording && audioChunks.length > 0" :audio-blob="audioChunks[0]"></Playback>


</template>

<style scoped>

</style>