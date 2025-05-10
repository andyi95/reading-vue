import type {Composer} from 'vue-i18n';
import type {ComponentCustomProperties} from 'vue';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: Composer['t'];
    }
}