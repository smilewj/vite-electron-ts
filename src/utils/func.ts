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

/**
 * 计算渐变颜色
 * @param index 当前所求的渐变色下标
 * @param totalColors 所求的渐变色总数
 * @param startColor 渐变的起始颜色（这里使用RGB表示）
 * @param endColor 渐变的结束颜色（这里使用RGB表示）
 * @returns
 */
export function getGradientColor(
  index: number,
  totalColors: number,
  startColor = [0, 255, 255],
  endColor = [255, 0, 120],
) {
  // 计算每个分量的渐变步长
  const stepR = (endColor[0] - startColor[0]) / (totalColors - 1);
  const stepG = (endColor[1] - startColor[1]) / (totalColors - 1);
  const stepB = (endColor[2] - startColor[2]) / (totalColors - 1);

  // 根据数组下标计算当前颜色的RGB值
  const r = Math.round(startColor[0] + stepR * index);
  const g = Math.round(startColor[1] + stepG * index);
  const b = Math.round(startColor[2] + stepB * index);

  // 返回渐变颜色，这里用RGB表示
  return `rgb(${r}, ${g}, ${b})`;
}
