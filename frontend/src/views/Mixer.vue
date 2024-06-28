<template>
  <div>
    <n-drawer v-model:show="readingMode" placement="top" width="100%" height="100%" @updateShow="toggleReadingMode">
      <n-drawer-content :title="$t('common.readingMode')" class="reading-mode" closable @update:show="toggleReadingMode">
        <div v-if="convertedText" class="p-10 max-w-2xl mx-auto text-justify">
          {{ convertedText }}
        </div>
      </n-drawer-content>
    </n-drawer>
  <n-space vertical size="medium" justify="space-between">
    <n-form size="medium">
      <BaseInput :label="$t('common.sourceText')" :placeholder="$t('common.textPlaceHolder')"
                 v-model:post-body="postBody" @input-updated="textUpdated($event)"/>
      <div class="py-5 w-1/3">
        <n-form-item :label="$t('chaos.mode')">
          <n-select v-model:value="cipherMode"
                    :options="cipherModeOptions"
                    @update:value="modeChanged"
          />
        </n-form-item>
        <n-form-item :label="$t('common.fontSize')">
          <FontSizeSelect
              :value="fontSize" @update:value="handleFontSizeChange"/>
        </n-form-item>
      </div>
    </n-form>
    <BaseTextBox
        ref="textContent" v-if="convertedText && convertedText.length > 1"
        :style="{fontSize: fontSize + 'pt'}"
    >
      <span>{{ convertedText }}</span>
    </BaseTextBox>

  </n-space>
  </div>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {NFormItem, NSelect, useMessage} from "naive-ui";
import TextParser from "@/helpers/parser";
import {api} from "@/helpers";
import {computed, ref} from "vue";
import {debounce} from "lodash-es";
import BaseTextBox from "@/components/BaseTextBox.vue";
import FontSizeSelect from "@/components/FontSizeSelect.vue";
import {useMainStore} from "@/store/main";

export default {
  name: "Mixer",
  components: {FontSizeSelect, BaseTextBox, NFormItem, NSelect, BaseButton, BaseInput},
  setup() {
    const message = useMessage();
    const textContent = ref(null);
    const store = useMainStore();
    const readingMode = computed(() => {
      return store.readingMode;
    });
    const toggleReadingMode = () => {
      store.toggleReadingMode();
    };
    return {
      warning(text = '') {
        message.warning(this.$t('common.warning'))
      },
      textContent,
      store,
      readingMode, toggleReadingMode
    }
  },
  computed: {
    fontSize(){
      return this.store.mixerSettings.fontSize
    },

    cipherModeOptions() {
      return [
        {label: this.$t('chaos.shuffleLetters'), value: 'chaosLetters'},
        {label: this.$t('chaos.reverseWords'), value: 'reverseWords'},
        {label: this.$t('chaos.seamlessText'), value: 'seamlessText'},
        {label: this.$t('chaos.replaceLetters'), value: 'replaceLetters'},
        {label: this.$t('chaos.normalForm'), value: 'normalForm'},
      ]
    },
    fontSizeCSS() {
      return this.fontSize + 'pt'
    }
  },
  data() {
    return {
      postBody: '',
      convertedText: '',
      cipherMode: 'chaosLetters'
    }
  },
  methods: {
    handleFontSizeChange(newFontSize) {
      this.store.updateFontSize(
        'mixerSettings',
        newFontSize
      )},
    textUpdated(value) {
      this.postBody = value;
      this.modeChanged()
    },
    copyText() {
      let textToCopy = this.$refs.textContent;
      let blob = textToCopy.$el;
      const range = document.createRange();
      range.selectNode(blob);
      window.getSelection().removeAllRanges()
      const selection = window.getSelection();
      selection.addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges()
    },
    async fetchText() {
      try {
        const response = await api.post('/parse/', {text: this.postBody})
        this.convertedText = response.data.sort(
            (a, b) => a.id - b.id).map(
            item => item.normal_form ? item.normal_form : item.word).join(' ')
      } catch (e) {
        this.warning()
        console.log(e)
      }
    },
    async modeChanged(value) {
      if (!this.postBody) {
        return
      }
      const parser = new TextParser(this.postBody)
      if (this.cipherMode === 'chaosLetters') {
        this.convertedText = parser.shuffleText()
      }
      if (this.cipherMode === 'replaceLetters') {
        this.convertedText = parser.replaceLetters()
      }
      if (this.cipherMode === 'seamlessText') {
        this.convertedText = parser.seamlessText()
      }
      if (this.cipherMode === 'reverseWords') {
        this.convertedText = parser.reverseWords()
      }
      const debouncedFetchText = debounce(async () => {
        await this.fetchText()
      }, 300)
      if (this.cipherMode === 'normalForm') {
        debouncedFetchText()
      }
    },
  }
}
</script>

<style scoped>
.n-card {
  margin-top: 1.5em;
}

.n-card > .n-card__content span {
  font-size: v-bind('fontSizeCSS');
  text-align: justify;
}

@media (max-width: 768px) {
  .n-card.n-card--bordered .n-card__content span {
    font-size: v-bind('fontSizeCSS');
    text-align: justify;
  }
}
.reading-mode {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14pt;
  line-height: 1.4;

}

@media (min-width: 425px) {
  .reading-mode {
    font-size: 18pt;
    line-height: 1.6;
  }
}

/* Ensures text is not too wide for reading */
.reading-mode .max-w-2xl {
  max-width: 40rem; /* Optimal line length for reading */
}
</style>