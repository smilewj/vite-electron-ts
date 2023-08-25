import { computed, defineComponent, inject, nextTick, onMounted, ref, watch, withDirectives } from 'vue';
import rootClass from '../index.module.scss';
import { useRouterBackRender } from '../page-hook';
import vSizeOb, { type SizeObParams } from '@/directives/size-ob-directive';
import { useAnimation1 } from './useAnimation1';
import { useAnimation2 } from './useAnimation2';
import { playerPromiseSymbol, type PromisePlayerType } from '@/constant';

export type CanvasDataType = {
  ctx: CanvasRenderingContext2D | null;
  canvasWidth: number;
  canvasHeight: number;
};

export default defineComponent({
  setup() {
    const { routerBackRender } = useRouterBackRender(-1, true);

    const canvasData: CanvasDataType = {
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
    };
    const canvasRef = ref<HTMLCanvasElement | undefined>();
    const playerPromise = inject<PromisePlayerType>(playerPromiseSymbol);

    const { initCanvas1, updateDraw1, stopDraw1 } = useAnimation1(canvasData);
    const { initCanvas2, updateDraw2, stopDraw2 } = useAnimation2(canvasData);

    const animationList = [
      { label: '动画1', init: initCanvas1, update: updateDraw1, stop: stopDraw1 },
      { label: '动画2', init: initCanvas2, update: updateDraw2, stop: stopDraw2 },
    ];
    const curAnimationIndex = ref(Math.floor(Math.random() * animationList.length));

    const curAnimation = computed(() => animationList[curAnimationIndex.value]);

    watch(curAnimation, async (val1, val2) => {
      if (!val1) return;
      if (val2) val2.stop();
      if (!playerPromise) return;
      val1.init();
      const player = await playerPromise;
      val1.update(player);
    });

    function handleSizeChange({ width, height }: SizeObParams) {
      initCanvas({ width, height });
      curAnimation.value.init();
    }

    function initCanvas({ width, height }: SizeObParams) {
      const canvasDom = canvasRef.value;
      if (!canvasDom || !canvasData.ctx) return;
      // 获取 Canvas 的宽度和高度
      canvasData.canvasWidth = width * devicePixelRatio;
      canvasData.canvasHeight = height * devicePixelRatio;
      canvasDom.width = canvasData.canvasWidth;
      canvasDom.height = canvasData.canvasHeight;
    }

    onMounted(async () => {
      await nextTick();
      if (!canvasRef.value || !playerPromise) return;
      const player = await playerPromise;
      canvasData.ctx = canvasRef.value.getContext('2d');
      curAnimation.value.update(player);
    });

    return function () {
      return (
        <div class={rootClass.animation}>
          {routerBackRender()}
          <div class={rootClass['animation-list']}>
            {animationList.map((it, index) => (
              <div
                class={[rootClass['animation-list-item'], index === curAnimationIndex.value ? rootClass.active : '']}
                onClick={() => (curAnimationIndex.value = index)}
              >
                {it.label}
              </div>
            ))}
          </div>
          {withDirectives(<canvas class={rootClass['animation-canvas']} ref={canvasRef}></canvas>, [
            [vSizeOb, handleSizeChange, 'contentBoxSize'],
          ])}
        </div>
      );
    };
  },
});
