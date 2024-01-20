<template>
  <div class="flex relative md:hidden max-w-screen-xl">
      <n-button
          @click="show = true" class="content-end justify-end fixed z-10 end-5"
          :bordered="false" aria-label="Open main menu">
        <span class="sr-only">Open main menu</span>
        <div class="burger-menu">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0,0,256,256">
            <g fill="#63e2b7" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M2,9v2h46v-2zM2,24v2h46v-2zM2,39v2h46v-2z"></path></g></g>
          </svg></div>
      </n-button>
  </div>

  <div class="hidden md:flex" id="navbar-default">
<n-menu v-model:value="activeKey" mode="horizontal" :options="navLinks" style="height: 60px"/>
    <div class="ml-auto flex items-center space-x-4">
      <n-icon @click="changeTheme" size="30">
        <Moon v-if="!isDarkTheme" ></Moon>
        <Sunny v-else></Sunny>
      </n-icon>
      <n-button @click="changeLocale">
        {{locale === 'en' ? 'ru': 'en'}}
        </n-button>
    </div>
  </div>
  <n-drawer v-model:show="show" width="50vw"
            class="md:hidden"
            :max-width="190">
    <n-drawer-content closable>
      <n-menu v-model:value="activeKey" mode="vertical" :options="navLinks" style="height: 70vh"/>

      <!-- Theme and Locale Toggles for Mobile -->
      <div class="flex justify-center mt-2 space-x-2">
        <n-icon @click="changeTheme" size="30">
          <Moon v-if="!isDarkTheme"></Moon>
          <Sunny v-else></Sunny>
        </n-icon>
        <n-button @click="changeLocale">
          {{locale === 'en' ? 'ru': 'en'}}
        </n-button>
      </div>

    </n-drawer-content>
  </n-drawer>
</template>

<script>
import {computed, defineComponent, h, ref} from "vue";
import {RouterLink } from 'vue-router';
import {NMenu, NButton, NIcon, useThemeVars} from 'naive-ui';
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {Moon, Sunny} from "@vicons/ionicons5";

export default defineComponent({
  name: 'Navigation',
  setup() {
      const { t } = useI18n();
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const activeKey = computed(() => {
        return route.name?.toLowerCase() || 'textparser'
      });
    const windowWidth = ref(window.innerWidth);

    let locale = computed(function (){
          return store.state.locale
      })
    const themeVars = useThemeVars();
    const isDarkTheme = computed(function (){
              return store.state.theme === 'darkTheme'
          })

    return {
          t,
      windowWidth,
      activeKey,
        locale, themeVars, show: ref(false),
      isDarkTheme
    };
  },
    data(){
      return {
          navLinks: [
              {
                  label: () =>
                      h(
                          RouterLink,
                          {
                              to: {
                                  name: 'TextParser'
                              }
                          },
                          {default: () => this.$t('nav.textparser')}
                      ),
                  key: 'text'
              },
              {
                  label: () =>
                      h(
                          RouterLink,
                          {
                              to: {
                                  name: 'Spreeder'
                              },
                          },{ default: () => this.$t('nav.spreeder')}
                      ),
                  key: 'spreeder'
              },
              {
                  label: () =>
                      h(
                          RouterLink,
                          {
                              to: {
                                  name: 'Anticipation'
                              },
                          },{ default: () => this.$t('nav.anticipation')}
                      ),
                  key: 'anticipation'
              },
              {
                  label: () =>
                      h(
                          RouterLink,
                          {
                              to: {
                                  name: 'Mixer'
                              },
                          },{ default: () => this.$t('nav.mixer')}
                      ),
                  key: 'mixer'
              },
            {
              label: () =>
                  h(RouterLink, {to: {name: 'Schulte'}}, {default: () => this.$t('nav.schulte')}),
              key: 'schulte'
            },
            {
              label: () =>
                  h(RouterLink, {to: {name: 'Voice'}}, {default: () => this.$t('nav.voice')}),
              key: 'voice'
            }
          ]
      }
    },
  methods: {
    changeTheme(){
      this.$store.commit('SWITCH_THEME')
        this.$i18n.locale = this.locale
    },
      changeLocale(){
        this.$store.commit('SWITCH_LOCALE')
          this.$i18n.locale = this.locale
      }
  },
  components: {NMenu, NButton, Sunny, Moon}
});
</script>

<style>
.burger-menu {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  overflow: hidden;
}
.n-drawer .n-drawer-content .n-drawer-body-content-wrapper {
  padding: 0;
}

</style>
