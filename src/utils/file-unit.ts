import type { AxiosResponse } from 'axios';

/**
 * 导出文件
 * @param res 下载响应体
 */
export default function (res: AxiosResponse, fileName?: string) {
  const disposition = res.headers['content-disposition'];
  if (!disposition) {
    alert('导出数据失败');
    return;
  }
  if (!fileName) {
    fileName = disposition.split(';')[1].split('filename=')[1];
    fileName = decodeURIComponent(fileName || '');
  }
  if ('msSaveOrOpenBlob' in navigator) {
    // IE导出
    (window.navigator as any).msSaveOrOpenBlob(res.data, fileName);
    return;
  }
  const link = document.createElement('a');
  link.download = fileName;
  link.style.display = 'none';
  link.href = URL.createObjectURL(res.data);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
