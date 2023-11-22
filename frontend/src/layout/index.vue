<template>
<div>
  <n-layout wh-full>
    <article flex-1 flex-col overflow-hidden>
      <header
          class="bg-white px-15 border-b bc-eee flex items-center"
           style="height: 60px">
        <Navigation/>
      </header>
      <n-layout-content content-style="flex-1 overflow-hidden px-3">
        <slot/>
      </n-layout-content>
    </article>
  </n-layout>
</div>
</template>

<script>
import {NLayoutContent, NLayout, NLayoutHeader} from "naive-ui";
import Navigation from "@/App.vue";

export default {
  name: "DefaultLayout",
  components: {Navigation, NLayoutContent, NLayout, NLayoutHeader }
}
</script>

<style>
body, #app {
  overflow: auto;
}
</style>