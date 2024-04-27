<template>
<div>
  <n-layout wh-full>
    <article flex-1 flex-col overflow-hidden>
      <header
          class="bg-white px-15 border-b bc-eee flex items-center"
           style="height: 60px">
        <Navigation/>
      </header>
      <n-layout-content>
        <slot/>
      </n-layout-content>
    </article>
  </n-layout>
</div>
</template>

<script>
import {NLayoutContent, NLayout, NLayoutHeader, useMessage} from "naive-ui";
import Navigation from "@/App.vue";
import {api} from "@/helpers";

export default {
  name: "DefaultLayout",
  components: {Navigation, NLayoutContent, NLayout, NLayoutHeader },
  setup() {
    window.$message = useMessage();
    api.interceptors.response.use(
        response => response,
        error => {
          const status = error.response ? error.response.status : null;
          if (status === 401) {
            window.$message.error('Unauthorized');
          }
          else {
            window.$message.warning('Something went wrong');
          }
          return Promise.reject(error);
        }
    )
  }
}
</script>

<style>
body, #app {
  overflow: auto;
}
</style>