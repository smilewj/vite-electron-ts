import indexScss from './index.module.scss';

export function useTitlebar() {
  function render() {
    return <div class={indexScss['root-titlebar']}></div>;
  }

  return {
    titlebarRender: render,
  };
}
