import { inject, onMounted, ref, withDirectives } from 'vue';
import rootClass from './index.module.scss';
import vSizeOb, { type SizeObParams } from '@/directives/size-ob-directive';
import { playerSymbol, type PlayerType } from '@/constant';

/**
 * 音乐播放动画
 */
export function useMusicPlayAnimation() {
  let analyser: AnalyserNode | undefined; // 音频分析处理器节点
  let buffer: Uint8Array | undefined; // 音频分析数据
  const player = inject<PlayerType>(playerSymbol);
  // const audioRef = computed(() => player?.elRef.value);
  const canvasRef = ref<HTMLCanvasElement | undefined>();
  let ctx: CanvasRenderingContext2D | null;
  let radius: number;
  let maxLineHeight: number;
  let canvasWidth: number;
  let canvasHeight: number;

  function handleSizeChange({ width, height }: SizeObParams) {
    initCanvas({ width, height });
  }

  function initCanvas({ width, height }: SizeObParams) {
    const canvasDom = canvasRef.value;
    if (!canvasDom || !ctx) return;
    // 获取 Canvas 的宽度和高度
    canvasWidth = width * devicePixelRatio;
    canvasHeight = height * devicePixelRatio;
    canvasDom.width = canvasWidth;
    canvasDom.height = canvasHeight;
    radius = Math.min(canvasWidth, canvasHeight) / 10;
    maxLineHeight = radius * 5;
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    draw(new Array(200).fill(0), 255);
  }

  function draw(data: number[] | Uint8Array, maxValue: number) {
    if (!ctx) return;
    ctx.clearRect(-canvasHeight / 2, -canvasWidth / 2, canvasHeight, canvasWidth);
    const delta = (2 * Math.PI) / data.length;

    const w = (radius * Math.sin(delta) * 2) / 2;

    for (let i = 0; i < data.length; i++) {
      const ele = data[i];
      const rate = ele / maxValue;
      const lineHeight = rate * maxLineHeight + radius;
      const colorValue = getGradientColor(i, data.length);

      const deg = delta * i;
      const x1 = radius * Math.cos(deg) - radius; // 邻边
      const y1 = radius * Math.sin(deg); // 对边
      const x2 = lineHeight * Math.cos(deg) - radius; // 邻边
      const y2 = lineHeight * Math.sin(deg); // 对边
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.strokeStyle = colorValue;
      ctx.stroke();
      ctx.closePath();
    }
  }

  function getGradientColor(index: number, totalColors: number) {
    // 设置渐变的起始颜色和结束颜色（这里使用RGB表示）
    const startColor = [255, 0, 0]; // 红色
    const endColor = [0, 0, 255]; // 蓝色

    // 计算每个分量的渐变步长
    const stepR = (endColor[0] - startColor[0]) / (totalColors - 1);
    const stepG = (endColor[1] - startColor[1]) / (totalColors - 1);
    const stepB = (endColor[2] - startColor[2]) / (totalColors - 1);

    // 根据数组下标计算当前颜色的RGB值
    const r = Math.round(startColor[0] + stepR * index);
    const g = Math.round(startColor[1] + stepG * index);
    const b = Math.round(startColor[2] + stepB * index);

    // 返回渐变颜色，这里用RGB表示
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * 初始化音频分析处理器节点
   */
  function initAutoAnalyser() {
    if (analyser) {
      return;
    }
    const audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    buffer = new Uint8Array(analyser.frequencyBinCount);
    const source = audioCtx.createMediaElementSource(player!.elRef!.value!);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function updateDraw() {
    requestAnimationFrame(updateDraw);
    if (!analyser || !buffer) {
      return;
    }
    analyser.getByteFrequencyData(buffer);

    const offset = Math.floor((buffer.length * 2) / 3);
    const data = new Array(offset * 2);
    for (let i = 0; i < offset; i++) {
      data[i] = data[data.length - i - 1] = buffer[i];
    }
    draw(data, 300);
  }

  onMounted(() => {
    ctx = canvasRef.value!.getContext('2d');
    if (player && player.elRef.value) {
      player.elRef.value.onplay = initAutoAnalyser;
      if (!player.elRef.value.paused) {
        initAutoAnalyser();
      }
      updateDraw();
    }
  });

  function render() {
    return withDirectives(
      <div class={rootClass.animation}>
        <canvas class={rootClass.canvas} ref={canvasRef}></canvas>
      </div>,
      [[vSizeOb, handleSizeChange, 'contentBoxSize']],
    );
  }

  return { render };
}
