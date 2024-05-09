<script setup lang="ts">
import {useThemeVars} from "naive-ui";
import {onMounted} from "vue";

const themeVars = useThemeVars();
</script>

<template>
<div class="flex items-center justify-between">
  <RouterLink :to="{ name: 'About' }"
      class="text-sm text-gray-500 opacity-50 hover:opacity-75 transition-opacity duration-300">{{ $t('nav.about')}}</RouterLink>
  <div class="flex-grow text-center text-sm text-gray-500 opacity-50">
    (C) 2022-2024 text-tools.ru
  </div>
</div>
</template>
