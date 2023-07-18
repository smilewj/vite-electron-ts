import CommonIconVue from '@/components/CommonIcon.vue';
import { SuccessFilled, WarningFilled, CircleCloseFilled, InfoFilled } from '@element-plus/icons-vue';
import { ElMessageBox, ElIcon } from 'element-plus';
import 'element-plus/es/components/message-box/style/index';
import type { VNode } from 'vue';

interface IElConfirmOptions {
  message: string | VNode;
  type?: 'success' | 'info' | 'warning' | 'error';
  confirmButtonText?: string;
  cancelButtonText?: string;
  options?: {};
  boxType?: 'alert' | 'confirm';
  title?: string | VNode;
}

export default function ({
  message,
  type = 'warning',
  confirmButtonText = '确定',
  cancelButtonText = '取消',
  options = {},
  boxType = 'confirm',
  title = '提示',
}: IElConfirmOptions) {
  const customContent = (
    <div class="custom-message-box-container">
      {type && (
        <div class={['custom-message-box-status', 'el-message-box__status', `el-message-box-icon--` + type]}>
          <ElIcon size={24}>
            {type === 'warning' ? (
              <WarningFilled></WarningFilled>
            ) : type === 'success' ? (
              <SuccessFilled></SuccessFilled>
            ) : type === 'error' ? (
              <CircleCloseFilled></CircleCloseFilled>
            ) : type === 'info' ? (
              <InfoFilled></InfoFilled>
            ) : undefined}
          </ElIcon>
        </div>
      )}
      <div class="custom-message-box-content">
        <div class="custom-message-box-title">{title}</div>
        <div class="custom-message-box-message">{message}</div>
      </div>
    </div>
  );
  const _options = {
    type,
    confirmButtonText,
    cancelButtonText,
    closeOnClickModal: false,
    autofocus: false,
    ...options,
    customClass: type === 'error' ? 'my-danger-message-box common-message-box' : 'common-message-box',
  };
  return ElMessageBox[boxType](customContent, '', _options);
}

export function resultConfirm({
  message,
  type = 'warning',
  confirmButtonText = '确定',
  cancelButtonText = '取消',
  options = {},
  boxType = 'confirm',
  title = '提示',
}: IElConfirmOptions) {
  const customContent = (
    <>
      <CommonIconVue
        icon={type === 'error' ? 'icon-ceshishibai' : 'icon-ceshichenggong'}
        class="mb8"
        style="font-size: 64px;"
      ></CommonIconVue>
      <div class="result-message-first-line">{title}</div>
      <div class="result-message-second-line">{message}</div>
    </>
  );
  const _options = {
    type,
    confirmButtonText,
    cancelButtonText,
    closeOnClickModal: false,
    showCancelButton: false,
    autofocus: false,
    center: true,
    ...options,
    customClass: 'result-message-box',
  };
  return ElMessageBox[boxType](customContent, '', _options);
}
