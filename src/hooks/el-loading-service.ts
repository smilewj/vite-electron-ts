import { ElLoading } from 'element-plus';

import 'element-plus/es/components/loading/style/css';

interface IElLoading {
  setText: (text: string) => void;
  close: () => void;
}

let loadingInstance: undefined | IElLoading;

export function loadingService(options = { text: '加载中...' }) {
  loadingInstance = ElLoading.service(options);
}

export function getLoadingInstance() {
  return loadingInstance;
}
