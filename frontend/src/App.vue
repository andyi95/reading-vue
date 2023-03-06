<template>
  <div id="app">
<n-config-provider :theme="theme">
  <n-message-provider>
    <n-layout>
          <Navigation/>
        <n-layout-content >
    <router-view/>
        </n-layout-content>
    </n-layout>
  </n-message-provider>
  </n-config-provider>
  </div>

</template>

<script>
import Navigation from "@/components/Navigation";
import { darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui';
import {defineComponent, computed} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  components: {Navigation, NConfigProvider, NMessageProvider, darkTheme},
  setup() {
    const store = useStore();

      return {
        darkTheme,
        // theme: store.state.theme
        theme: computed(function (){
          return store.state.theme === 'darkTheme' ? darkTheme : null
        })
      }
    }
  })
</script>

<style lang="scss">
@import '~@/assets/scss/index.free.scss';

.bg, .n-config-provider, html, body, .n-layout.n-layout--static-positioned {
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  height: 100%;
}
//.n-layout--static-positioned {
//  height: 100%;
//}
</style>
