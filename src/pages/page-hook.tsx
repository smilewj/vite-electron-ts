import { playerSymbol, type LocalMusicItem, type PlayerType } from '@/constant';
import { useAppStore } from '@/stores/app';
import { computed, inject, type Ref } from 'vue';

/**
 * 按钮方法
 */
export function initActionFunction(musicsRef: Ref<LocalMusicItem[]>) {
  const appStore = useAppStore();
  const player = inject<PlayerType>(playerSymbol);
  const playingMusic = computed(() => appStore.playingMusic);

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
    handlePlayAll,
    handleStop,
    setLove,
    handlePlayMusic,
  };
}
