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


import Navigation from "@/components/Navigation.vue";
import { darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui';
import {defineComponent, computed, ref} from "vue";
import {useStore} from "vuex";
import {useI18n} from "vue-i18n";


export default defineComponent({
  components: {Navigation, NConfigProvider, NMessageProvider, darkTheme},
  setup() {
    const store = useStore();
    const {t} = useI18n();
    const windowWidth = ref(window.innerWidth);

      return {
        darkTheme,
        t,
        windowWidth,
        theme: computed(function (){
          return store.state.theme === 'darkTheme' ? darkTheme : null
        })
      }
    },

  })
</script>

<style lang="css">


@tailwind base;
@tailwind components;
@tailwind utilities;

body, #app, .n-layout-scroll-container, .n-config-provider, .n-layout--static--positioned{
  min-height: 100vh;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  /*height: 100%;*/

}
.n-layout-scroll-container{
  padding-left: .75rem;
  padding-right: .75rem;
  padding-top: .50rem;
  padding-bottom: .25rem;
}
</style>
