<template>
<Navigation/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}



</style>
<script>
import {ref} from 'vue';
import {accountService} from "@/helpers";
import Navigation from "@/components/Navigation";
export default {
  components: {Navigation},
  setup() {
        const account = ref(null);
        accountService.account.subscribe(x => account.value = x);

        return {
            account,
            logout: accountService.logout
        }
    }
}
</script>