<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {
  ChartBar as TinyChartBar,
  HuiCharts,
  Charts as TinyChart,
  HuiChartsBar,
  } from '@opentiny/vue-huicharts'
import './components/DemoLit'
import { getValue } from '@opentiny/vue-renderless/action-menu/vue'

const options = {
  padding: [50, 30, 50, 20],
  legend: {
    show: true,
    icon: 'line'
  },
  data: [
    { 'Month': 'Jan', 'Domestic': 33, 'Abroad': 1 },
    { 'Month': 'Feb', 'Domestic': 27, 'Abroad': 39 },
    { 'Month': 'Mar', 'Domestic': 31, 'Abroad': 20 },
    { 'Month': 'Apr', 'Domestic': 30, 'Abroad': 15 },
    { 'Month': 'May', 'Domestic': 37, 'Abroad': 1 },
    { 'Month': 'Jun', 'Domestic': 36, 'Abroad': 17 },
    { 'Month': 'Jul', 'Domestic': 42, 'Abroad': 22 },
    { 'Month': 'Aug', 'Domestic': 22, 'Abroad': 12 },
    { 'Month': 'Sep', 'Domestic': 17, 'Abroad': 30 },
    { 'Month': 'Oct', 'Domestic': 40, 'Abroad': 33 },
    { 'Month': 'Nov', 'Domestic': 42, 'Abroad': 22 },
    { 'Month': 'Dec', 'Domestic': 32, 'Abroad': 1 }
  ]
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <lit-element></lit-element>
  <HelloWorld msg="Vite + Vue" />
  <tiny-chart-bar :options="options"></tiny-chart-bar>
  <br>
  <tiny-chart type="bar" :options="options"></tiny-chart>
  <br>
  <hui-charts type="bar" :options="options"></hui-charts>
  <br>
  <hui-charts-bar :options="options"></hui-charts-bar>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
