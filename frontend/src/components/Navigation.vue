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
  </div>
  <n-drawer v-model:show="show" width="50vw"
            class="md:hidden"
            max-width="190px">
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