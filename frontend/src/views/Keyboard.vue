<script setup lang="ts">
import {computed, onMounted, Ref, ref, watch} from 'vue';
import {useEventListener} from "@vueuse/core";
import {useLessonStore} from "@/store/lessons";
import {useI18n} from "vue-i18n";
import TypingSpeedChart from "@/components/TypingSpeedChart.vue";
import {useMessage} from "naive-ui";

const lastKey = ref('');
const lessonStore = useLessonStore();
const message = useMessage();
const {lessons, loading, error, fetchLessons} = lessonStore;
const {t} = useI18n();
const selectedLesson = ref(null);
const selectedLevel = ref(null);

const levelOptions = ref([]);

const isPlaying = ref(false);
const keyPresses = ref([]);
const startTime = ref(null);
const currentIdx = ref(0);
const currentStringIdx = ref(0);
const currentString = computed(() => {
  const lesson = lessons.find((lesson => lesson.id === selectedLesson.value));
  const level = lesson?.levels.find((level) => level.id === selectedLevel.value);
  return level?.content[currentStringIdx.value] || '';
})
const correctCount = computed(() => keyPresses.value.filter(p => p.isCorrect).length)
const incorrectCount = computed(() => keyPresses.value.length - correctCount.value)
const timerCount = ref(0);
const timer = ref(null);

onMounted(async () => {
  await fetchLessons();
  if (lessons.length > 0 ){
    selectedLesson.value = lessons[0].id;
    if (lessons[0].levels.length > 0){
      selectedLevel.value = lessons[0].levels[0].id;
    }
  }
})

const lessonOptions = computed(() =>
    lessons.map((lesson) => ({
      label: lesson.title,
      value: lesson.id
    }))
)

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
    message.success(t('keyboard.finished', {minutes: (timerCount.value / 60).toFixed(2), seconds: timerCount.value, cpm: cpm.value, errors: incorrectCount.value}));
    // showPlot.value = true;
    return;
}
const timeObject = computed(() => new Date(timerCount.value * 1000));


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
const buttonLabel = computed(() => isPlaying.value ? t('keyboard.stop') : t('keyboard.start'));
const handleKeydown = (event: KeyboardEvent) => {
  if(!isPlaying.value) return;
  if (['Space', 'Enter'].includes(event.code)) {
    event.preventDefault();
  }
  const timestamp = Date.now();
  const currentChar = currentString.value[currentIdx.value];
  if (event.key === currentChar || (event.key === 'Enter' && currentChar === '\n')) {
    currentIdx.value++;
    keyPresses.value.push({
      timestamp, isCorrect: true
    })
    if (currentIdx.value >= currentString.value.length){
      currentIdx.value = 0;
      currentStringIdx.value++;
      const lesson = lessons.find((lesson) => lesson.id === selectedLesson.value);
      const level = lesson?.levels.find((level) => level.id === selectedLevel.value);
      if (currentStringIdx.value >= (level?.content.length || 0)) {
        stopExercise();
      }
    }
  }
  else {
    keyPresses.value.push({
      timestamp, isCorrect: false
    })
  }
  lastKey.value = event.key;
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
        <div class="text-lg md:text-xl font-mono" :class="{'blur-sm': !isPlaying}">
        <span v-for="(char, index) in currentString" :key="index"
              :class="{ 'text-red-500 underline': index === currentIdx}"
        >
              <template v-if="char === '\n'">
      <span class="newline-symbol">↵</span><br>
    </template>
    <template v-else>
      {{ char }}
    </template>
        </span>
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