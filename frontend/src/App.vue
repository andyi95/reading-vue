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

<style lang="css">
@import "~@/assets/css/bootstrap.min.css";

/** {*/
/*  padding: 0;*/
/*  margin: 0;*/
/*}*/

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
