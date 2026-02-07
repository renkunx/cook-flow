/**
 * API 客户端
 * 封装 axios，处理认证、错误处理、请求/响应拦截
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError } from '@/types/api';

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('api_token') || API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加 CSRF token（如果需要）
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('api_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('权限不足:', data?.msg || 'Forbidden');
          break;
        case 404:
          console.error('资源不存在:', data?.msg || 'Not Found');
          break;
        case 500:
          console.error('服务器错误:', data?.msg || 'Internal Server Error');
          break;
        default:
          console.error('API 错误:', data?.msg || error.message);
      }
    } else if (error.request) {
      console.error('网络错误，请检查连接:', error.message);
    } else {
      console.error('请求错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 通用请求方法
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

// 文件上传方法
export const uploadFile = <T>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  }).then((res) => res.data);
};

export default apiClient;
