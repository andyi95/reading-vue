<template>
<n-button v-slot="{href, havigate}" :to="link" custom>
  <slot>

  </slot>
</n-button>
</template>

<script>
import {defineComponent} from "vue";
import {NButton} from "naive-ui";
export default defineComponent({
  name: "ButtonLink",
  components: {
    NButton
  },
  props: {
    to: {
      type: String,
      default: ''
    }
  },
  setup(props){
    return {
      link: props.to
    };
  }
});
</script>
