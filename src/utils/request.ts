import axios, { type AxiosRequestConfig } from 'axios';
import config from '@/config';
import debMessage from '@/hooks/deb-message';
export interface MeAxiosRequestConfig extends AxiosRequestConfig {
  /** 是否隐藏 message 提示 */
  hideMessage?: boolean;
}

const baseURL = config.apiHost;

const option = { baseURL: baseURL, timeout: 10000 };

// 创建 axios 实例
const service = axios.create(option);

// http request 拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => Promise.reject(err),
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 判断处理结果是文件类型时，不对结果集处理，直接返回
    if (res instanceof Blob) {
      return response;
    }
    // 这里需要根据不同的项目后端接口封装情况做适当调整
    if (!res.success) {
      const code = res.code;
      const message = (res && res.msg) || '未知异常！';
      const config = response.config || {};
      const { hideMessage } = config as unknown as MeAxiosRequestConfig;
      if (!hideMessage) debMessage({ message, type: 'error' });
      return Promise.reject(new BusinessError(message, code));
    } else {
      return res.data;
    }
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('Request canceled');
      return Promise.reject(new CancelError(error.message as any));
    }
    const config = error.config || {};
    const { hideMessage } = config as MeAxiosRequestConfig;
    const res = error.response || {};
    let message = (res.data && res.data.msg) || '未知异常，请联系管理员！';
    if (message.includes('timeout')) {
      message = '服务请求超时，请重试！';
    }
    if (!hideMessage) {
      debMessage({ message, type: 'error' });
    }
    return Promise.reject(new Error(message));
  },
);

export default service;

/**
 * 一般业务错误。通过code区分业务错误
 */
export class BusinessError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

/**
 * 请求被取消
 */
export class CancelError extends Error {
  constructor(message: string) {
    super(message);
  }
}
