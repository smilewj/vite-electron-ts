import { defineComponent } from 'vue';
import rootClass from './index.module.scss';
import { useMusicList } from './useMusicList';

/**
 * 首页
 */
export default defineComponent({
  setup() {
    const { render: render1 } = useMusicList();

    return function () {
      return <div class={rootClass.root}>{render1()}</div>;
    };
  },
});
