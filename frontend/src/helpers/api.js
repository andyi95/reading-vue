import axios from 'axios';

export const api = axios.create({
    baseURL: (typeof process.env.VUE_APP_API_URL === 'undefined') ? 'https://reader.stage.andyi95.com/api/' : process.env.VUE_APP_API_URL,
    timeout: 100000,
    withCredentials: true
});
