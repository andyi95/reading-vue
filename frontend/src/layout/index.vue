<template>
<div>
  <n-layout wh-full has-sider sider-placement="left">
    <n-layout-sider collapse-mode="width"
                    :collapsed-width="64"
                    :width="200">
        <Navigation/>
    </n-layout-sider>
      <n-layout-content>
        <slot/>
      </n-layout-content>
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