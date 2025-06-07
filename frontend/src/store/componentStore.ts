import {defineStore} from "pinia";

type componentRecord = Record<string, object>
export const useComponentStore = defineStore({
    id: 'componentStore',
    state: () => ({
        componentsData: {} as Record<string, any>,
        interactions: [] as { event_type: string, component: string, value: string | null, data: object | null }[],
    }),
    actions: {
        registerComponentData(componentName: string, data: any) {
            // Directly use the component name as a key
            this.componentsData[componentName] = data;
        },
        unregisterComponentData(componentName: string) {
            // Delete the property from the object
            delete this.componentsData[componentName];
        },
        getComponentData(componentName: string) {
            return this.componentsData[componentName];
        },
        logInteraction(interaction: { event_type: string, component: string, value: string | null, data: object | null }) {
            this.interactions.unshift(interaction);
            if (this.interactions.length > 100) {
                this.interactions.pop();
            }
        }
    }
});