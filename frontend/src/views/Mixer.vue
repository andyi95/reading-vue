<template>
    <n-space vertical size="medium" justify="space-between">
        <n-form size="medium">
            <BaseInput :label="$t('chaos.sourceText')" :placeholder="$t('chaos.textPlaceHolder')" v-model:post-body="postBody" @input-updated="textUpdated($event)"/>

                <BaseButton :label="$t('chaos.convertText')" @button-clicked="chaosChars()"/>
        </n-form>
        <n-card  v-if="convertedText && convertedText.length > 1">
            <span>{{ convertedText }}</span></n-card>
    </n-space>
</template>

<script>
import {useI18n} from "vue-i18n";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useMessage} from "naive-ui";

export default {
    name: "Mixer",
    components: {BaseButton, BaseInput},
    setup(){
        const { t } = useI18n();
        const message = useMessage();
        return{
            t,
            warning(text){
                message.warning(text)
            }
        }
    },
    data() {
        return {
            postBody: '',
            convertedText: ''
        }
    },
    methods: {
        textUpdated(value){
            if (value === ''){
                this.warning($t('chaos.enterTextWarning'))
            }
            this.postBody = value;
        },
        chaosChars(){
            const reg = /^[a-zа-я]+$/i;
            function getRandomInt(n){
                var min = Math.ceil(1)
                var max = Math.floor(n-1)
                return Math.floor(Math.random() * (max - min) + min);
            }
            function shuffleWord(word){
                var output = ''
                var isGet = 1
                var arr = word.split('')
                var n = arr.length;
                for(var i = 0; i < n; ++i){
                    if(i===0 || i >= n -1 || !reg.test(arr[i])){
                        continue
                    }
                    var j = getRandomInt(n);
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
                return arr.join('');
            }
            var words = this.postBody.replace(/[^a-zа-я0-9]|\r\n|\n|\r/gi, ' ').split(' ')
            var newArr = []
            for (var word of words){
                if (word.length < 3){
                    newArr.push(word)
                    continue;
                }
                newArr.push(shuffleWord(word.replace(/[^a-zа-я0-9]/gi, '')))
            }
            this.convertedText = newArr.join(' ')
        }
    }
}
</script>

<style scoped>
.n-card{
    margin-top: 1.5em;
}
.n-card.n-card--bordered .n-card__content{
    text-align: center;
    display: flex;
}
.n-card.n-card--bordered .n-card__content span{
    font-size: 1.2em;
    text-align: justify;
    display: flex;
    /*display: flex;*/
    //justify-content: center;
    //align-items: center;

}
</style>