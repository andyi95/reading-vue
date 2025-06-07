<template>

  <n-form size="medium">
    <n-space vertical size="medium" justify="space-between">
      <BaseInput :label="$t('spreeder.sourceText')" :placeholder="$t('spreeder.textPlaceHolder')"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>

    <n-form-item :label="$t('spreeder.wordsPerMinute')">
      <n-slider v-model:value="wordsPerMinute" :step="1" :min="100" :max="900" style="padding-right: 4em"/>
    <n-input-number v-model:value="wordsPerMinute" @update:value="changeSpeed" :validator="speedValidator" :placeholder="$t('spreeder.wordsPerMinute')"/>
    </n-form-item>
    </n-space>
    <n-space size="medium" justify="space-between">
    <BaseButton :label="slider.buttonLabel" @buttonClicked="startShow()" class="w-20 overflow-hidden"/>
      <BaseButton :label="$t('spreeder.resetLabel')" @buttonClicked="resetShow()" class="w-20 overflow-hidden"/>
    </n-space>


<n-form-item style="padding-right: 12em">
  <n-collapse arrow-placement="right">
    <n-collapse-item :title="$t('common.settingsLabel')" name="settings">
      <n-form-item :label="$t('common.fontSize')">
      <n-slider v-model:value="slider.fontSize" :step="1" :min="10" :max="400"/>
      </n-form-item>
      <n-form-item :label="$t('common.boxWidth')">
        <n-slider v-model:value="slider.boxWidth" :step="1" :min="10" :max="150"/>
      </n-form-item>
      <n-form-item :label="$t('common.chunkSize')">
        <n-select v-model:value="chunkSize" :options="chunkSizeOptions"/>
      </n-form-item>
    </n-collapse-item>
  </n-collapse>
</n-form-item>
  </n-form>
    <n-card
        :bordered="false" class="slider-card"
        :content-style="`padding-top: 0.3rem; padding-bottom: 0.3rem; align-content: center; max-width: 300px;`"
        :style="`display: flex; flex-wrap: wrap; text-align: center; min-height: 200px; padding-bottom: 2em; padding-top: 2em;`"
        v-show="slider.showCard">
        <span :style="`font-size: ${cardSize}em`"> {{ slider.currentWord }}</span>
    </n-card>
  <n-progress
      type="line" :percentage="slider.progress"
      indicator-placement="inside"
      :style="`max-width: ${getBoxWidth()}; margin-bottom: 10em; margin-top: 10em;`"
      v-show="slider.showCard"/>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {
  NCard,
  NCollapse,
  NCollapseItem,
  NForm,
  NGi,
  NGrid,
  NGridItem,
  NInputGroup,
  NInputNumber,
  NProgress,
  NSelect,
  NSlider,
  NSpace
} from "naive-ui";
import {computed, ref} from "vue";

export default {
  name: "Spreeder",
  components: {
    BaseButton, BaseInput,
    NInputGroup, NSpace, NCard, NInputNumber, NProgress, NGrid, NGridItem,
    NForm, NSlider, NCollapse, NCollapseItem, NSelect, NGi
  },

  methods: {
    sleep(milliseconds){
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
    async displayShow(){
      let chunkSize = Number(this.chunkSize)
      let start = null;
      let i = this.slider.currentIndex;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        let progress = timestamp - start;
        if (progress > this.speed) {
          start = timestamp;

          let currentChunk = this.splittedText.slice(i, i + chunkSize);
          this.slider.currentWord = currentChunk.join(' ');

          if (!this.slider.currentWord.trim().length) {
            this.slider.currentIndex = 0;
            i = -chunkSize;
          }
          let progressPercent = i === 0 ? 0 : Math.max(Math.round(i / this.splittedText.length * 100), 1)
          this.progressUpdate(progressPercent)
          if (i >= this.splittedText.length - chunkSize) {
            if (!this.loopPlay){
              // this.slider.currentIndex = 0;
              // this.slider.progress = 0;
              // this.slider.currentWord = this.splittedText.slice(0, chunkSize).join(' ')
              this.slider.buttonLabel = this.$t('spreeder.startLabel')
              this.slider.isShow = false;
              this.slider.progress = 100;
              return;
            }
            this.slider.currentIndex = 0;
            i = -chunkSize;
          } else {
            this.slider.currentIndex += chunkSize;
            i += chunkSize;
          }
        }
        if (this.slider.isShow){
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    },
    splitText() {
      let splittedText = this.sourceText.trim()
          .replace(/[^A-Za-zА-Яа-я0-9\s]/g, ' ')
          .replace(/[\r\n]/gm, ' ')
          .replace(/[ ]{2,}/g, ' ')
          .split(' ');
      this.splittedText = splittedText.filter(e => e !== ' ')
      // this.splittedText = Array.from(
      //     {length: splittedText.length / this.chunkSize},
      //     (_, i) => splittedText[]
      // )
    },
    textUpdated(value) {
      this.sourceText = value;
      this.splitText();
    },
    changeSpeed(value){
      this.wordsPerMinute = value;
    },
    resetShow(){
      this.slider.buttonLabel = this.$t('spreeder.startLabel')
      this.slider.isShow = false;
      this.slider.currentIndex = 0;
      this.slider.progress = 0;
    },
    startShow() {
      this.slider.buttonLabel = this.slider.isShow === true ? this.$t('spreeder.startLabel') : this.$t('spreeder.stopLabel')
      this.slider.showCard = true;
      if (this.slider.isShow === true){
        this.slider.isShow = false;
      }
      else {
        this.slider.isShow = true;
        if (this.slider.progress === 100) {
          this.slider.currentIndex = 0;
          this.slider.progress = 0;
        }
        this.displayShow();
      }
    },
    progressUpdate(value){
      this.slider.progress = Number(value.toFixed(0));
    },
    getBoxWidth() {
      return this.slider.boxWidth.toFixed(0) + '%';
    }
  },
  computed: {
    splittedWords() {
      return [...this.slider.currentWord.split(' ')]
    }
  },
  data() {
    return {
      splittedText: [],
      slider: {
        isShow: false,
        buttonLabel: this.$t('spreeder.startLabel'),
        progress: 0,
        currentWord: '',
        currentIndex: 0,
        wordsPerShow: 1,
        fontSize: 150,
        boxWidth: 100,
        showCard: false
      },
      autoplay: {delay: 250, disableOnInteraction: false,},
      speed: computed(() => {
        return 60000 / this.wordsPerMinute
      }),
      sourceText: '',
      cardSize: ref(computed(() => {
        return this.slider.fontSize / 100
      })),
    }
  },
  setup() {
    return {
      wordsPerMinute: ref(120),
      speedValidator: (x) => x > 0,
      chunkSize: ref(1),
      loopPlay: ref(false),
      chunkSizeOptions: Array.from({length: 6}, (value, index) => ({label: (index + 1).toString(), value: (index + 1).toString()})),
    };
  },
}
</script>

<style scoped>

.n-input-number {
  width: 8em;
  display: flex;
}
.n-card.n-card--bordered {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding-top: 1.5em;
}
.n-card.n-card--bordered .n-card__content span{
  font-size: 3em;
  text-align: center;
  /*display: flex;*/
  justify-content: center;
  align-items: center;

}
.n-card__content{
  flex: 1 0 21%;
  margin: 5px;
  height: 100px;
  display: flex;
  align-items: center;
}

.n-card.n-card--bordered .n-card__content{
  padding-top: 0.8em;
}
.n-card.n-card--bordered .n-card__content span{
  font-size: v-bind(cardSize)em;
  display: grid;
  overflow-wrap: normal;
  word-break: normal;
  width: 14.5ch;
}
.centered {
  display: block;
  margin-right: auto;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  align-content: center;
  align-self: center;

}
.slider-card {
  display: block;
  text-align: center;
  padding-top: 1em;
  padding-bottom: 1em;
  align-items: center;
  justify-content: center;
}



</style>