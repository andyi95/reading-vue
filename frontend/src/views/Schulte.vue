<script>
import {NGi, NGrid, NGridItem} from 'naive-ui';


export default {
  name: 'Schulte',
  components: {NGrid, NGi, NGridItem},
  data() {
    return {
      isPlaying: false,
      size: 5,
      gridData: [],
      shuffledGrid: [],
      startTime: null,
      endTime: null,
      reset: false,
      currentRate: 0,
      currentItem: null
    }
  },
  methods: {
    shuffle() {
      this.generateGorbovData()
      this.shuffledGrid = [...this.gridData].sort(() => Math.random() - 0.5)
    },
    generateGorbovData(){
      let idxB = 0;
      let idxR = Math.floor(this.size ** 2 / 2) + 1;
      for (let i = 1; i <= this.size ** 2; i++){
        if (i % 2 === 0){
          idxR --;
          this.gridData[i - 1] = {
            type: 'red',
            value: idxR.toString()
          }
        }
        else {
          idxB ++;
          this.gridData[i - 1] = {
            type: 'black',
            value: idxB.toString()
          }
        }
      }
    }

  },
  mounted() {
    this.shuffle()
    this.reset = !this.reset
  }
}


</script>

<template>
  <n-grid :cols="5" :x-gap="5" :y-gap="5" class="square-container">
  <n-grid-item v-for="(item, index) in this.gridData" :key="index" class="square" :style="{background: item.type}">
    <div class="content">{{ item.value }}</div>
  </n-grid-item>
  </n-grid>
</template>

<style scoped>
.square-container {
  display: flex;
  flex-wrap: wrap;
  height: 80%;
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
}
.square .content {
  position: absolute;
  top: 0;
  bottom: 0;
  justify-content: center;
  display: flex;
  align-content: center;
  align-items: center;
  color: white;
}
</style>