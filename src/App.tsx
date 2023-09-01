import { computed, defineComponent, onMounted, provide } from 'vue';
import zhCn from '@/locale/zh-cn';
// import en from '@/locale/en';
import { ElConfigProvider } from 'element-plus';
import { RouterView } from 'vue-router';
import { playerPromiseSymbol, playerSymbol, type PlayerType, type PromisePlayerType } from './constant';
import { initMusicData, renderMusicAudio } from './hooks/music-player-hook';
import { useAppStore } from './stores/app';

export default defineComponent({
  setup() {
    const { render: playerRender, playerPromise, player } = renderMusicAudio();

    initMusicData(playerPromise);

    provide<PlayerType>(playerSymbol, player);
    provide<PromisePlayerType>(playerPromiseSymbol, playerPromise);

    const appStore = useAppStore();
    const sessionPlayingMusic = computed(() => appStore.sessionPlayingMusic);
    const playStatus = computed(() => sessionPlayingMusic.value?.status);

    onMounted(() => {
      // 快捷键-下一首
      window.electronAPI.mediaNext(async () => {
        const player = await playerPromise;
        player.next();
      });
      // 快捷键-播放/暂停
      window.electronAPI.mediaPlayPause(async () => {
        const player = await playerPromise;
        if (playStatus.value) {
          player.pause();
        } else {
          player.play();
        }
      });
      // 快捷键-上一首
      window.electronAPI.mediaPrevious(async () => {
        const player = await playerPromise;
        player.prev();
      });
    });

    return function () {
      return (
        <ElConfigProvider locale={zhCn}>
          <RouterView />
          {playerRender()}
        </ElConfigProvider>
      );
    };
  },
});
