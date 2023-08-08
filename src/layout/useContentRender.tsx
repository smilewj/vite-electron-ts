import { RouterView } from 'vue-router';
import indexScss from './index.module.scss';

/**
 * 内容区域渲染
 */
export function useContentRender() {
  function render() {
    return (
      <div class={indexScss.content}>
        <RouterView />
      </div>
    );
  }

  return {
    renderContent: render,
  };
}
