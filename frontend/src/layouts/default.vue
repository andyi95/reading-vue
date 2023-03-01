<template>
<div>
  <n-layout position="absolute">
    <n-layout-header bordered position="absolute" class="h-[50px] flex align-items-center">
                      <div class="flex flex-1 mx-3">
                    <div class="flex items-center">
                      <ButtonLink to="/">
                                                    <div class="flex text-left">
                                <div class="text-3xl font-extrabold tracking-widest inline m-0">
                                  Тесто
                                </div>
                                                    </div>
                      </ButtonLink>
                    </div>
                      </div></n-layout-header>
<n-layout-content>
  <div class="px-5 pt-5 pb-14">
    <slot/>
  </div>
</n-layout-content>
  </n-layout>
</div>
</template>

<script>
import ButtonLink from "@/components/ButtonLink";
import {NLayoutContent, NLayout, NLayoutHeader} from "naive-ui";

export default {
  name: "DefaultLayout",
  components: {ButtonLink, NLayoutContent, NLayout, NLayoutHeader }
}
</script>
