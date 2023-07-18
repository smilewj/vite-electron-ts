<!-- CommonDialog -->
<template>
  <el-dialog
    class="common-dialog"
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    destroy-on-close
    append-to-body
    @closed="$emit('closed')"
    :top="top"
    :align-center="alignCenter"
  >
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
    <template #footer v-if="!hideFooter">
      <span class="dialog-footer">
        <slot name="footerOther"></slot>
        <template v-if="!$slots.footerOther">
          <el-button custom-size="middle" plain @click="dialogVisible = false">
            {{ cancelText }}
          </el-button>
          <el-button
            v-if="!hideConfirmButton"
            :type="confirmButtonType"
            custom-size="middle"
            @click="handleConfirm"
            :loading="confirmLoading"
          >
            {{ confirmText }}
          </el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  top: {
    type: String,
    default: '10vh',
  },
  title: { type: String },
  width: { type: String, default: '600px' },
  cancelText: { type: String, default: '取消' },
  confirmText: { type: String, default: '确定' },
  confirmButtonType: { type: String, default: 'primary' },
  confirm: { type: Function },
  hideFooter: { type: Boolean, default: false },
  hideConfirmButton: { type: Boolean, default: false },
  alignCenter: { type: Boolean, default: false },
});

defineEmits<{ (e: 'closed'): void }>();

const dialogVisible = ref(true);
const confirmLoading = ref(false);

async function handleConfirm() {
  try {
    confirmLoading.value = true;
    if (props.confirm) {
      await props.confirm();
    }
    dialogVisible.value = false;
  } catch (error) {
    console.error('dialog close fail');
    console.error(error);
  } finally {
    confirmLoading.value = false;
  }
}

function closeDialog() {
  dialogVisible.value = false;
}

defineExpose({ closeDialog });
</script>

<style lang="scss">
.common-dialog {
  --el-dialog-border-radius: 4px;
  --el-box-shadow: 0px 8px 12px 0px rgba(194, 199, 206, 0.3);
  --el-dialog-padding-primary: 15px;
  .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    margin-right: 0;
    padding: var(--el-dialog-padding-primary) 24px;
    .el-dialog__title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
    }
    .el-dialog__headerbtn {
      top: 2px;
      right: 2px;
    }
    .el-dialog__close {
      color: #404f6d;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .el-dialog__body {
    padding: 24px 38px var(--el-dialog-padding-primary);
  }
  .el-dialog__footer {
    padding: 0 24px var(--el-dialog-padding-primary);
    text-align: right;
    .el-button {
      min-width: 80px;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
