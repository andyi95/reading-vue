<template>
  <n-space vertical size="medium" justify="space-between">
  <n-form size="medium">
      <BaseInput label="Текст для чтения" placeholder="Вставьте или введите текст для упражнения"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>

    <n-form-item label="слов в минуту" style="padding-right: 30em">
      <n-slider v-model:value="wordsPerMinute" :step="1" :min="100" :max="900" style="padding-right: 4em"/>
    <n-input-number style="width: 6em" v-model:value="wordsPerMinute" @update:value="changeSpeed" :validator="speedValidator" placeholder="слов в минуту"/>
    </n-form-item>

    <BaseButton :label="slider.buttonLabel" @buttonClicked="startShow()"/>

  </n-form>

    <n-card>{{slider.currentWord}}</n-card>

<!--    <swiper :space-between="30"-->
<!--            :loop="false"-->
<!--            :autoplay="{-->
<!--      delay: speed,-->
<!--      disableOnInteraction: false,-->
<!--    }"-->
<!--            :effect="'fade'"-->
<!--        :modules="modules" @progress="progressUpdate" @swiper="getSwiperRef">-->
<!--      <swiper-slide v-for="word in splittedText">-->
<!--        <n-card size="large" content-style="font-size: 6em;">-->
<!--        {{ word }}-->
<!--        </n-card>-->
<!--      </swiper-slide>-->
<!--    </swiper>-->

    <n-progress v-if="slider.progress > 0" type="line" :percentage="slider.progress" indicator-placement="inside" processing style="max-width: 80%"/>

  </n-space>

</template>

<script>
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import {NInputGroup, NSpace, NCard, NInputNumber, NProgress, NForm, NGrid, NGridItem, NSlider} from "naive-ui";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-fade';
import {ref, computed} from "vue";
import {mapState} from "vuex";

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
        this.slider.currentWord = this.splittedText[i]
        if (i === this.splittedText.length - 1) i = 0;  // loop show
        if(!this.slider.isShow){
          this.slider.currentIndex = i;
          break;
        }
      }
    },
    splitText() {
      this.splittedText = this.sourceText.split(' ');
    },
    textUpdated(value) {
      this.sourceText = value;

    },
    changeSpeed(value){
      this.wordsPerMinute = value;
    },
    startShow() {
      this.splitText();
      this.slider.isShow = this.slider.isShow === false;
      this.slider.buttonLabel = this.slider.isShow === true ? "Стоп" : "Старт"
      this.displayShow();
    },
    progressUpdate(value){
      this.slider.progress = value.progress.toFixed(0) * 100;
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
    return {
      wordsPerMinute: ref(120),
      speedValidator: (x) => x > 0
    };
  },
}
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
  padding-top: 1.5em;
}

.swiper-slide {
  text-align: center;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}
.n-card .n-card-bordered{
  font-size: 1.5em;
}

.swiper-slide img {
  display: block;
  width: 100%;
}


</style>