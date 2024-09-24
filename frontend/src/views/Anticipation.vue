<template>
  <n-space vertical size="medium" justify="space-between">
    <n-drawer v-model:show="store.readingMode" placement="top" width="100%" height="100%" @updateShow="store.toggleReadingMode">
      <n-drawer-content :title="$t('common.readingMode')" class="reading-mode" closable>
        <div v-if="parsedText.length > 0"
             :class="[{'bg-neutral-200': !store.isDarkTheme}, 'p-10', 'max-w-2xl', 'mx-auto', 'text-justify']">
          <span v-for="item in parsedText" :class="getCharClass(item)">{{item.char}}</span>
        </div>
      </n-drawer-content></n-drawer>
    <n-form size="medium">
      <BaseInput :label="$t('common.sourceText')" :placeholder="$t('common.textPlaceHolder')"
                 v-model:post-body="sourceText" @input-updated="textUpdated($event)"/>

      <div class="py-5 w-1/3">
        <n-form-item :label="$t('anticipation.selectChars')">
          <n-select v-model:value="additionalChars"
                    multiple :options="russianConsonants"
                    :placeholder="$t('anticipation.placeHolderSelect')"
                    @update:value="removeVowels"
          />
        </n-form-item>

                    <n-form-item :label="$t('common.fontSize')">
              <FontSizeSelect
                  :value="fontSize" @update:value="handleFontSizeChange"/>
            </n-form-item>
      </div>
    </n-form>
  </n-space>

  <BaseTextBox ref="textContent" v-if="parsedText.length > 0">
    <span v-for="item in parsedText" :class="getCharClass(item)">{{item.char}}</span>
  </BaseTextBox>
</template>

<script setup lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {NCollapseItem, NForm, NFormItem, NSelect, NSlider, NSpace} from "naive-ui";
import BaseTextBox from "@/components/BaseTextBox.vue";
import charSets from "@/helpers/charSets";
import TextParser from "@/helpers/parser";
import FontSizeSelect from "@/components/FontSizeSelect.vue";
import {computed, ref} from "vue";
import {useMainStore} from "@/store/main";
import {useI18n} from "vue-i18n";
const {t} = useI18n();
const sourceText = ref('');
const additionalChars = ref([]);
const parsedText = ref([]);
const store = useMainStore();
const russianConsonants = charSets.russianAlphabet.selectConsonants;
const getCharClass = (item) => {
  if(item.is_vowel){
    if(store.isDarkTheme()){
      return 'grayed-dark';
    }
    return 'grayed';
  }
}
const handleFontSizeChange = (newFontSize) => {
  store.updateFontSize('anticipationSettings', newFontSize)
}
const removeVowels = () => {
  let parser = new TextParser(sourceText.value);
  let parsedCharacters = parser.replaceVowels();
  parsedCharacters.forEach((item, i) => {
    if (additionalChars.value.includes(item.char.toUpperCase()) || item.is_vowel){
      parsedCharacters[i].char = '●'
      parsedCharacters[i].is_vowel = true
    }
  })
  parsedText.value = parsedCharacters
}
const textUpdated = (value) => {
  sourceText.value = value;
  removeVowels();

}
const fontSize = computed(() => store.anticipationSettings.fontSize);
const fontSizeCSS = computed(() => `${fontSize.value}pt`);
</script>

<style scoped>
.n-card >>> .n-card__content {
  word-spacing: 0.4em;
  letter-spacing: 0.05em;
  font-size: v-bind('fontSizeCSS');
  text-align: justify;
}
@media (max-width: 768px) {
    .n-card > .n-card__content {
        word-spacing: 0.2em;
        letter-spacing: 0.02em;
        font-size: v-bind('fontSizeCSS');
  text-align: justify;
    }
}
.grayed {
  color: #E0E0E0!important;
}
.grayed-dark{
  color: #767676!important;
}
.reading-mode {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14pt;
  line-height: 1.4;
  word-spacing: 0.4em;
  letter-spacing: 0.005em;
}

@media (min-width: 425px) {
  .reading-mode {
    font-size: 16pt;
    line-height: 1.6;
  }
}

/* Ensures text is not too wide for reading */
.reading-mode .max-w-2xl {
  max-width: 40rem; /* Optimal line length for reading */
}
</style>