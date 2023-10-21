<script>
import {NGi, NGrid, NGridItem, NInputNumber, useMessage, NCard, NLayout, NLayoutContent, useThemeVars } from 'naive-ui';
import {ref} from "vue";
import Timer from "@/components/Timer.vue";
import {useI18n} from "vue-i18n";

export default {
  name: 'Schulte',
  components: {Timer, NGrid, NGi, NGridItem, NInputNumber, NCard, NLayout, NLayoutContent},
  data() {
    return {
      isPlaying: false,
      size: 5,
      gridData: [],
      shuffledGrid: [],
      startTime: null,
      endTime: null,
      currentRate: 0,
      currentItem: null,
      currentIndex: 0,
      tableType: 'gorbov',
      buttonLabel: null,
      easyMode: false,
      trainingData: 'digits'
    }
  },
  setup(){
    const message = useMessage();
    const timerCount = ref(0);
    const timer = ref(null);
    const themeVars = useThemeVars();
    const { t } = useI18n();
    const trainingDataOptions = [
          {
            label: t('schulte.digitsOption'),
            value: 'digits'
          },
          {
            label: t('schulte.enLetterOptions'),
            value: 'letters-en'
          },
      {
        label: t('schulte.ruLetterOptions'),
        value: 'letters-ru'},
      {
        label: t('schulte.zhLetterOption'),
        value: 'letters-zh'
      },
      {
        label: t('schulte.gorbovOption'),
        value: 'gorbov'
      }
    ]

    return {
      timerCount, timer,
      warning(text) {
        message.warning(text)
      },
      success(text) {
        message.success(
            text, {closable: true, duration: 0})
      },
      trainingDataOptions, themeVars
    }
  },
  computed: {
  timerCountFormatted(){
       return new Date(this.timerCount * 1000)
    }
  },
  watch: {
    isPlaying(value){
      if (value){
        this.buttonLabel = this.$t('schulte.stop')
      }
      else {
        this.buttonLabel = this.$t('schulte.start')

      }
    }
  },
  methods: {
    start(){
      if (!this.isPlaying){
        this.isPlaying = true
        this.startTime = new Date()
        this.timer = setInterval(() => {
          this.timerCount++;
        }, 1000);
      }
      else {
        this.isPlaying = false
        clearInterval(this.timer);
      }
    },
    reset(){
      this.shuffle();
      this.currentIndex = 0;
      this.currentItem = this.gridData[this.currentIndex];
      this.timerCount = 0;
    },
    shuffle() {
      this.generateData()
      this.shuffledGrid = [...this.gridData].sort(() => Math.random() - 0.5)
    },
    generateData(){
      if (this.tableType === 'gorbov'){
        this.generateGorbovData()
      }
      else if (this.tableType.startsWith('letters')){
        this.generateLettersData()
      }
      else if (this.tableType === 'digits'){
        this.generateDigits()
      }
      else {
        this.generateLettersData()
      }
    },
    range(start, end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
    shuffleArray(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    generateDigits(){
      const shuffledCodes = this.shuffleArray(this.range(1, this.size ** 2));
      this.gridData = shuffledCodes.map(code => ({
        value: code.toString(),
        hidden: false
      }));
    },
    generateLettersData() {
      const codeGenerators = {
        'letters-en': () => this.range(0x0020, 0x007F),
        'letter-ru': () => this.range(0x0400, 0x04FF),
        'letters-zh': () => this.range(0x4E00, 0x9FFF),
      }
      const shuffledCodes = this.shuffleArray(codeGenerators[this.tableType]()).slice(0, this.size ** 2);
      this.gridData = shuffledCodes.map(code => ({
        value: String.fromCharCode(code),
        hidden: false
      }));

    },
    generateGorbovData(){
      let idxB = 0;
      let idxR = Math.floor(this.size ** 2 / 2) + 1;

      for (let i = 1; i <= this.size ** 2; i++){
        if (i % 2 === 0){
          idxR --;
          this.gridData[i - 1] = {
            isRed: true,
            color: 'red',
            value: idxR.toString(),
            hidden: false
          }
        }
        else {
          idxB ++;
          this.gridData[i - 1] = {
            isRed: false,
            color: 'black',
            value: idxB.toString(),
            hidden: false
          }
        }
      }
    },
    clickTile(value){
      if (!this.isPlaying){
        return 0
      }
      if(this.currentItem !== value){
        this.warning(this.$t('schulte.wrong'))
        return 0
      }
      if (this.easyMode) {
        this.currentItem.hidden = true
      }
      if (this.currentIndex === this.gridData.length - 1){
        this.success(this.$t('schulte.finished'))
        this.isPlaying = false
        clearInterval(this.timer);
        return 0
      }
      this.currentIndex ++ ;
      this.currentRate ++;
      this.currentItem = this.gridData[this.currentIndex]
    }
  },
  mounted() {
    this.reset()
  }
}

</script>

<template>
<n-layout has-sider>
<n-layout-sider content-style="padding: 5px;">
  <n-space vertical>
    <n-form-item :label="$t('schulte.size')">
  <n-input-number v-model:value="size" :min="3" :max="20" :step="1" :default-value="5" @update:value="reset"/>
    </n-form-item>
    <n-form-item :label="$t('schulte.easyGame')">
      <n-switch v-model:value="easyMode"/></n-form-item>
    <n-form-item :label="$t('schulte.selectOption')">
      <n-select
          :options="trainingDataOptions"
          default-value="letters"
          v-model:value="tableType"
          @update:value="reset"
      ></n-select>
    </n-form-item>
    <n-space>
    <n-button @click="start">{{ buttonLabel || this.$t('schulte.start') }}</n-button>
    <n-button @click="reset">{{ this.$t('schulte.reset')}}</n-button></n-space>
    <span size="small">{{ this.$t('schulte.timeLabel')}}: <n-time :time="timerCountFormatted" format="mm:ss"></n-time></span>

  </n-space>
</n-layout-sider>
  <n-layout-content>
    <n-card v-if="currentItem" class="current-item">
      <span
          :class="{red: currentItem.isRed}">{{ currentItem.value }}</span>
    </n-card>
  <n-grid :cols="this.size" :x-gap="5" :y-gap="5" class="square-container">
    <n-grid-item v-for="(item, index) in this.shuffledGrid"
                 :key="index" class="square"
                 :class="{ hidden: item.hidden, red: item.isRed}"
                 @click="clickTile(item)">
      <div class="content">{{ item.value }}</div>
    </n-grid-item>
  </n-grid>

  </n-layout-content>
</n-layout>
</template>

<style scoped>
.square-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 768px;
}
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
}

.square {
  aspect-ratio: 1/1;
  margin: 1px;
  position: relative;
  justify-content: center;
  display: flex;
  align-content: center;
  align-items: center;
  background-color: v-bind('themeVars.buttonColor2');
}
.current-item {
  align-items: center;
  max-width: 768px;
  margin-bottom: 3px;
}
.square .content {
  position: absolute;
  top: 0;
  bottom: 0;
  justify-content: center;
  display: flex;
  align-content: center;
  align-items: center;
}
.hidden {
  visibility: hidden;
}
.red {
  color: v-bind('themeVars.errorColor');
}

</style>
<style>
body, #app {
  overflow: hidden;
}
</style>