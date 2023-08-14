import { playerSymbol, type LocalMusicItem, type PlayerType } from '@/constant';
import { useAppStore } from '@/stores/app';
import { computed, inject, type Ref } from 'vue';
import rootClass from './index.module.scss';
import { ElLink } from 'element-plus';
import CommonIconVue from '@/components/CommonIcon.vue';
import { useRouter } from 'vue-router';

/**
 * 按钮方法
 */
export function initActionFunction(musicsRef: Ref<LocalMusicItem[]>) {
  const appStore = useAppStore();
  const player = inject<PlayerType>(playerSymbol);
  const playingMusic = computed(() => appStore.playingMusic);
  const sessionPlayingMusic = computed(() => appStore.sessionPlayingMusic);

  /**
   * 播放全部
   * 如果存在正在播放的音乐，则继续播放
   */
  function handlePlayAll() {
    if (!musicsRef.value.length || !player) return;
    if (playingMusic.value) {
      player.play();
      return;
    }
    const firstMusic = musicsRef.value[0];
    player.start(firstMusic);
  }

  /**
   * 停止播放
   */
  function handleStop() {
    player?.stop();
  }

  /**
   * 设置喜欢
   */
  function setLove(id?: string) {
    if (!id) return;
    appStore.setLoveMusicId(id);
  }

  /**
   * 播放按钮点击回调
   */
  function handlePlayMusic(item: LocalMusicItem) {
    if (!player) return;
    player.start(item);
  }

  return {
    player,
    playingMusic,
    sessionPlayingMusic,
    handlePlayAll,
    handleStop,
    setLove,
    handlePlayMusic,
  };
}

/**
 * 渲染后退按钮
 * @param delta
 * @returns
 */
export function useRouterBackRender(delta: number = -1) {
  const router = useRouter();

  function render() {
    return (
      <div class={rootClass['router-back']}>
        <ElLink underline={false} onClick={() => router.go(delta)} type="default">
          <CommonIconVue icon="icon-xiangxia" class="font24" />
        </ElLink>
      </div>
    );
  }

  return {
    routerBackRender: render,
  };
}
