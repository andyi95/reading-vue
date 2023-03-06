import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 1000,
    withCredentials: true
});
