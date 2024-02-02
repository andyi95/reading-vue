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
import {useHead, useSeoMeta} from "@unhead/vue";
import {useRoute} from "vue-router";

const shakeThreshold = 25; // Define a suitable threshold for shake detection
let lastAcceleration = { x: null, y: null, z: null };
const handleShake = (event) => {
  const acceleration = event.accelerationIncludingGravity;

  if (!lastAcceleration.x) {
    lastAcceleration = { ...acceleration };
    return;
  }

  let shakeDetected = false;
  const deltaX = Math.abs(lastAcceleration.x - acceleration.x);
  const deltaY = Math.abs(lastAcceleration.y - acceleration.y);
  const deltaZ = Math.abs(lastAcceleration.z - acceleration.z);

  if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
    shakeDetected = true;
  }

  lastAcceleration = { ...acceleration };

  if (shakeDetected) {
    console.log('Shake detected!');
    window.alert('Shake detected!');
  }
};
export default defineComponent({
  components: {Navigation, NConfigProvider, NMessageProvider, darkTheme},
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const windowWidth = ref(window.innerWidth);
    const windowHeight = ref(window.innerHeight);
    const route = useRoute();
    useSeoMeta({
      title: computed(() => t('common.metaTitle')),
      description: computed(() => t('common.metaDescription')),
      keywords: computed(() => t('common.metaTags')),
    })
    useHead({
      title: computed(() => t('common.metaTitle')),
      link: [
        {
          rel: 'canonical',
          href: 'https://reader.dev.andyi95.com/' + route.path
        }
      ],
      meta: [
        {
          name: 'description',
          content: computed(() => t('common.metaDescription')),
        },
        {
          name: 'keywords',
          content: computed(() => t('common.metaTags'))
        }
      ]

    })

      return {
        darkTheme,
        t,
        windowWidth, windowHeight,
        theme: computed(function (){
          return store.state.theme === 'darkTheme' ? darkTheme : null
        })
      }
    },
  mounted(){
    console.log(process.env.VITE_GTAG_ID)
    window.addEventListener('devicemotion', handleShake, false);
  },
  unmounted(){
    window.removeEventListener('devicemotion', handleShake, false);
  }

  })
</script>

<style lang="postcss">
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
