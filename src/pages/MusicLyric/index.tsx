import { computed, defineComponent, inject, onMounted, onUnmounted, ref, withDirectives } from 'vue';
import rootClass from '../index.module.scss';
import { initLyric, useRouterBackRender } from '../page-hook';
import { useAppStore } from '@/stores/app';
import { vLoading } from 'element-plus';
import { type PlayerType, playerSymbol } from '@/constant';
import { findCurrentLyricIndex } from '@/utils/func';

export default defineComponent({
  props: {},
  setup() {
    const { routerBackRender } = useRouterBackRender();

    const appStore = useAppStore();
    const playingMusic = computed(() => appStore.playingMusic);
    const { lyrics, loading } = initLyric(playingMusic);
    const player = inject<PlayerType>(playerSymbol);

    const currentIndex = ref<number | null>(0);

    function handleTimeupdate() {
      const currentTime = player?.elRef.value?.currentTime || 0;
      const ci = findCurrentLyricIndex(currentTime, lyrics.value);
      currentIndex.value = ci;
    }

    onMounted(() => {
      if (player?.elRef.value) {
        player.elRef.value.addEventListener('timeupdate', handleTimeupdate);
      }
    });

    onUnmounted(() => {
      if (player?.elRef.value) {
        player.elRef.value.removeEventListener('timeupdate', handleTimeupdate);
      }
    });

    return function () {
      return withDirectives(
        <div class={rootClass.lyric}>
          {routerBackRender()}
          <div class={rootClass['lyric-scroll']}>
            <div
              class={rootClass['lyric-scroll-box']}
              style={`transform: translateY(-${(currentIndex.value || 0) * 30}px);`}
            >
              <div class={rootClass['lyric-name']}>{playingMusic.value?.info.title || ''}</div>
              <div class={rootClass['lyric-artist']}>{playingMusic.value?.info.artist || ''}</div>
              {lyrics.value.map((it, index) => (
                <div
                  class={[rootClass['lyric-text'], index === currentIndex.value ? rootClass['lyric-text-active'] : '']}
                  data-time={it.time}
                >
                  {it.text}
                </div>
              ))}
            </div>
          </div>
        </div>,
        [[vLoading, loading.value]],
      );
    };
  },
});
