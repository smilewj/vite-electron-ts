import debMessage from '@/hooks/deb-message';
import copy from 'copy-to-clipboard';

/**
 * 复制文本到剪切板
 * @param {*} content 要复制的文本
 */
export function handleCopy(content: string) {
  const result = copy(content, { format: 'text/plain', message: '复制失败!' });
  if (result) {
    debMessage({ message: '复制成功!' });
  }
}

let i = 0;

/**
 * 获取唯一ID
 * @param prefix 前缀
 * @returns {string}
 */
export function getUniqueString(prefix?: string): string {
  const randomKey = Math.random().toString(36).substring(2);
  return `${prefix ? prefix + '-' : ''}${randomKey}-${Date.now()}-${i++}`;
}

/**
 * 去除两端空格
 * @param value
 * @returns
 */
export function formatterTrim(value: string) {
  return value.trim();
}
