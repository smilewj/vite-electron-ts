import { ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/index';

interface IAsyncMessage {
  message: string;
  duration?: number;
  showClose?: any;
  type?: 'success' | 'warning' | 'info' | 'error';
}

/** 返回 promise 提示 */
function AsyncMessage({ message, duration = 3000, showClose = true, type = 'success' }: IAsyncMessage) {
  return new Promise((resolve) => {
    ElMessage({ message, duration, showClose, type, onClose: ((message: any) => resolve(message)) as any });
  });
}

export default AsyncMessage;
