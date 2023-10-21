<script>
import {defineComponent, ref} from "vue";
import {NH3} from 'naive-ui';
export default defineComponent(
    {
      name: "Timer",
      components: {NH3},
      props:{
        timerEnabled: {
          type: Boolean,
          default: false
        },
        resetTimer: {
          type: Boolean,
          default: false
        }
      },
      watch:{
        resetTimer(value){
          if (value) {
            this.reset();
          }
        },
        timerEnabled(value){
          if (value) {
            this.timer = setInterval(() => {
              this.timerCount++;
            }, 1000);
          } else {
            clearInterval(this.timer);
          }
        }
      },
      methods:{
        play() {
          this.timerEnabled = !this.timerEnabled;
        },
        reset(){
          this.timerCount = 0;
          this.resetTimer = false
        }
      },
        setup() {
            const timerCount = ref(0);
            const timer = setInterval(() => {
                timerCount.value++;
            }, 1000);
            return {
                timerCount,
                timer
            }
        }
    }
)


</script>

<template>
<n-h3> {{ timerCount }}</n-h3>
</template>

<style scoped>

</style>