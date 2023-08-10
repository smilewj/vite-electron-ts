import { inject, onMounted, onUnmounted } from 'vue';
import type { CanvasDataType } from '.';
import { playerSymbol, type PlayerType } from '@/constant';
import { getGradientColor } from '@/utils/func';

/**
 * 动画2
 * @param canvasData
 * @returns
 */
export function useAnimation2(canvasData: CanvasDataType) {
  let left: number; // 距离左边的距离
  let bottom: number; // 距离底部的距离
  let topPoint: [number, number] = [0, 0]; // canvas左上角坐标
  let offset: number;
  let colors: Array<string>;
  let animationFrameId: number;
  let lineWidth: number;
  let maxLineHeight: number;

  const player = inject<PlayerType>(playerSymbol);

  function initCanvas() {
    if (!canvasData.ctx) return;
    canvasData.ctx.restore();
    canvasData.ctx.save();
    left = Math.round(canvasData.canvasWidth / 10);
    bottom = Math.round(canvasData.canvasHeight / 10);
    topPoint = [-left, -canvasData.canvasHeight + bottom];
    lineWidth = canvasData.canvasWidth - left * 2;
    maxLineHeight = canvasData.canvasHeight - bottom;
    canvasData.ctx.translate(left, canvasData.canvasHeight - bottom);
  }

  function initAutoAnalyser() {
    if (!player?.audioCtx.buffer) return;
    offset = Math.floor((player.audioCtx.buffer.length * 2) / 3);
    colors = new Array(offset);
    for (let i = 0; i < offset; i++) {
      colors[i] = getGradientColor(i, offset);
    }
  }

  function draw(data: number[] | Uint8Array, maxValue: number) {
    if (!canvasData.ctx) return;
    canvasData.ctx.clearRect(...topPoint, canvasData.canvasWidth, canvasData.canvasHeight);

    const delta = lineWidth / data.length;

    const w = (delta * 1) / 3;

    for (let i = 0; i < data.length; i++) {
      const ele = data[i];
      const rate = ele / maxValue;
      const colorValue = colors?.[i];
      const x1 = delta * i;
      const y1 = 0;
      const x2 = x1;
      const y2 = -rate * maxLineHeight;

      canvasData.ctx.beginPath();
      canvasData.ctx.moveTo(x1, y1);
      canvasData.ctx.lineTo(x2, y2);
      canvasData.ctx.lineWidth = w;
      // canvasData.ctx.lineCap = 'round';
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
    const data = new Array(offset);
    let maxValue = 0;
    for (let i = 0; i < offset; i++) {
      data[i] = player.audioCtx.buffer[i];
      if (maxValue < data[i]) maxValue = data[i];
    }
    if (maxValue < 300) maxValue = 300;
    draw(data, maxValue);
  }

  function stopDraw() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  onMounted(initAutoAnalyser);

  onUnmounted(stopDraw);

  return {
    initCanvas2: initCanvas,
    updateDraw2: updateDraw,
    stopDraw2: stopDraw,
  };
}
