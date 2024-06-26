<template>
<div>
  <n-modal v-model:show="showModal"
           :title="$t('auth.passwordRequired')"
           preset="dialog" @positive-click="submitPassword">
    <n-spin :show="isLoading">
    <n-form :rules="formRules" :model="formContent" ref="formRef">
      <n-form-item path="password"
          :label="$t('auth.passwordLabel')" :error="passwordError ? $t('auth.invalidPassword') : ''">
        <n-input v-model:value="formContent.password" type="password" clearable/>
      </n-form-item>
    </n-form>
      </n-spin>
    <template #action>
      <n-button :disabled="isLoading" @click="submitPassword" type="primary">{{$t('auth.submitForm')}}</n-button>
    </template>
  </n-modal>
  <n-drawer v-model:show="readingMode" placement="top" width="100%" height="100%" @updateShow="toggleReadingMode">
    <n-drawer-content :title="t('common.readingMode')" class="reading-mode" closable @update:show="toggleReadingMode">
        <div v-if="fetchedText && fetchedText.length && ! options.grayScale"
             :class="[{'bg-neutral-200': !options.onlyVerbs && !options.onlyNouns && !isDarkTheme}, 'p-10', 'max-w-2xl', 'mx-auto', 'text-justify']">
          <span v-for="item in fetchedText" :key="item.id" :style="{color: item.color}">{{ item.word + ' ' }}</span>
        </div>
    </n-drawer-content></n-drawer>

    <n-form size="medium">
        <BaseInput :label="$t('textparser.sourceText')" :placeholder='$t("textparser.textPlaceHolder")'
                   v-model:post-body="sourceText" @input-updated="textUpdated($event)">

        </BaseInput>
        <n-space size="medium" class="pb-3">
            <n-card>{{ $t('textparser.totalSymbols')}}
                <n-tag :bordered="false">{{ charsTotal }}</n-tag>
            </n-card>
            <n-card>{{ $t('textparser.withoutSpaces') }}
                <n-tag :bordered="false">{{ charsClean }}</n-tag>
            </n-card>
            <n-card> {{ $t('textparser.cntWords')}}
                <n-tag :bordered="false">{{ cntWords }}</n-tag>
            </n-card>
        </n-space>
      <div class="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-4">
            <BaseButton class="w-1/2 md:w-auto" :label="$t('textparser.countWords')" @button-clicked="countWords()"/>
          <BaseButton class="w-1/2 md:w-auto" :label="$t('textparser.textToSpeech')" @button-clicked="convertToSpeech()"/>
        </div>
        <n-space vertical class="py-2 md:justify-between">
            <BaseCheckbox :label="$t('textparser.onlyNouns')" v-model:value="options.onlyNouns"
                          @nSwitched="radioUpdated('nouns', $event)"/>
            <BaseCheckbox :label="$t('textparser.onlyVerbs')" v-model:value="options.onlyVerbs"
                          @n-switched="radioUpdated('verbs', $event)"/>
            <BaseCheckbox :label="$t('textparser.grayScale')" v-model:gray-scale="options.grayScale"
                          @n-switched="grayUpdated($event)"></BaseCheckbox>
        </n-space>
    </n-form>

  <Playback v-if="audioSource" :audio-blob="audioSource" :key="playBackKey"/>
        <BaseTextBox :label="$t('common.textContent')" ref="textContent" v-if="fetchedText.length || grayedText.length">
            <div v-if="grayedText.length && options.grayScale">
                <span v-for="item in grayedText" :class="item.gray" :key="item.id">{{ item.word + ' ' }}</span>
            </div>
            <div v-if="fetchedText && fetchedText.length && ! options.grayScale"
                 :class="{'bg-neutral-200': !options.onlyVerbs && !options.onlyNouns && !isDarkTheme}">
                <span v-for="item in fetchedText" :key="item.id" :style="{color: item.color}">{{ item.word + ' ' }}</span>
            </div>
        </BaseTextBox>

    <div v-if="countedWords.length" style="padding-top: 2em">
        <n-list hoverable style="padding: 0.8em">
            <n-list-item v-for="word in countedWords">
                <n-card><span>{{ word.word }}</span>
                    <n-tag type="success" style="position: absolute; right: 10px;">{{ word.count }}</n-tag>
                </n-card>
            </n-list-item>
        </n-list>
    </div>
</div>
</template>

<script setup lang="ts">
import {api} from "@/helpers";
import {debounce} from "lodash-es";
import {FormRules, useMessage} from "naive-ui";
import {computed, defineAsyncComponent, Ref, ref} from "vue";
import union from "arr-union";
import {useI18n} from "vue-i18n";
import BaseButton from "@/components/BaseButton.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import BaseTextBox from "@/components/BaseTextBox.vue";
import {useMainStore} from "@/store/main";

const message = useMessage();
const {t} = useI18n();
const store = useMainStore();

const playBackKey = ref(0);
const textContent = ref(null);
const Playback = defineAsyncComponent(() => import('@/components/Playback.vue'));
interface FetchTextItem {
  id: number;
  word: string;
  tag: string;
  color: string;
}
interface GrayedTextItem extends FetchTextItem {
  gray: string;
}
interface CountedWord {
  word: string;
  count: number;
}
const fetchedText: Ref<Array<FetchTextItem>> = ref([]);
const cachedText: Ref<Array<FetchTextItem>> = ref([]);

const countedWords: Ref<Array<CountedWord>> = ref([]);
const showModal = ref(false);
const formContent = ref({
  username: 'default',
  password: ''
});
const formRef = ref(null);
const passwordError = ref(false);
const isLoading = ref(false);

const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
const formRules: FormRules = {
  password: [
    {required: true, message: t('auth.passwordRequired')},
    {
      validator: (rule, value) => {
        if (passwordError.value) {
          return new Error(t('auth.invalidPassword'));
        }
      },
    }
  ]
};
const submitPassword = async () => {
  if (isLoading.value){
    return;
  }
  isLoading.value = true;
    const hashedPassword = await hashPassword(formContent.value.password);
    api.post(
      'text-to-speech/',
      { text: sourceText.value },
      {
        responseType: 'blob',
        headers: { 'Authorization': `Password ${hashedPassword}` }
      }
    ).then(response => {
      playBackKey.value++;
      audioSource.value = response.data;
      showModal.value = false; // Close modal on success
    }).catch(error => {
      if (error.response && error.response.status == 401) {
        passwordError.value = true;
      } else {
        warning(t('common.warnMessage'));
        console.log(error);
      }
    }).finally(() => {
      formRef.value?.validate();
      isLoading.value = false;
    });
};
const convertToSpeech = async () => {
    showModal.value = true;
  formRef.value.password = '';
  passwordError.value = false;
};
const options = ref({
  onlyVerbs: false,
  onlyNouns: false,
  grayScale: false,
});
const grayedText: Ref<Array<GrayedTextItem>> = ref([]);
const audioSource = ref('');
const sourceText = computed({
  get() {
    return store.sourceText;
  },
  set(value) {
    store.updateText(value);
  }
});

const reText = /[A-Za-zА-Яа-я\s]/g;
interface Color {
  [key: string]: string;
}
const adjfColor = '#f4a261';
const colors: Color = {
  'NOUN': '#0000ff',
  'NPRO': '#4B4BF9',  // местоимение-существительное
  'ADJF': adjfColor,  // прилагательные
  'ADJS': adjfColor,  // прилагательное (краткое)
  'VERB': '#009933',
  'INFN': '#009933',
  'PRTF': adjfColor,
  'PRTS': '#C04039',
  'GRND': adjfColor,  // деепричастие
  'ADVB': adjfColor,
  'PRED': '#4D4DFF',
};
const charsTotal = computed(() => {
  let match = sourceText.value.match(reText);
  return match ? match.length : 0;
});

const charsClean = computed(() => {
  let match = sourceText.value.replace(/ /g, '').match(reText);
  return match ? match.length : 0;
});

const warning = (text: string) => {
  message.warning(text);
};
const readingMode = computed(() => {
  return store.readingMode;
});
const toggleReadingMode = () => {
  store.toggleReadingMode();
};
const isDarkTheme = computed(() => {
  return store.theme === 'darkTheme';
});
const assignColor = (word: any) => {
  return colors[word.tag]
};
const textUpdated = (value: string) => {
  sourceText.value = value;
  updateText();
};
const cntWords = computed(() => {
  let cleanedText = sourceText.value.replace(/[^a-zA-Z0-9\sа-яА-ЯёЁ]|_/g, "")
      .replace(/\s+/g, " ").trim();
  if (!cleanedText){
    return 0;
  }
  return cleanedText.split(/\s+/).length
})
const updateText = debounce(async () => {
  const chunkSize = 100;
  fetchedText.value = [];
  let responses = []
  let splittedText = sourceText.value.split(' ')
  for (let i = 0; i < splittedText.length; i += chunkSize) {
    const chunk = splittedText.slice(i, i + chunkSize)
    let response = null
        try {
      response = await api.post('parse/', {text: chunk.join(' ')})
    } catch (error) {
      warning("Что-то пошло не так")
      console.log(error)
      continue
    }
    let j = fetchedText.value.length
    response.data.forEach(function (part, idx, arr) {
      arr[idx]['id'] = j
      j += 1
    })
    fetchedText.value = [...fetchedText.value, ...response.data,]
    fetchedText.value.forEach(word => {
      word.color = assignColor(word)
    })
    if (options.value.onlyVerbs || options.value.onlyVerbs) {
      filterText();
    }
  }
}, 300)

const grayUpdated = (value: boolean) => {
  options.value.grayScale = value;
  let gr_results: GrayedTextItem[] = []
  const TAGS = ['VERB', 'NOUN', 'INF', 'ADJ'];
  var grayText = function (tag: string) {
    if (TAGS.includes(tag)) {
      return 'not-gray'
    }
    return 'grayed'
  }
  if (value === true) {
    gr_results = fetchedText.value.reduce(
        (firstData, item) => {
          // @ts-ignore
          firstData.push({
            ...item, gray: grayText(item.tag)
          })
          return firstData
        }, [])
    grayedText.value = gr_results;
  }
};

const filterText = () => {
  if (options.value.onlyNouns || options.value.onlyVerbs) {
    cachedText.value = fetchedText.value
  }
  if (!options.value.onlyVerbs && !options.value.onlyNouns) {
    fetchedText.value = cachedText.value
    return;
  }
  let nouns: [] = [];
  let verbs: [] = [];
  if (options.value.onlyNouns === true) {
    nouns = fetchedText.value.filter(function (items) {
      return items.tag === 'NOUN'
    });
  }
  if (options.value.onlyVerbs === true) {
    verbs = fetchedText.value.filter(function (item) {
      return item.tag === 'VERB' || item.tag === 'INFN'
    });
  }
  fetchedText.value = union(nouns, verbs)
};
const countWords = () => {
  api.post('count/', {text: sourceText.value}).then(response => {
    countedWords.value = response.data
  }).catch(error => {
    warning(t('common.errorMessage'))
  })
}
const radioUpdated = (type: string, value: boolean) => {
  if (type === 'nouns') {
    options.value.onlyNouns = value;
  }
  if (type === 'verbs') {
    options.value.onlyVerbs = value;
  }
  if (type === 'gray') {
    options.value.grayScale = value
    if (value) {
      grayUpdated(value)
    }
  }

  filterText();
};
const copyText = () => {
  // @ts-ignore
  let blob = textContent.value?.$el;
  if (!blob) {
    return;
  }
  const range = document.createRange();
  range.selectNode(blob);
  window.getSelection()?.removeAllRanges()
  const selection = window.getSelection();
  selection?.addRange(range);
  document.execCommand("copy");
  window.getSelection()?.removeAllRanges()
}
</script>

<style scoped>
p {
    text-align: left;
}

.n-card.n-card--bordered .n-card__content span {
    font-size: 1.2em;
}

/*.n-card > .n-card__content, .n-card > .n-card__footer*/
.grayed {
    color: #E0E0E0;
}

.grayed-dark {
    color: #767676
}

.grayed-copy {
    color: #E0E0E0;
}

.grayed-dark-copy {
    color: #767676
}

.reading-mode {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12pt;
  line-height: 1.4;
}

@media (min-width: 425px) {
  .reading-mode {
    font-size: 14pt;
    line-height: 1.6;
  }
}

/* Ensures text is not too wide for reading */
.reading-mode .max-w-2xl {
  max-width: 40rem; /* Optimal line length for reading */
}
</style>
