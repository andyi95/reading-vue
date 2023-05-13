<template>
  <n-space vertical size="medium" justify="space-between">
  <n-form size="medium">
      <BaseInput :label="$t('spreeder.sourceText')" :placeholder="$t('spreeder.textPlaceHolder')"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>

    <n-form-item :label="$t('spreeder.wordsPerMinute')">
      <n-slider v-model:value="wordsPerMinute" :step="1" :min="100" :max="900" style="padding-right: 4em"/>
    <n-input-number v-model:value="wordsPerMinute" @update:value="changeSpeed" :validator="speedValidator" :placeholder="$t('spreeder.wordsPerMinute')"/>
    </n-form-item>

    <BaseButton :label="slider.buttonLabel" @buttonClicked="startShow()"/> <BaseButton :label="$t('spreeder.resetLabel')" @buttonClicked="resetShow()"/>

  </n-form>

    <n-card style="text-align: center" v-show="slider.currentWord"><span>{{slider.currentWord}}</span></n-card>
    <n-progress type="line" :percentage="slider.progress" indicator-placement="inside" style="max-width: 80%" v-show="slider.progress > 0"/>

  </n-space>

</template>

<script>
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import {NInputGroup, NSpace, NCard, NInputNumber, NProgress, NForm, NGrid, NGridItem, NSlider} from "naive-ui";
import {ref, computed} from "vue";
import {useI18n} from "vue-i18n";

export default {
  name: "Spreeder",
  components: {BaseButton, BaseInput, NInputGroup, NSpace, NCard, NInputNumber, NProgress, NGrid, NGridItem, NForm, NSlider},

  methods: {
    sleep(milliseconds){
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
    async displayShow(){
      for(let i = this.slider.currentIndex; i < this.splittedText.length; i++){
        await this.sleep(this.speed);
        this.slider.currentWord = this.splittedText[i];
        let progress = i === 0 ? 0 : Math.max(Math.round(i / this.splittedText.length * 100) / 100, 1)
        this.progressUpdate(progress);
        // this.slider.progress = Math.trunc(i / this.splittedText.length)
        if (i === this.splittedText.length - 1) i = 0;  // loop show
        if(!this.slider.isShow && i > 1){
          this.slider.currentIndex = i;
          console.log(this.slider)
          break;
        }
      }
    },
    splitText() {
      this.splittedText = this.sourceText.split(' ');
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
      this.slider.progress = value.toFixed(0);
    },
    track(){
      this.$gtag.pageview({page_path: '/spreeder'})
    },
  },
  data() {
    return {
      splittedText: [],
      slider: {
        isShow: false,
        buttonLabel: "Начать",
        progress: 0,
        currentWord: '',
        currentIndex: 0
      },
      autoplay: {delay: 250, disableOnInteraction: false,},


      speed: computed(() => {
        return 60000 / this.wordsPerMinute
      }),
      sourceText: ''

    }
  },
  setup() {
      const { t } = useI18n();
    return {
        t,
      wordsPerMinute: ref(120),
      speedValidator: (x) => x > 0
    };
  },
}
</script>

<style scoped>
.n-input-number {
  width: 8em;
  display: flex;
}
.n-card.n-card--bordered .n-card__content{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1.5em;
}
.n-card.n-card--bordered .n-card__content span{
  font-size: 1.5em;
  text-align: center;
  /*display: flex;*/
  justify-content: center;
  align-items: center;

}



</style>