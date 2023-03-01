import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    // baseURL: "https://reader.dev.andyi95.com/api/",
    timeout: 1000,
    withCredentials: true
});
