<template>
<div>
<n-menu v-model:value="activeKey" mode="horizontal" :options="navLinks" style="height: 60px"/>
<n-button @click="changeTheme">Сменить тему</n-button>
</div>
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
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'Anticipation'
              },
            },{ default: () => 'Антиципация'}
        ),
    key: 'anticipation'
  },
  // {
  //   label: () =>
  //       h(
  //           RouterLink, {
  //             to: {name: 'About'}
  // }, {default: () => 'О сайте'}
  //       ),
  //   key: 'about'
  // }
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

