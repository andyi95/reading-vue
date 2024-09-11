<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {useEventListener} from "@vueuse/core";
import {useLessonStore} from "@/store/lessons";

const lastKey = ref('');
const lessonStore = useLessonStore();
const {lessons, loading, error, fetchLessons} = lessonStore;

const selectedLesson = ref(null);
const selectedLevel = ref(null);

const levelOptions = ref([]);

const characters = ref([]);
const isPlaying = ref(false);
const keyPresses = ref([]);
const startTime = ref(null);
const timeInterval = ref(null);
const currentIdx = ref(0);
const correctCount = computed(() => keyPresses.value.filter(p => p.isCorrect).length)
const incorrectCount = computed(() => keyPresses.value.length - correctCount.value)
const elapsedTime = computed(() => started.value ? (Date.now() - startTime.value) / 1000 : 0) // seconds

onMounted(async () => {
  if (lessons.length !== 0) return;
  await fetchLessons();
  console.log('fetched lessons');
  console.log(lessons)
})

const lessonOptions = computed(() =>
    lessons.map((lesson) => ({
      label: lesson.title,
      value: lesson.id
    }))
)
const selectedLevelContent = computed(() => {
  if (selectedLesson.value && selectedLevel.value) {
    const lesson = lessons.find((lesson) => lesson.id === selectedLesson.value);
    const level = lesson.levels.find((level) => level.id === selectedLevel.value);
    return level ? level.content : '';
  }
  return '';
});

const startExercise = () => {
  isPlaying.value = true;
  startTime.value = Date.now();
  keyPresses.value = [];
  currentIdx.value = 0;
  timeInterval.value = setInterval(() => {

  }, 1000);
}
const stopExercise = () => {
  isPlaying.value = false;
  clearInterval(timeInterval.value);
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


const handleKeydown = (event: KeyboardEvent) => {
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
useEventListener('keydown', handleKeydown);
</script>

<template>
  <n-space vertical>

  </n-space>
  <div class="container mx-auto p-4 h-screen grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="col-span-1">
      <n-card class="shadow-lg">
        <n-space vertical>
            <n-select
      v-model:value="selectedLesson"
      :options="lessonOptions"
      placeholder="Select a lesson"
    />
    <n-select
      v-model:value="selectedLevel"
      :options="levelOptions"
      placeholder="Select a level"
      :disabled="selectedLesson === null"/>
          </n-space>
      </n-card>
      <n-card class="shadow-lg">
        <template #header><div class="text-lg font-semibold mb-4">Progress</div></template>
        <div class="text-sm">
          <p>Correct: {{ correctCount }}</p>
          <p>Incorrect: {{ incorrectCount }}</p>
        </div>
        <n-button @click="startExercise">Start</n-button>
      </n-card>
    </div>
    <div class="col-span-3">
      <n-card class="shadow-lg">
        <div class="text-lg font-mono">
        <span v-for="(char, index) in selectedLevelContent" :key="index"
              :class="{ 'text-red-500 underline': index === currentIdx}"
        >{{ char }}</span>
        </div>
        <n-space class="mt-4">
          <n-button @click="reset" type="primary">Reset</n-button>
        </n-space>
      </n-card>
    </div>
  </div>

<n-space>
  <n-card size="large">
    <div v-if="lastKey">{{ lastKey }}</div>
  </n-card>
</n-space>
</template>

<style scoped>

</style>