<script setup lang="ts">
import {ref, computed, onMounted, getCurrentInstance} from 'vue';
import {FormInst} from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {useParentElement} from "@vueuse/core";
import {useMainStore} from "@/store/main";
import {useComponentStore} from "@/store/componentStore";
import html2canvas from "html2canvas";
import {api} from "@/helpers";

const store = useMainStore();
const comp_store = useComponentStore();
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
})
const formRef = ref<FormInst | null>(null)
const getIpAddress = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
};

const submitReport = async () => {
  // Collect data from the current route component
  const instance = getCurrentInstance();
  if (instance) {
    const data = { ...instance?.proxy?.$data, ...instance?.proxy?.$props };
    comp_store.registerComponentData(instance.type.name || 'unknown', data);
  }

  const canvas = await html2canvas(document.body)
  const screenshot = canvas.toDataURL('image/png')
  const ipAddress = await getIpAddress();
  const reportData = {
    ...formContent.value,
    interactions: comp_store.interactions,
    componentsData: comp_store.componentsData,
    ipAddress: ipAddress,
    browserInfo: navigator.userAgent,
    route: route.fullPath,
  };
  const formData = new FormData();
  formData.append('title', formContent.value.subject)
  formData.append('description', formContent.value.message)
  formData.append('context', JSON.stringify(reportData))
  formData.append('screenshot', screenshot)
  try {
    const response = await api.post('api/reports/send/', formData, {headers: {'Content-Type': 'multipart/form-data'}})
  }
  catch (e) {
    console.warn(e)
  }
  store.toggleBugReport();
}

onMounted(() => {

})


</script>

<template>
  <transition name="slide-up" class="transition delay-150 duration-">
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

  transition: all 2s ease;
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