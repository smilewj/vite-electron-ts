import { debounce } from 'lodash';
import { ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/index';
import type { VNode } from 'vue';

interface IDebMessage {
  message: string | VNode;
  duration?: number;
  showClose?: any;
  type?: 'success' | 'warning' | 'info' | 'error';
  customClass?: string;
  title?: string;
}

/** 防抖提示 */
const debMessage = debounce(
  ({ message, duration = 3000, showClose = true, type = 'success', customClass = '', title }: IDebMessage) => {
    if (title) {
      customClass = 'custom-message';
      message = (
        <div class="message-box">
          <div class="message-box-first-line">{title}</div>
          <div class="message-box-second-line">{message}</div>
        </div>
      );
    }
    ElMessage({ message, duration, showClose, type, grouping: true, customClass });
  },
  300,
);

export default debMessage;
