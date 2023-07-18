import { defineComponent } from 'vue';
import rootClass from './index.module.scss';

/**
 * 门户页面
 */
export default defineComponent({
  setup() {
    return function () {
      return <div class={rootClass.root}>首页</div>;
    };
  },
});
