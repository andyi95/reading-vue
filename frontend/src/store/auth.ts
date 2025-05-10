import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {api} from "@/helpers";

export const useAuthStore = defineStore('authStore', () => {
    const hashedPassword = ref<string>('');
    const isLoading = ref<boolean>(false);
    const isLoggedIn = ref<boolean>(false);
    const isError = ref<boolean>(false);

    async function hashPassword(password: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    async function setPassword(password: string) {
        isLoading.value = true;
        isError.value = false;
        try {
            hashedPassword.value = await hashPassword(password);
            localStorage.setItem('hashedPassword', hashedPassword.value);
            isLoggedIn.value = true;
        } catch (error) {
            console.error('Error hashing password:', error);
            isError.value = true;
        } finally {
            isLoading.value = false;
        }

        return hashedPassword.value;
    }
    async function validatePassword() {
        if (!hashedPassword.value) {
            isLoggedIn.value = false;
            return false;
        }
        isLoading.value = true;
        isError.value = false;
        try {
            await api.post('/auth/validate/', {}, {headers: {Authorization: `Bearer ${hashedPassword.value}`}})
            isLoggedIn.value = true;
        }
        catch (error: any) {
            if (error.response?.status === 401) {
                isLoggedIn.value = false;
                isError.value = true;
            } else {
                console.error('Error validating password:', error);
                isError.value = true;
            }
        }
        finally {
            isLoading.value = false;
        }
    }

    return {
        hashedPassword,
        isLoading,
        isLoggedIn,
        isError,
        validatePassword,
        setPassword
    };
}, {
    persist: true
})
