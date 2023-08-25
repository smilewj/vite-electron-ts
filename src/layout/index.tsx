import { defineComponent } from 'vue';
import indexScss from './index.module.scss';
import musicIcon from '@/assets/images/icon.webp';
import { useMenuRender } from './useMenuRender';
import { useContentRender } from './useContentRender';
import { useMusicPlayerUI } from './useMusicPlayerUI';
import { initAnimationBg } from '@/views/AnimationBg';

export default defineComponent({
  props: {},
  setup() {
    const { renderMenu } = useMenuRender();
    const { renderContent } = useContentRender();
    const { renderPlayerUI } = useMusicPlayerUI();
    const { abRender } = initAnimationBg();

    return function () {
      return (
        <div class={indexScss.root}>
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
