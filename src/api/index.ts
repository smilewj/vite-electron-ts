import axios from '@/utils/request';
import type { AxiosRequestConfig } from 'axios';

/**
 * post
 * @returns
 */
export function post() {
  return axios.post('/idaas/authorize', undefined, {
    hideMessage: false,
  } as AxiosRequestConfig);
}
