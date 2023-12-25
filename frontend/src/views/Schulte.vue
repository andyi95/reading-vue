<script>
import {NGi, NGrid, NGridItem, NInputNumber, useMessage, NCard, NLayout, NLayoutContent, useThemeVars, NButton, NTime, NFormItem, NTooltip} from 'naive-ui';
import {ref} from "vue";
import {mapActions}  from "vuex";
export default {
  name: 'Schulte',
  components: {NGrid, NGi, NGridItem, NInputNumber, NCard, NLayout, NLayoutContent, NButton, NTime, NFormItem, NTooltip},

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
      gameMode: this.$store.state.schulteSettings.gameMode,
      buttonLabel: null,
      easyMode: this.$store.state.schulteSettings.easyMode,
      errors: 0,
      tableCharsType: this.$store.state.schulteSettings.tableCharsType,
      windowHeight: 0,
      windowWidth: 0,
      tileRefs: [],
    }
  },
  setup(){
    const message = useMessage();
    const timerCount = ref(0);
    const timer = ref(null);
    const themeVars = useThemeVars();
    const schulteGridRef = ref(null);
    return {
      timerCount, timer,
      warning(text) {
        message.warning(text)
      },
      success(text) {
        message.success(
            text, { duration: 5000})
      },
      themeVars, schulteGridRef
    }
  },
  computed: {
    backgroundColor() {
      return this.themeVars.modalColor
    },
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
          label: this.$t('schulte.emojiOption'),
          value: 'emoji'
        }
      ]
    },
    tableTypes(){
    return[
      {label: this.$t('schulte.gorbovOption'), value: 'gorbov'},
      {label: this.$t('schulte.classicTable'), value: 'classic'}
    ]
    },
    getSchulteResults(){
      return this.$store.getters.sortedSchulteResults
    },
    gridSizes(){
      let wRate = 0.7;
      if (this.size > 5) {
        wRate = 0.8;
      }
      if (this.size > 10) {
        wRate = 0.8;
      }
      if (this.windowHeight < 600){
        wRate = 0.7;
      }
      const maxWidth = Math.round(Math.min(this.windowWidth * 0.93, this.windowHeight * 0.93) * 100) / 100;
      const minWidth = Math.round(Math.min(this.windowWidth * wRate, this.windowHeight * wRate) * 100) / 100;

      const gridSizeFactor = 0.4;
      const windowSizeFactor = 0.001; // Adjusts how much the window size affects the gap

      const baseGap = Math.round(5 - this.size * gridSizeFactor + Math.min(this.windowWidth, this.windowHeight) * windowSizeFactor);
      const gap = Math.min(Math.max(baseGap, 1), 5);

      return{
        minHeight: `${this.windowHeight * 0.7}px`,
        maxHeight: `${Math.round(this.windowHeight * 0.9)}px`,
        maxWidth: `${maxWidth}px`,
        minWidth: `${minWidth}px`,
        fontSize: `${Math.min(Math.round(maxWidth / this.size * 0.4), 32)}px`,
        gap: gap
      }
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
        this.currentIndex = 0;
        this.startTime = new Date();
        this.errors = 0;
        this.currentItem = this.gridData[this.currentIndex];
        this.timerCount = 0;
        this.updateSchulteResults({
          startTime: this.startTime,
          endTime: null,
          currentRate: 0, errors: 0,
          size: this.size,
          tableType: this.tableCharsType,
          easyMode: this.easyMode
        })
        this.updateSchulteSettings({
          size: this.size,
          tableType: this.tableCharsType,
          easyMode: this.easyMode,
          tableCharsType: this.tableCharsType
        })
        this.timer = setInterval(() => {
          this.timerCount++;
        }, 1000);
      }
      else {
        this.stop();
      }
    },
    reset(value){
      if (value && typeof value === 'number'){
        this.size = value
      }
      this.shuffle();
      this.currentIndex = 0;
      this.startTime = new Date();
      this.errors = 0;
      this.currentItem = this.gridData[this.currentIndex];
      this.timerCount = 0;
    },
    shuffle() {
      this.gridData = [];
      this.generateData()
    },
    generateData(){
      const data = this.generateSourceData().slice(0, this.size ** 2)
      this.gridData = []
      this.gridData = data.sort((a, b) => a - b).map(code => ({
        value: code.toString(),
        hidden: false
      }));
      if (this.gameMode === 'gorbov'){
        this.generateGorbovData()
      }
      this.shuffledGrid = this.shuffleArray(this.gridData)
    },
    range(start, end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
    shuffleArray(array, biasFactor = 1) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const bias = Math.pow((i + 1) / arr.length, biasFactor);
        const j = Math.floor(Math.random() * (i + 1) * bias);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    generateEmojiRange(){
      const emojiis = [
        ...this.range(0x1F600, 0x1F64F),  // smileyes
        ...this.range(0x1F680, 0x1F6FF), // transport
        ...this.range(0x1F90F, 0x1F9A2), // body parts
        ...this.range(0x1F300, 0x1F320),  // weather
        ...this.range(0x1F32D, 0x1F392), // food
        ...this.range(0x1F3A0, 0x1F3C4), // sport
        ...this.range(0x1F3C6, 0x1F3CA), // music
        ...this.range(0x1F3E0, 0x1F3F0), // house
        ...this.range(0x1F400, 0x1F43E), // animals
        ...this.range(0x1F440, 0x1F440), // eyes
      ]
      const excludeEmojis = [
          0x1F6D3, 0x1F6D6,
          0x1F6D4, ...this.range(0x1F6D8, 0x1F6DB), ...this.range(0x1F6ED, 0x1F6EF),
              ...this.range(0x1F6FD, 0x1F6FF),
      ]
      return this.shuffleArray(emojiis.filter(code => !excludeEmojis.includes(code)), 0.1)
    },
    generateSourceData(){
      const latinParts = [
        this.range(0x00C0, 0x00D6), this.range(0x00D8, 0x00F6),
        this.range(0x00F8, 0x00FF), this.range(0x0180, 0x027F),
        this.range(0x0391, 0x03CE)
      ]
      const latinLetters = [
          ...this.range(0x0041, 0x005A), ...this.range(0x0061, 0x007A)
      ]
      let i = 0;
      while (latinLetters.length < this.size ** 2){
        latinLetters.push(...latinParts[i])
        i ++;
      }
      const cyrillicLetters = [
          ...this.range(0x0400, 0x04FF)
      ]
      const emojiis = this.generateEmojiRange()
      const codeGenerators = {
        'letters-en': () => latinLetters.map(code => (
            String.fromCharCode(code)
        )),
        'letters-ru': () => cyrillicLetters.map(code => (
          String.fromCharCode(code)
        )),
        'letters-zh': () => this.range(0x4E04, 0x9FFF).map(code => (
          String.fromCharCode(code)
        )),
        'digits': () => this.range(1, this.size ** 2),
        'emoji': () => emojiis.map(code => (
          String.fromCodePoint(code)
        )),
      }
      return codeGenerators[this.tableCharsType]()
    },
    generateGorbovData(){
      let idxB = 0;
      let idxR = Math.floor(this.size ** 2 / 2) + 1;
      const gridData = [...this.gridData]
      for (let i = 1; i <= this.size ** 2; i++){
        if (i % 2 === 0){
          idxR --;
          this.gridData[i - 1] = {
            isRed: true,
            color: 'red',
            value: gridData[idxR - 1].value,
            hidden: false
          }
        }
        else {
          idxB ++;
          this.gridData[i - 1] = {
            isRed: false,
            color: 'black',
            value: gridData[idxB - 1].value,
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
        errors: this.errors,
        size: this.size
      })
    },
    clickTile(value){
      if (!this.isPlaying){
        return 0
      }
      if(this.currentItem !== value){
        this.warning(this.$t('schulte.wrong'))
        this.errors ++;
        return 0
      }
      if (this.easyMode) {
        this.currentItem.hidden = true
      }
      if (this.currentIndex === this.gridData.length - 1){
        this.stop();
        return 0
      }
      this.currentIndex ++ ;
      this.currentRate ++;
      this.saveResults()
      this.currentItem = this.gridData[this.currentIndex]
    },
    stop(){
      this.endTime = new Date()
      let dt = new Date(this.endTime - this.startTime)
      this.success(this.$t('schulte.finished', {
        minutes: dt.getMinutes(), seconds: dt.getSeconds(), errors: this.errors, rate: this.currentRate}))
      this.isPlaying = false
      this.saveResults();
      clearInterval(this.timer);
    },
    onResize(){
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    }
  },
  mounted() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.reset()
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

}

</script>

<template>

<n-grid cols="1 414:6" :x-gap="10" item-responsive>
<n-grid-item
    content-style="padding: 5px;"
    span="1"
    style="max-width: 300px"
>
  <n-space vertical>
    <n-form-item :label="$t('schulte.size')">
  <n-input-number v-model:value="size" :min="3" :max="20" :step="1" :default-value="5" @update:value="reset">
  </n-input-number>
    </n-form-item>
    <n-form-item :label="$t('schulte.easyGame')">
    <n-tooltip trigger="hover">
      <template #trigger>
      <n-switch v-model:value="easyMode"/>
    </template>{{$t('schulte.easyGameTooltip')}}</n-tooltip></n-form-item>
    <n-form-item :label="$t('schulte.selectOption')">
      <n-select
          :options="tableTypes"
          default-value="gorbov"
          v-model:value="gameMode"
          @update:value="reset"
      ></n-select>
    </n-form-item>
    <n-form-item :label="$t('schulte.tableFillment')">
      <n-select
        :options="trainingDataOptions"
        default-value="letters"
        v-model:value="tableCharsType"
        @update:value="reset"/>
    </n-form-item>
    <n-button @click="start" size="large" :type="this.isPlaying ? 'default': 'primary'" style="max-width: 100%; min-width: 100%">{{ buttonLabel || this.$t('schulte.start') }}</n-button>

    <div class="timer text-xl md:text-2xl">
    {{ this.$t('schulte.timeLabel')}}: <n-time :time="timerCountFormatted" format="mm:ss"></n-time>
    </div>

  </n-space>
</n-grid-item>
  <n-grid-item class="responsive-grid md:place-self-center" span="5">
    <div class="centered-container place-self-center">
        <n-card v-if="currentItem" class="current-item mb-1 py-0 max-w-lg"
        content-style="display: flex; align-items: center; justify-content: center; aspect-ratio: 1/1;  padding: 2px; margin: 2px">
                <span :class="{red: currentItem.isRed, 'emoji': tableCharsType === 'emoji'}"
                      class="current-item">&nbsp;{{ currentItem.value }}&nbsp;</span>
        </n-card>
    </div>
  <n-grid :cols="this.size" :x-gap="gridSizes.gap" :y-gap="gridSizes.gap" class="square-container" ref="schulteGridRef">
    <n-grid-item v-for="(item, index) in this.shuffledGrid"
                 :key="index" class="square"
                 :ref="el => { if (el) this.tileRefs[index] = el; }"
                 :class="{ hidden: item.hidden, red: item.isRed, 'emoji': tableCharsType === 'emoji'}"
                 @click="clickTile(item)">
      <div class="content">{{ item.value }}</div>
    </n-grid-item>
  </n-grid>

  </n-grid-item>
<div v-if="false">
  <n-grid-item v-if="getSchulteResults" :span="2">

        <n-card v-for="result in getSchulteResults" :title="$d(result.startTime, 'short')">
          <p>{{ $t('schulte.size') }}: {{ result.size? result.size : '0' }} </p>
        <p>{{ $t('schulte.timeLabel')}}: {{ $d(result.endTime - result.startTime, 'diff') }} </p>
        <p>{{ $t('schulte.errorsLabel')}}: {{ result.errors }} </p>
        <p>{{ $t('schulte.rateLabel')}}: {{ result.currentRate }} </p>
        </n-card>

  </n-grid-item></div>
</n-grid>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

.timer {
  margin-top: 5px;
  padding-bottom: 2px;
  padding-top: 2px;
  background-color: v-bind('backgroundColor');
  border-radius: 2px;
  text-align: center;
}
.centered-container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
:root {
  --grid-max-width: v-bind('gridSizes.maxWidth');
}

.responsive-grid {
  max-width: v-bind('gridSizes.maxWidth');
  min-width: v-bind('gridSizes.minWidth');
}
@media screen and (max-width: 414px){
  aside {
    float: left;
    width: 30%;
  }
  .timer {
    margin-top: 15px;
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 8px;
  }

}


@media screen and (min-height: 1090px){

  aside {
    float: left;
    width: 30%;
  }
}

.square-container {
  display: flex;
  flex-wrap: wrap;
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
  max-width: var(--grid-max-width);
  display: flex;
  justify-content: center;
  top: 0;
  bottom: 0;
  font-size: v-bind('gridSizes.fontSize');
}
span .current-item{
  aspect-ratio: 1/1;
}
.square .content {
  justify-content: center;
  display: flex;
  align-content: center;
  align-items: center;
  color: #ffffff;
  font-size: v-bind('gridSizes.fontSize');
}
.hidden {
  visibility: hidden;
}
.red:not(.current-item) {
  background-color: #ff6a6a;
}
.red:hover:not(.current-item) {
  background-color: #fe8a8a;
}
.red.current-item:not(.emoji) {
  color: #ff6a6a;
}
.red.current-item.emoji {
  background-color: #ff6a6a;
}
.emoji{
  font-family: 'Noto Color Emoji', sans-serif;
  color: #ffffff;
}
.emoji.current-item:not(.red) {
  background-color: #313131;
}
</style>
