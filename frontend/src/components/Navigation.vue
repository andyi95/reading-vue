<template>
  <div class="md:hidden max-w-screen-xl flex flex-wrap mx-auto p-4">
    <n-button @click="show = true">
      <span class="sr-only">Open main menu</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="lu oc se"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path></svg>

    </n-button>

  </div>
  <div class="hidden md:flex" id="navbar-default">
<n-menu v-model:value="activeKey" mode="horizontal" :options="navLinks" style="height: 60px"/>
  </div>
  <n-drawer v-model:show="show" class="md:hidden">
    <n-drawer-content closable>
      <n-menu v-model:value="activeKey" mode="vertical" :options="navLinks" style="height: 100vh"/>
    </n-drawer-content>
  </n-drawer>
</template>

<script>
import {computed, defineComponent, h, ref} from "vue";
import {RouterLink } from 'vue-router';
import {NMenu, NButton, useThemeVars} from 'naive-ui';
import {useStore} from "vuex";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: 'Navigation',
  setup() {
      const { t } = useI18n();
      const store = useStore();
    const windowWidth = ref(window.innerWidth);

    let locale = computed(function (){
          return store.state.locale
      })
    const themeVars = useThemeVars();


    return {
          t,
      windowWidth,
      activeKey: ref(null),
        locale, themeVars, show: ref(false)
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
            {label: () => h(
                NButton,
                  {onClick: () => this.changeTheme()},
                  { default: () => this.$t('nav.theme')}), key: 'themeToggle'},
            {label: () => h(
                NButton,
                  {onClick: () => this.changeLocale()},
                  { default: () => this.locale === 'en' ? 'ru': 'en', key: 'localeToggle'},
              )}
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
  components: {NMenu, NButton}
});
</script>

