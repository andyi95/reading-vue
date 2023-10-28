<template>
<div>
<n-menu v-model:value="activeKey" mode="horizontal" :options="navLinks" style="height: 60px"/>
<n-button @click="changeTheme">{{ $t('nav.theme') }}</n-button>
    <n-button @click="changeLocale" style="float: right; margin-right: 1.2em">{{locale === 'en' ? 'ru': 'en'}}</n-button>
</div>
</template>

<script>
import {computed, defineComponent, h, ref} from "vue";
import {RouterLink } from 'vue-router';
import {NMenu, NButton} from 'naive-ui';
import {useStore} from "vuex";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: 'Navigation',
  setup() {
      const { t } = useI18n();
      const store = useStore();
      let locale = computed(function (){
          return store.state.locale
      })


    return {
          t,
      activeKey: ref(null),
        locale
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
  components: {NMenu, NButton}
});
</script>

