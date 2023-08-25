import vSizeOb, { type SizeObParams } from '@/directives/size-ob-directive';
import { inject, nextTick, onMounted, ref, withDirectives } from 'vue';
import rootClass from './index.module.scss';
import type { CanvasDataType } from '@/pages/MusicPlaying';
import { useAnimation2 } from '@/pages/MusicPlaying/useAnimation2';
import { playerPromiseSymbol, type PromisePlayerType } from '@/constant';

export function initAnimationBg() {
  const canvasData: CanvasDataType = {
    ctx: null,
    canvasWidth: 0,
    canvasHeight: 0,
  };

  const canvasRef = ref<HTMLCanvasElement | undefined>();
  const playerPromise = inject<PromisePlayerType>(playerPromiseSymbol);

  const { initCanvas2, updateDraw2 } = useAnimation2(canvasData);

  function handleSizeChange({ width, height }: SizeObParams) {
    initCanvas({ width, height });
    initCanvas2();
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
    // if (Array.isArray([])) return;
    if (!canvasRef.value || !playerPromise) return;
    const player = await playerPromise;
    canvasData.ctx = canvasRef.value.getContext('2d');
    updateDraw2(player);
  });

  function render() {
    return withDirectives(
      <div class={rootClass.root}>
        <canvas ref={canvasRef}></canvas>
      </div>,
      [[vSizeOb, handleSizeChange, 'contentBoxSize']],
    );
  }

  return {
    abRender: render,
  };
}
