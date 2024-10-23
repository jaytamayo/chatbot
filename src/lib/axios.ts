import Axios, { AxiosRequestConfig } from 'axios';
import { JWTStorage } from '@/utils';
import { API_URL } from '@/config';

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = JWTStorage.getToken();

  token && config.headers
    ? (config.headers.authorization = `Bearer ${token}`)
    : '';

  config.headers ? (config.headers.Accept = 'application/json') : '';

  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

// @ts-ignore ,
axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
