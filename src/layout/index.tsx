import { computed, defineComponent, type CSSProperties } from 'vue';
import indexScss from './index.module.scss';
import musicIcon from '@/assets/images/icon.webp';
import { useMenuRender } from './useMenuRender';
import { useContentRender } from './useContentRender';
import { useMusicPlayerUI } from './useMusicPlayerUI';
import { initAnimationBg } from '@/views/AnimationBg';
import { initCoverUrl } from '@/pages/page-hook';

export default defineComponent({
  props: {},
  setup() {
    const { renderMenu } = useMenuRender();
    const { renderContent } = useContentRender();
    const { renderPlayerUI, playingMusic } = useMusicPlayerUI();
    const { abRender } = initAnimationBg();

    const { coverUrl } = initCoverUrl(playingMusic);

    const rootStyle = computed(() => {
      const style: CSSProperties = {};
      if (coverUrl.value) {
        style['--page-background'] = `url(${coverUrl.value})`;
        style['--music-list-item-light-color'] = 'transparent';
        style['--music-list-item-border-bottom-color'] = 'rgba(245, 244, 244, 0.6)';
      }
      return style;
    });

    return function () {
      return (
        <div class={indexScss.root} style={rootStyle.value}>
          <div class={indexScss['root-bg']} />
          {abRender()}
          <div class={indexScss['root-left']}>
            <div class={indexScss['root-left-icon']}>
              <img src={musicIcon} class={indexScss['root-left-icon-image']} />
              <div class={indexScss['root-left-icon-name']}>MY音乐</div>
            </div>
            {renderMenu()}
          </div>
          <div class={indexScss['root-right']}>
            {renderContent()}
            {renderPlayerUI()}
          </div>
        </div>
      );
    };
  },
});
