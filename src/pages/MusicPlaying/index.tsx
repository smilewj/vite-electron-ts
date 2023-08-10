import { defineComponent, inject, nextTick, onMounted, ref, withDirectives } from 'vue';
import rootClass from '../index.module.scss';
import { useRouterBackRender } from '../page-hook';
import vSizeOb, { type SizeObParams } from '@/directives/size-ob-directive';
import { useAnimation1 } from './useAnimation1';
import { playerSymbol, type PlayerType } from '@/constant';

export type CanvasDataType = {
  ctx: CanvasRenderingContext2D | null;
  canvasWidth: number;
  canvasHeight: number;
};

export default defineComponent({
  setup() {
    const { routerBackRender } = useRouterBackRender();

    const canvasData: CanvasDataType = {
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
    };
    const canvasRef = ref<HTMLCanvasElement | undefined>();
    const player = inject<PlayerType>(playerSymbol);

    const { initCanvas1, updateDraw1 } = useAnimation1(canvasData);

    function handleSizeChange({ width, height }: SizeObParams) {
      initCanvas({ width, height });
      initCanvas1();
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
      if (!canvasRef.value || !player) return;
      canvasData.ctx = canvasRef.value.getContext('2d');
      updateDraw1();
    });

    return function () {
      return (
        <div class={rootClass.animation}>
          {routerBackRender()}
          {withDirectives(<canvas class={rootClass['animation-canvas']} ref={canvasRef}></canvas>, [
            [vSizeOb, handleSizeChange, 'contentBoxSize'],
          ])}
        </div>
      );
    };
  },
});
