import { defineComponent } from 'vue';
import rootClass from './index.module.scss';
import { useMusicList } from './useMusicList';
import { useMusicPlayAnimation } from './useMusicPlayAnimation';

/**
 * 首页
 */
export default defineComponent({
  setup() {
    const { render: render1 } = useMusicList();
    const { render: render2 } = useMusicPlayAnimation();

    return function () {
      return (
        <div class={rootClass.root}>
          <div class={rootClass['root-left']}>{render1()}</div>
          <div class={rootClass['root-right']}>{render2()}</div>
        </div>
      );
    };
  },
});
