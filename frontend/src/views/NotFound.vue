<template>
<n-result status="404" :title="$t('nav.notFoundTitle')" :description="$t('nav.notFoundMessage')">
  <template #footer>
    <n-button type="primary" @click="() => $router.push('/')">
      {{ $t('nav.backHome') }}
    </n-button>
  </template>
</n-result>
</template>

<script setup lang="ts">
</script>
<style scoped>

</style>