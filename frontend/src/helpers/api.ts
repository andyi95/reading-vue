import axios, { AxiosInstance } from 'axios';

let baseURL: string;
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:8000/api/';
} else {
    baseURL = '/api/';
}

interface ApiConfig {
    baseURL: string;
    timeout: number;
    withCredentials: boolean;
    headers?: {
        post?: {
            "Access-Control-Allow-Origin": string;
        }
    };
}

const apiConfig: ApiConfig = {
    baseURL: baseURL,
    timeout: 100000,
    withCredentials: process.env.NODE_ENV !== 'development',
    ...(process.env.NODE_ENV === 'development' && {
        headers: {
            post: {
                "Access-Control-Allow-Origin": "*",
            }
        }
    })
};

export const api: AxiosInstance = axios.create(apiConfig);
