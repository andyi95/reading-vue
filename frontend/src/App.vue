<template>
  <div id="app">
<n-config-provider :theme="theme">
  <n-message-provider>
    <n-layout wh-full>
      <article flex-1 flex-col overflow-hidden>
        <header
            class="bg-white px-15 border-b bc-eee flex items-center"
            style="height: 60px">
          <Navigation/>
        </header>
        <n-layout-content class="flex-1 overflow-hidden px-3">
    <router-view/>
        </n-layout-content>
      </article>
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

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
