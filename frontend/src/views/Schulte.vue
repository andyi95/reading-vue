<script>
import {NGi, NGrid, NGridItem, NInputNumber, useMessage, NCard, NLayout, NLayoutContent, useThemeVars, ResponsiveDescription } from 'naive-ui';
import {ref} from "vue";
import Timer from "@/components/Timer.vue";
import {useI18n} from "vue-i18n";
import {mapActions}  from "vuex";

export default {
  name: 'Schulte',
  components: {Timer, NGrid, NGi, NGridItem, NInputNumber, NCard, NLayout, NLayoutContent},

  data() {
    return {
      isPlaying: false,
      size: this.$store.state.schulteSettings.size,
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
      errors: 0,
      trainingData: 'digits'
    }
  },
  setup(){
    const message = useMessage();
    const timerCount = ref(0);
    const timer = ref(null);
    const themeVars = useThemeVars();
    return {
      timerCount, timer,
      warning(text) {
        message.warning(text)
      },
      success(text) {
        message.success(
            text, {closable: true, duration: 0})
      },
      themeVars
    }
  },
  computed: {
  timerCountFormatted(){
       return new Date(this.timerCount * 1000)
    },
    trainingDataOptions(){
      return [
        {
          label: this.$t('schulte.digitsOption'),
          value: 'digits'
        },
        {
          label: this.$t('schulte.enLetterOptions'),
          value: 'letters-en'
        },
        {
          label: this.$t('schulte.ruLetterOptions'),
          value: 'letters-ru'},
        {
          label: this.$t('schulte.zhLetterOption'),
          value: 'letters-zh'
        },
        {
          label: this.$t('schulte.gorbovOption'),
          value: 'gorbov'
        }
      ]
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
    ...mapActions([
        'updateSchulteResults',
        'updateSchulteSettings'
    ]),
    start(){
      if (!this.isPlaying){
        this.isPlaying = true
        this.startTime = new Date()
        this.updateSchulteResults({
          startTime: this.startTime,
          endTime: null,
          currentRate: 0, errors: 0,
          size: this.size,
          tableType: this.tableType,
          easyMode: this.easyMode
        })
        this.timer = setInterval(() => {
          this.timerCount++;
        }, 1000);
      }
      else {
        this.isPlaying = false
        clearInterval(this.timer);
      }
    },
    reset(value){
      console.log(value)
      this.updateSchulteSettings({
        size: this.size,
        tableType: this.tableType,
        easyMode: this.easyMode
      })
      this.shuffle();
      this.currentIndex = 0;
      this.startTime = new Date();
      this.errors = 0;
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
    saveResults(){
      this.endTime = new Date()
      this.updateSchulteResults({
        startTime: this.startTime,
        endTime: this.endTime,
        currentRate: this.currentRate,
        errors: this.errors
      })
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
        let time = (this.endTime - this.startTime) / 1000

        this.success(this.$t('schulte.finished', {time: time, errors: this.errors, rate: this.currentRate}))
        this.isPlaying = false
        clearInterval(this.timer);
        return 0
      }
      this.currentIndex ++ ;
      this.currentRate ++;
      this.saveResults()
      this.currentItem = this.gridData[this.currentIndex]
    }
  },
  mounted() {
    this.reset()
  }
}

</script>

<template>

<n-grid cols="1 414:6" :x-gap="10">
<n-grid-item
    content-style="padding: 5px;"
    span="1"
    style="max-width: 300px"
>
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
</n-grid-item>
  <n-grid-item style="max-width: 768px;" span="5">
    <n-card v-if="currentItem" class="current-item">
      <span
          :class="{red: currentItem.isRed}" class="current-item">{{ currentItem.value }}</span>
    </n-card>
  <n-grid :cols="this.size" :x-gap="5" :y-gap="5" class="square-container">
    <n-grid-item v-for="(item, index) in this.shuffledGrid"
                 :key="index" class="square"
                 :class="{ hidden: item.hidden, red: item.isRed}"
                 @click="clickTile(item)">
      <div class="content">{{ item.value }}</div>
    </n-grid-item>
  </n-grid>

  </n-grid-item>
</n-grid>

</template>

<style scoped>
.square-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 768px;
}

.square {
  aspect-ratio: 1/1;
  margin: 1px;
  position: relative;
  justify-content: center;
  display: flex;
  align-content: center;
  align-items: center;
  background-color: #313131;
}
.square:hover {
  background-color: #5F5C5C;
}
.current-item {
  align-items: center;
  max-width: 768px;
  top: 0;
  bottom: 0;
  //margin-bottom: 3px;
  font-size: 2em;
}
.square .content {
  justify-content: center;
  display: flex;
  align-content: center;
  align-items: center;
  font-size: 3.5em;
  color: #ffffff
}
.hidden {
  visibility: hidden;
}
.red {
  background-color: #ff6a6a;
}
.red:hover {
  background-color: #fe8a8a;
}
@media screen and (max-width: 414px){
  .square-container, .current-item {
    max-width: 480px;
  }
  .square .content{
    font-size: 2.5em;
  }
  .current-item {
    font-size: 1.5em;
  }
  aside {
    float: left;
    width: 30%;
  }
}

</style>
<style>

</style>