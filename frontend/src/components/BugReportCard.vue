<script setup lang="ts">
import {ref, computed, onMounted, getCurrentInstance} from 'vue';
import {FormInst} from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {useParentElement} from "@vueuse/core";
import {useMainStore} from "@/store/main";

const store = useMainStore();
const route = useRoute();
const router = useRouter();
const showPopup = computed({
  get() {
    return store.showReportCard
  },
  set(){store.toggleBugReport()}
});
const formContent = ref({
  subject: '',
  message: '',
  route: route,
  router: router
})
const formRef = ref<FormInst | null>(null)
const instance = getCurrentInstance();
const parentEl = useParentElement();
const submitReport = () => {
  console.log('Bug report: ', formContent.value);
  console.log(instance.props);
  console.log(instance.ctx);
  console.log(instance.proxy);
  console.log('test')
  store.dispatch('toggleBugReport')
}

onMounted(() => {

})


</script>

<template>
  <transition name="slide-up">
    <div>
<n-modal v-model:show="showPopup">
  <n-card
      :title="$t('bugReport.title')"
      aria-modal="true" role="dialog"
      class="w-80 fixed right-5 bottom-20 md:w-1/3 md:right-0.5">
    <n-form ref="formRef" :model="formContent">
      <n-form-item label="Subject" path="subject" v-show="false">
        <n-input v-model:value="formContent.subject"/>
      </n-form-item>
      <n-form-item :label="$t('bugReport.message')" path="message">
        <n-input type="textarea" v-model:value="formContent.message" placeholder=""/>
      </n-form-item>
      <n-form-item>
        <n-button @click="submitReport">{{ $t('bugReport.submit')}}</n-button>
      </n-form-item>
    </n-form>
  </n-card>
</n-modal></div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.7s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

.slide-up-leave,
.slide-up-enter-to {
  transform: translateY(0);
}
</style>