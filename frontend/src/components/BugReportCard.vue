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
  route: route,
  router: router
})
const formRef = ref<FormInst | null>(null)
const instance = getCurrentInstance();
const parentEl = useParentElement();
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let osName = 'Unknown';
  let osVersion = 'Unknown';

  if (/Chrome/.test(ua)) browserName = 'Chrome';
  else if (/Firefox/.test(ua)) browserName = 'Firefox';
  else if (/Safari/.test(ua)) browserName = 'Safari';
  else if (/MSIE|Trident/.test(ua)) browserName = 'Internet Explorer';

  if (/Windows/.test(ua)) osName = 'Windows';
  else if (/Mac OS/.test(ua)) osName = 'Mac OS';
  else if (/Linux/.test(ua)) osName = 'Linux';

  const osRegex = /Windows NT|Mac OS X|Linux/;
  const match = ua.match(osRegex);
  if (match) osVersion = match[0];

  return { browserName, osName, osVersion };
};
const getIpAddress = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
};

const submitReport = async () => {
  // Collect data from the current route component
  const matchedComponents = router.currentRoute.value.matched.flatMap(record => Object.values(record.components));
  const instance = getCurrentInstance();
  if (instance) {
    const data = { ...instance.proxy.$data, ...instance.proxy.$props };
    comp_store.registerComponentData(instance.type.name || 'unknown', data);
  }

  const canvas = await html2canvas(document.body)
  const screenshot = canvas.toDataURL('image/png')
  const {browserName, osName, osVersion } = getBrowserInfo();
  const ipAddress = await getIpAddress();
  const reportData = {
    ...formContent.value,
    interactions: comp_store.interactions,
    componentsData: comp_store.componentsData,
    ipAddress: ipAddress,
    browserInfo: getBrowserInfo(),
    screenshot
  };
  const data = {
    title: formContent.value.subject,
    description: formContent.value.message,
    context: JSON.stringify(reportData),
    ip_address: ipAddress
  }
  const response = await api.post('/api/reports/send/', data)
  console.log('test')
  store.toggleBugReport();
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