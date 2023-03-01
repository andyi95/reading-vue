<template>
  <div id="app">
<n-config-provider :theme="theme">
  <n-message-provider>
  <Navigation/>
  </n-message-provider>
  </n-config-provider>
  </div>

</template>

<script>
import Navigation from "@/components/Navigation";
import { darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui';
import {defineComponent, Content, computed, ref} from "vue";
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

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
