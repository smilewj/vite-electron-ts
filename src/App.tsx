import { defineComponent, provide } from 'vue';
import zhCn from '@/locale/zh-cn';
// import en from '@/locale/en';
import { ElConfigProvider } from 'element-plus';
import { RouterView } from 'vue-router';
import { playerPromiseSymbol, playerSymbol, type PlayerType, type PromisePlayerType } from './constant';
import { initMusicData, renderMusicAudio } from './hooks/music-player-hook';

export default defineComponent({
  setup() {
    const { render: playerRender, playerPromise, player } = renderMusicAudio();

    initMusicData(playerPromise);

    provide<PlayerType>(playerSymbol, player);
    provide<PromisePlayerType>(playerPromiseSymbol, playerPromise);

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
