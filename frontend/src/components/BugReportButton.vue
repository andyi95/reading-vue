<script setup lang="ts">
import {BugOutline} from "@vicons/ionicons5";
import {useMainStore} from "@/store/main";

const store = useMainStore();
</script>

<template>
<div class="bug-report-button">
  <n-button circle @click="store.toggleBugReport()">
    <n-icon size="20">
      <BugOutline />
    </n-icon>
  </n-button>
</div>
</template>

<style scoped>
.bug-report-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
}
</style>