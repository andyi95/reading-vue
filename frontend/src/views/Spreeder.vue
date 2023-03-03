<template>
  <n-space vertical size="medium" justify="space-between">
  <n-form size="medium">
      <n-form-item label-align="center">
      <BaseInput label="Текст для чтения" placeholder="Вставьте или введите текст для упражнения"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>
      </n-form-item>


    <n-input-number v-model:value="wordsPerMinute" @update:value="changeSpeed" :validator="speedValidator" placeholder="слов в минуту"/>
    <BaseButton :label="slider.buttonLabel" @buttonClicked="startShow()"/>

  </n-form>

    <n-progress type="line" :percentage="slider.progress" indicator-placement="inside" processing style="max-width: 80%"/>

    <swiper :space-between="30"
            :loop="false"
            :autoplay="{
      delay: speed,
      disableOnInteraction: false,
    }"
            :effect="'fade'"
        :modules="modules" @progress="progressUpdate" @swiper="getSwiperRef">
      <swiper-slide v-for="word in splittedText">
        <n-card size="large" content-style="font-size: 1.5em;">
        {{ word }}
        </n-card>
      </swiper-slide>
    </swiper>

  </n-space>

</template>

<script>
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import {NInputGroup, NSpace, NCard, NInputNumber, NProgress, NForm, NGrid, NGridItem} from "naive-ui";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-fade';
import {Autoplay, Pagination, Navigation, EffectFade, EffectCards} from "swiper";
import {Swiper, SwiperSlide, useSwiper} from "swiper/vue";
import {ref, computed} from "vue";
import {mapState} from "vuex";

export default {
  name: "Spreeder",
  components: {BaseButton, BaseInput, NInputGroup, NSpace, NCard, Swiper, SwiperSlide, NInputNumber, NProgress, NGrid, NGridItem, NForm},

  methods: {
    splitText() {
      this.splittedText = this.sourceText.split(' ');
    },
    textUpdated(value) {
      this.sourceText = value;

    },
    changeSpeed(value){
      this.wordsPerMinute = value;
      this.swiper.autoplay.delay = this.speed;
    },
    startShow() {
      this.splitText();
      this.slider.isShow = this.slider.isShow === false;
      this.slider.buttonLabel = this.slider.isShow === true ? "Стоп" : "Старт"
      if (this.slider.isShow === false){
        this.swiper.autoplay.paused = true;
        this.swiper.autoplay.running = false;
      }
      else {
        this.swiper.autoplay.paused = false;
        this.swiper.autoplay.running = true;
        this.swiper.autoplay.start()
      }
      // else{
      //   this.swiper.autoplay.resume();
      // }
    },
    progressUpdate(value){
      this.slider.progress = value.progress.toFixed(2) * 100;
    }
  },
  data() {
    return {
      splittedText: [],
      slider: {
        isShow: false,
        buttonLabel: "Начать",
        progress: 0,

      },
      autoplay: {delay: 250, disableOnInteraction: false,},

      speed: computed(() => {
        return 60 * 1000 / this.wordsPerMinute
      }),
      sourceText: ''

    }
  },
  setup() {
    const swiper = ref(null);
    function getSwiperRef(swiperInstance) {
      swiper.value = swiperInstance
    }
    return {
      wordsPerMinute: ref(120),
      speedValidator: (x) => x > 0,
      modules: [Autoplay, Navigation, Pagination, EffectFade],
      swiper,
      getSwiperRef
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