<template>

<n-menu v-model:value="activeKey" mode="horizontal" :options="navLinks" />
<n-button @click="changeTheme">Сменить тему</n-button>
        <router-view/>
</template>

<script>
import {defineComponent, h, ref} from "vue";
import {RouterLink } from 'vue-router';
import {NMenu, NButton} from 'naive-ui';
import {useStore} from "vuex";

const navLinks = [
    {
  label: () =>
      h(
          RouterLink,
          {
            to: {
              name: 'TextParser'
            }
          },
          {default: () => 'Цветной текст'}
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
        },{ default: () => 'Спридер'}
    ),
    key: 'spreeder'
  },
  {
    label: 'Что-то будет',
    key: 'hello'
  },
  {
    label: 'О сайте',
    key: 'about'
  }
]

export default defineComponent({
  setup() {
    return {
      activeKey: ref(null),
      navLinks,
    };
  },
  methods: {
    changeTheme(){
      this.$store.commit('switchTheme')
    }
  },
  components: {NMenu, NButton}
});
</script>

