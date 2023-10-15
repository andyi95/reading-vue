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
    <BaseButton :label="slider.buttonLabel" @buttonClicked="startShow()"/> <BaseButton :label="$t('spreeder.resetLabel')" @buttonClicked="resetShow()"/>
    </n-space>


<n-form-item style="padding-right: 12em">
  <n-collapse arrow-placement="right">
    <n-collapse-item title="Настройки" name="settings">
      <n-form-item label="Размер текста">
      <n-slider v-model:value="slider.fontSize" :step="1" :min="10" :max="400"/>
      </n-form-item>
      <n-form-item label="Ширина области отображеия">
        <n-slider v-model:value="slider.boxWidth" :step="1" :min="10" :max="150"/>
      </n-form-item>
      <n-form-item label="Слов в показе">
        <n-select v-model:value="chunkSize" :options="chunkSizeOptions"/>
      </n-form-item>
    </n-collapse-item>
  </n-collapse>
</n-form-item>
  </n-form>
    <n-card :bordered="false" :style="`display: flex; flex-wrap: wrap; text-align: center; width: ${getBoxWidth()}; padding-bottom: 5em; padding-top: 5em`" v-show="slider.currentWord">
        <span :style="`font-size: ${cardSize}em`"> {{ slider.currentWord }}</span>
    </n-card>
<!--  </div>-->
  <n-progress type="line" :percentage="slider.progress" indicator-placement="inside" style="max-width: 80%; margin-bottom: 10em; margin-top: 10em;" v-show="slider.progress > 0"/>
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
import {useI18n} from "vue-i18n";

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
      for(let i = this.slider.currentIndex; true; i += chunkSize){
        await this.sleep(this.speed);
        this.slider.currentWord = this.splittedText.slice(i, i + chunkSize).join(' ');
        let progress = i === 0 ? 0 : Math.max(Math.round(i / this.splittedText.length * 100), 1)
        this.progressUpdate(progress);
        // this.slider.progress = Math.trunc(i / this.splittedText.length)
        if (i === this.splittedText.length - 1) i = 0;  // loop show
        if(!this.slider.isShow && i > 1){
          i = 0
          this.slider.currentIndex = i;
          break;
        }
        if(i < this.splittedText.length){
          i = 0
        }
      }
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
      if (this.slider.isShow === true){
        this.slider.isShow = false;
      }
      else {
        this.slider.isShow = true;
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
        buttonLabel: "Начать",
        progress: 0,
        currentWord: '',
        currentIndex: 0,
        wordsPerShow: 1,
        fontSize: 150,
        boxWidth: 100
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
      const { t } = useI18n();
    return {
        t,
      wordsPerMinute: ref(120),
      speedValidator: (x) => x > 0,
      chunkSize: ref(1),
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



</style>