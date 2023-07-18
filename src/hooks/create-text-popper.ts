import { createPopper, type Modifier } from '@popperjs/core';
import { useZIndex, useDelayedToggle, type ElTooltipProps } from 'element-plus';
import escapeHtml from 'escape-html';
import { merge } from 'lodash';

export type TextOverflowTooltipOptions = Partial<
  Pick<
    ElTooltipProps,
    | 'effect'
    | 'enterable'
    | 'hideAfter'
    | 'offset'
    | 'placement'
    | 'popperClass'
    | 'popperOptions'
    | 'showAfter'
    | 'showArrow'
    // | 'transition'
  >
>;

const defaultTooltipOptions: TextOverflowTooltipOptions = {
  effect: 'dark',
  enterable: true,
  showArrow: true,
  popperClass: 'text-popper',
};
const ns = 'el';

let removePopper: (() => void) | undefined;

function createTextPopper(
  parentNode: HTMLElement | undefined,
  trigger: HTMLElement,
  popperContent: string | null | undefined,
  tooltipOptions?: TextOverflowTooltipOptions,
) {
  if (!popperContent) {
    return;
  }
  if (!parentNode) {
    parentNode = document.querySelector('body')!;
  }

  tooltipOptions = merge(defaultTooltipOptions, tooltipOptions || {});

  const { nextZIndex } = useZIndex();

  function renderContent(): HTMLDivElement {
    const isLight = tooltipOptions!.effect === 'light';
    const content = document.createElement('div');
    content.className = [`${ns}-popper`, isLight ? 'is-light' : 'is-dark', tooltipOptions!.popperClass || ''].join(' ');
    popperContent = escapeHtml(popperContent);
    content.innerHTML = popperContent;
    content.style.zIndex = String(nextZIndex());
    // Avoid side effects caused by append to body
    parentNode?.appendChild(content);
    return content;
  }

  function renderArrow(): HTMLDivElement {
    const arrow = document.createElement('div');
    arrow.className = `${ns}-popper__arrow`;
    return arrow;
  }
  function showPopper() {
    popperInstance && popperInstance.update();
  }
  removePopper?.();
  removePopper = () => {
    try {
      popperInstance && popperInstance.destroy();
      content && parentNode?.removeChild(content);
      trigger.removeEventListener('mouseenter', onOpen);
      trigger.removeEventListener('mouseleave', onClose);
      removePopper = undefined;
    } catch (e) {
      // console.log(e);
    }
  };

  let popperInstance: any = null;
  let onOpen = showPopper;
  let onClose = removePopper;

  if (tooltipOptions.enterable) {
    ({ onOpen, onClose } = useDelayedToggle({
      showAfter: tooltipOptions.showAfter as any,
      hideAfter: tooltipOptions.hideAfter as any,
      autoClose: undefined as any,
      open: showPopper,
      close: removePopper,
    }));
  }

  const content = renderContent();
  content.onmouseenter = onOpen;
  content.onmouseleave = onClose;
  const modifiers: Array<Partial<Modifier<any, any>>> = [];
  if (tooltipOptions.offset) {
    modifiers.push({
      name: 'offset',
      options: {
        offset: [0, tooltipOptions.offset],
      },
    });
  }

  if (tooltipOptions.showArrow) {
    const arrow = content.appendChild(renderArrow());
    modifiers.push({
      name: 'arrow',
      options: {
        element: arrow,
        padding: 10,
      },
    });
  }

  const popperOptions = tooltipOptions.popperOptions || {};
  popperInstance = createPopper(trigger, content, {
    placement: tooltipOptions.placement || 'top',
    strategy: 'fixed',
    ...popperOptions,
    modifiers: Array.isArray(popperOptions.modifiers) ? modifiers.concat(popperOptions.modifiers) : modifiers,
  });
  trigger.addEventListener('mouseenter', onOpen);
  trigger.addEventListener('mouseleave', onClose);
  return popperInstance;
}

export default createTextPopper;
