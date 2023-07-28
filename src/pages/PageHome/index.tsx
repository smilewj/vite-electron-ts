import { computed, defineComponent, ref } from 'vue';
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

    const fullAnimation = ref(false);

    function handleDblclick() {
      fullAnimation.value = !fullAnimation.value;
    }

    const leftStyle = computed(() => ({ display: fullAnimation.value ? 'none' : '' }));

    return function () {
      return (
        <div class={rootClass.root}>
          <div class={rootClass['root-left']} style={leftStyle.value}>
            {render1()}
          </div>
          <div class={rootClass['root-right']} onDblclick={handleDblclick}>
            {render2()}
          </div>
        </div>
      );
    };
  },
});
