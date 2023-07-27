import { debounce } from 'lodash';
import type { Directive, DirectiveBinding } from 'vue';

type ObType = 'borderBoxSize' | 'contentBoxSize' | 'devicePixelContentBoxSize';

export type SizeObParams = { width: number; height: number };

export interface SizeObBinding extends DirectiveBinding {
  value: (params: SizeObParams) => void;
  arg?: ObType | string;
  modifiers: { debounce?: boolean };
}

const map = new WeakMap<Element, { cb: (params: SizeObParams) => void; obType: ObType }>();

const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const obConfig = map.get(entry.target);
    if (!obConfig) break;
    const { obType, cb } = obConfig;
    // 默认取第一个元素的盒子
    const box = entry[obType][0];
    cb({ width: box.inlineSize, height: box.blockSize });
  }
});
const obTypeMap = ['borderBoxSize', 'contentBoxSize', 'devicePixelContentBoxSize'];

/**
 * 监听el尺寸的变化
 * 参数-监听的尺寸类型：[borderBoxSize | contentBoxSize | devicePixelContentBoxSize ]，默认 borderBoxSize
 * 修饰符-debounce 是否启用防抖，默认不启用
 */
const vSizeOb: Directive = {
  // 在绑定元素的父组件及他自己的所有子节点都挂载完成后调用
  mounted(el: Element, binding: SizeObBinding) {
    const cb = binding.value;
    if (!cb || typeof cb !== 'function') return;
    let obType = binding.arg || 'borderBoxSize';
    if (!obTypeMap.includes(obType)) obType = 'borderBoxSize';
    const { debounce: isDebounce } = binding.modifiers;
    const handleCb = isDebounce ? debounce((params: SizeObParams) => cb(params), 300) : cb;
    // 存储参数和回调
    map.set(el, { cb: handleCb, obType: obType as ObType });
    // 监听尺寸的变化
    ob.observe(el);
  },
  // 绑定元素的父组件卸载后调用
  unmounted(el: Element) {
    ob.unobserve(el);
    if (map.has(el)) map.delete(el);
  },
};

export default vSizeOb;
