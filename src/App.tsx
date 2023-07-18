import { defineComponent } from 'vue';
import zhCn from '@/locale/zh-cn';
// import en from '@/locale/en';
import { ElConfigProvider } from 'element-plus';
import { RouterView } from 'vue-router';

export default defineComponent({
  setup() {
    return function () {
      return (
        <ElConfigProvider locale={zhCn}>
          <RouterView />
        </ElConfigProvider>
      );
    };
  },
});
