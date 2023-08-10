import { inject, onMounted, onUnmounted } from 'vue';
import type { CanvasDataType } from '.';
import { playerSymbol, type PlayerType } from '@/constant';
import { getGradientColor } from '@/utils/func';

/**
 * 动画1
 * @param canvasData
 * @returns
 */
export function useAnimation1(canvasData: CanvasDataType) {
  let radius: number;
  let maxLineHeight: number;
  let animationFrameId: number;
  let offset: number;
  let allColors: Array<string>;

  const player = inject<PlayerType>(playerSymbol);

  function initCanvas() {
    if (!canvasData.ctx) return;
    canvasData.ctx.translate(canvasData.canvasWidth / 2, canvasData.canvasHeight / 2);
    canvasData.ctx.rotate(-Math.PI / 2);
    radius = Math.min(canvasData.canvasWidth, canvasData.canvasHeight) / 20;
    maxLineHeight = radius * 10;
  }

  function initAutoAnalyser() {
    if (!player?.audioCtx.buffer) return;
    offset = Math.floor((player.audioCtx.buffer.length * 2) / 3);
    const colors = new Array(offset);
    for (let i = 0; i < offset; i++) {
      colors[i] = getGradientColor(i, offset);
    }
    allColors = new Array(offset * 2);
    for (let i = 0; i < offset; i++) {
      allColors[i] = allColors[allColors.length - i - 1] = colors[i];
    }
  }

  function draw(data: number[] | Uint8Array, maxValue: number) {
    if (!canvasData.ctx) return;
    canvasData.ctx.clearRect(
      -canvasData.canvasHeight / 2,
      -canvasData.canvasWidth / 2,
      canvasData.canvasHeight,
      canvasData.canvasWidth,
    );
    const delta = (2 * Math.PI) / data.length;

    const w = (radius * Math.sin(delta) * 2) / 2;

    for (let i = 0; i < data.length; i++) {
      const ele = data[i];
      const rate = ele / maxValue;
      const lineHeight = rate * maxLineHeight + radius;
      const colorValue = allColors?.[i];

      const deg = delta * i;
      const x1 = radius * Math.cos(deg) - radius; // 邻边
      const y1 = radius * Math.sin(deg); // 对边
      const x2 = lineHeight * Math.cos(deg) - radius; // 邻边
      const y2 = lineHeight * Math.sin(deg); // 对边
      canvasData.ctx.beginPath();
      canvasData.ctx.moveTo(x1, y1);
      canvasData.ctx.lineTo(x2, y2);
      canvasData.ctx.lineWidth = w;
      canvasData.ctx.lineCap = 'round';
      canvasData.ctx.strokeStyle = colorValue;
      canvasData.ctx.stroke();
      canvasData.ctx.closePath();
    }
  }

  function updateDraw() {
    animationFrameId = requestAnimationFrame(updateDraw);
    if (!player?.audioCtx.analyser || !player?.audioCtx.buffer) {
      return;
    }
    player.audioCtx.analyser.getByteFrequencyData(player.audioCtx.buffer);
    const data = new Array(offset * 2);
    for (let i = 0; i < offset; i++) {
      data[i] = data[data.length - i - 1] = player.audioCtx.buffer[i];
    }
    draw(data, 300);
  }

  onMounted(initAutoAnalyser);

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  return {
    initCanvas1: initCanvas,
    updateDraw1: updateDraw,
  };
}
