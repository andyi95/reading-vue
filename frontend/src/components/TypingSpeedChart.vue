<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, ChartData, ChartOptions
} from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const props = defineProps<{keyPressData: Array<{ timestamp: number; isCorrect: boolean} >;}>();


const calculateCPM = (keyPresses: Array<any>) => {
  const startTime = keyPresses[0].timestamp;
  return keyPresses.map((press, index) => {
    const relativeTime = (press.timestamp - startTime) / 1000; // Time in seconds

    // Cumulative count of correct key presses
    const cumulativeCorrect = keyPresses
        .slice(0, index + 1)
        .filter(p => p.isCorrect)
        .length;

    // Calculate CPM (Characters per Minute)
    const cpm = relativeTime > 0 ? (cumulativeCorrect / (relativeTime / 60)) : 0;

    return {
      time: relativeTime, // Time in seconds
      cpm: parseFloat(cpm.toFixed(2)) // Typing speed in CPM, rounded to 2 decimal places
    };
  });
}
const chartData = ref<ChartData<'line', { x: number; y: number }[], unknown>>({
  labels: [],
  datasets: [
    {
      label: 'Typing Speed (CPM)',
      data: [],
      borderColor: 'blue',
      borderWidth: 2,
      fill: false,
      tension: 0.1 // Line smoothness
    }
  ]
});

const updateChartData = (data: Array<{ timestamp: number; isCorrect: boolean }>) => {
  const calculatedData = calculateCPM(data);
  chartData.value = {
    labels: calculatedData.map(item => item.time), // X-axis: time in seconds
    datasets: [
      {
        label: 'Typing Speed (CPM)',
        data: calculatedData.map(item => item.cpm),
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
        tension: 0.1 // Line smoothness
      }
    ]
  };
};
const chartOptions: ChartOptions = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Time (seconds)'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Characters per Minute (CPM)'
      },
      beginAtZero: true
    }
  }
};

// Watch for changes in keyPressData to re-render the chart
watch(() => props.keyPressData, (newData) => {
  updateChartData(newData);
});

// Initial render
onMounted(() => {
  updateChartData(props.keyPressData);
});
</script>

<template>
<div>
  <Line
      :data="chartData" :options="chartOptions" class="h-400 w-400"
      :style="`position: relative;`"
  />
</div>
</template>

<style scoped>

</style>