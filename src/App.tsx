import { defineComponent, provide } from 'vue';
import zhCn from '@/locale/zh-cn';
// import en from '@/locale/en';
import { ElConfigProvider } from 'element-plus';
import { RouterView } from 'vue-router';
import { playerSymbol, type PlayerType } from './constant';
import { createMusicPlayer, initMusicData, renderMusicAudio } from './hooks/music-player-hook';

export default defineComponent({
  setup() {
    initMusicData(() => player);

    const { render: playerRender, audioRef, audioCtx } = renderMusicAudio(() => player);

    const player = createMusicPlayer(audioRef, audioCtx);

    provide<PlayerType>(playerSymbol, player);

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
