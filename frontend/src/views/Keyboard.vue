<script setup lang="ts">
import {computed, onMounted, Ref, ref, watch} from 'vue';
import {useEventListener} from "@vueuse/core";
import {useLessonStore} from "@/store/lessons";
import {useI18n} from "vue-i18n";
import TypingSpeedChart from "@/components/TypingSpeedChart.vue";

const lastKey = ref('');
const lessonStore = useLessonStore();
const {lessons, loading, error, fetchLessons} = lessonStore;

const selectedLesson = ref(null);
const selectedLevel = ref(null);

const levelOptions = ref([]);

const characters = ref([]);
const isPlaying = ref(false);
const keyPresses: Ref<[]> = ref([]);
const startTime = ref(null);
const timeInterval = ref(null);
const currentIdx = ref(0);
const correctCount = computed(() => keyPresses.value.filter(p => p.isCorrect).length)
const incorrectCount = computed(() => keyPresses.value.length - correctCount.value)
const timerCount = ref(0);
const timer = ref(null);
onMounted(async () => {
  // if (lessons.length !== 0) return;

  await fetchLessons();
  console.log('fetched lessons');
  console.log(lessons)
})
const currentElementIdx = ref(0);
const currentELement = computed(() => characters.value[currentElementIdx.value] || '');
const lessonOptions = computed(() =>
    lessons.map((lesson) => ({
      label: lesson.title,
      value: lesson.id
    }))
)

const selectedLevelContent = computed(() => {
  if (selectedLesson.value && selectedLevel.value) {
    const lesson = lessons.find((lesson) => lesson.id === selectedLesson.value);
    const level = lesson?.levels.find((level) => level.id === selectedLevel.value);
    if (!level){
      return '';
    }
    return level.content.join(' ').replace(/[^a-zа-я0-9.,;'" ]/gi, '');
  }
  return '';
});
const showPlot = ref(false);
const startExercise = () => {
  if (isPlaying.value){
    stopExercise();
    return;
  }
  isPlaying.value = true;
  startTime.value = Date.now();
  keyPresses.value = [];
  currentIdx.value = 0;
  timer.value = setInterval(() => {
    timerCount.value++;
  }, 1000);
}
const stopExercise = () => {
    isPlaying.value = false;
    clearInterval(timer.value);
    // showPlot.value = true;
    return;
}
const timeObject = computed(() => new Date(timerCount.value * 1000));
const reset = () => {
  stopExercise();
  currentIdx.value = 0;
}

watch(selectedLesson, (newLessonId) => {
  const lesson = lessons.find((lesson) => lesson.id === newLessonId);
  if (lesson) {
    levelOptions.value = lesson.levels.map((level) => ({
      label: level.title,
      value: level.id
    }));

  }
  else {
    levelOptions.value = [];
  }
  selectedLevel.value = null;
})
watch(selectedLevel, (newLevelId) => {
  characters.value = selectedLevelContent.value.split('');

})
const {t} = useI18n();
const buttonLabel = computed(() => isPlaying.value ? t('keyboard.stop') : t('keyboard.start'));
const handleKeydown = (event: KeyboardEvent) => {
  if(!isPlaying.value) return;
  if (event.code === 'Space') {
    event.preventDefault();
  }
  const timestamp = Date.now();
  const currentChar = characters.value[currentIdx.value]
  keyPresses.value.push({
    timestamp, isCorrect: event.key === currentChar
  })
  if (event.key === characters.value[currentIdx.value]){
    currentIdx.value++;
  }
  lastKey.value = event.key;
  if (currentIdx.value >= characters.value.length){
    stopExercise();
  }
}
const cpm = computed(() => {
  return timerCount.value > 0 ? (correctCount.value / (timerCount.value / 60)).toFixed(2) : 0;
})
useEventListener('keydown', handleKeydown);
</script>

<template>
  <div>
    <n-modal v-model:show="showPlot">
      <TypingSpeedChart :key-press-data="keyPresses"/>
    </n-modal>
  <div class="container mx-auto p-4 h-screen grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="col-span-1">
      <n-card class="shadow-lg">
        <n-space vertical>
            <n-select
      v-model:value="selectedLesson"
      :options="lessonOptions"
      :placeholder="$t('keyboard.lessonSelect')"
    />
    <n-select
      v-model:value="selectedLevel"
      :options="levelOptions"
      :placeholder="$t('keyboard.levelSelect')"
      :disabled="selectedLesson === null"/>
          </n-space>
      </n-card>
      <n-card class="shadow-lg">
        <template #header><div class="text-lg font-semibold mb-4">{{ $t('keyboard.progress')}}</div></template>
        <div class="text-sm">
          <p>{{ $t('keyboard.correct') }} {{ correctCount }}</p>
          <p>{{ $t('keyboard.incorrect') }} {{ incorrectCount }}</p>
          <p>{{ $t('keyboard.timeLabel') }} <n-time :time="timeObject" format="mm:ss"/></p>
          <p>{{ $t('keyboard.cpm')}} {{ cpm }}</p>
        </div>
        <n-button @click="startExercise">{{ buttonLabel }}</n-button>
      </n-card>
    </div>
    <div class="col-span-3">
      <n-card class="shadow-lg">
        <div class="text-lg font-mono" :class="{'blur-sm': !isPlaying}">
        <span v-for="(char, index) in selectedLevelContent" :key="index"
              :class="{ 'text-red-500 underline': index === currentIdx}"
        >{{ char }}</span>
        </div>
        <n-space class="mt-4">
        </n-space>
      </n-card>
    </div>
  </div>
  </div>
</template>

<style scoped>

</style>