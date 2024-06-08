<script setup lang="ts">
import {SelectOption, useMessage, useThemeVars} from "naive-ui";
import { CogOutline } from '@vicons/ionicons5'
import {computed, onMounted, ref, watch} from "vue";
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'
import {debounce} from 'lodash-es';
import Playback from "@/components/Playback.vue";
import RecordingControl from "@/components/RecordingControl.vue";
const waveformRef = ref<HTMLElement | null>(null);
let waveSurfer = <WaveSurfer | null>null;

const isRecording = ref(false)
const playbackRate = ref(1)
const mediaRecorder = ref<RecordPlugin | null>(null)
const audioChunks = ref<Blob[]>([])
const message = useMessage();
const deviceOptions = ref<SelectOption[]>([])
const selectedDevice = ref<string | null>(null)
const isPaused = ref(false)
const warning = (text: string) => {
  message.warning(text)
}
const themeVars = useThemeVars();
const setPlaybackRate = debounce((rate: number) => {
  waveSurfer?.setPlaybackRate(rate, true);
  waveSurfer?.play()
}, 100)
const showModalRef = ref(false)
const toggleRecording = async () => {
  isPaused.value = false
  if (!isRecording.value){
    if (audioChunks.value.length > 0){
      showModalRef.value = true
      return
    }
    else {
      await startNewRecording()
    }
  }
  else {
    await stopRecording()
  }
}
const cancelNewRecording = () => {
  showModalRef.value = false
}
const startNewRecording = async () => {
  isPaused.value = false
  isRecording.value = true
  await startRecording()
}
const pauseRecording = () => {
  mediaRecorder.value?.isPaused() ? mediaRecorder.value?.resumeRecording() : mediaRecorder.value?.pauseRecording()
  isPaused.value = !isPaused.value
}


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
  isRecording.value = false;
  mediaRecorder.value?.stopRecording();
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
    scrollingWaveform: true,
    audioBitsPerSecond: 128000,
  }));
}
onMounted(async () => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device) => {
      if (device.kind === 'audioinput') {
        deviceOptions.value.push({
          label: device.label,
          value: device.deviceId
        })
      }
    })
    selectedDevice.value = devices[0].deviceId
  })
});
const showSettings = ref(false)
</script>

<template>
<n-modal
    v-model:show="showModalRef"
    :mask-closable="false"
    preset="dialog"
    :title="$t('voice.resetAlertTitle')"
    :content="$t('voice.resetAlert')"
    :positive-text="$t('common.yesLabel')"
    :negative-text="$t('common.noLabel')"
    @positive-click="startNewRecording"
    @negative-click="cancelNewRecording"
/>
  <div class="flex flex-col items-center">
    <div class="flex-1 items-center">
      <RecordingControl
          :is-recording="isRecording"
          :is-paused="isPaused"
          @toggle-recording="toggleRecording"
          @pause-recording="pauseRecording"
          />
    </div>
  </div>
  <div class="flex justify-end">
    <n-button text
              @click="showSettings = !showSettings">
      <n-icon depth="3" class="sized-icon-50"><CogOutline/></n-icon>
    </n-button>

    <n-modal v-model:show="showSettings">
      <n-card
      :title="$t('voice.settings')"
      aria-modal="true"
      class="w-80 fixed right-10 top-10 md:w-1/3 md:right-0.5 md:top-1">
        <n-select :options="deviceOptions" placeholder="Select a microphone" v-model:value="selectedDevice"/>
      </n-card>
    </n-modal>
  </div>
  <div id="waveform" ref="waveformRef" v-show="isRecording"></div>
<Playback v-if="!isRecording && audioChunks.length > 0" :audio-blob="audioChunks[0]"></Playback>


</template>

<style scoped>
.sized-icon-50 {
  font-size: 32px;
}
@media (min-width: 768px) {
.sized-icon-50 {
  font-size: 50px;
}
}
</style>