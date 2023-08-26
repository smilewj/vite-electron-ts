import { playerSymbol, type LyricItemType, type PlayerType, type PlayingMusicType } from '@/constant';
import { useAppStore } from '@/stores/app';
import { computed, inject, ref, watchEffect, type Ref } from 'vue';
import rootClass from './index.module.scss';
import { ElLink } from 'element-plus';
import CommonIconVue from '@/components/CommonIcon.vue';
import { useRouter } from 'vue-router';
import type { LocalMusicItem } from '@/constant-node';
import { parseLyrics } from '@/utils/func';

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
export function useRouterBackRender(delta: number = -1, isBlack = false) {
  const router = useRouter();

  function render() {
    return (
      <div class={[rootClass['router-back'], isBlack ? rootClass['router-back-black'] : '']}>
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

/**
 * 获取歌词列表
 * @param musicRef
 * @returns
 */
export function initLyric(musicRef: Ref<LocalMusicItem | PlayingMusicType | undefined>) {
  const [lyrics, loading] = [ref<LyricItemType[]>([]), ref(false)];
  async function loadData() {
    try {
      loading.value = true;
      if (!musicRef.value) {
        throw '暂无播放的歌曲';
      }
      const lyricStr = await window.electronAPI.readLyricSync(musicRef.value);
      if (lyricStr) {
        lyrics.value = parseLyrics(lyricStr);
      }
    } catch {
      lyrics.value = [];
    } finally {
      loading.value = false;
    }
  }

  watchEffect(loadData);

  return {
    lyrics,
    loading,
  };
}
/**
 * 获取歌曲封面
 * @param musicRef
 * @returns
 */
export function initCoverUrl(musicRef: Ref<LocalMusicItem | PlayingMusicType | undefined>) {
  const [coverUrl, loading] = [ref<string>(), ref(false)];
  async function loadData() {
    try {
      loading.value = true;
      if (!musicRef.value) {
        throw '暂无播放的歌曲';
      }
      coverUrl.value = await window.electronAPI.readCoverSync(musicRef.value);
    } catch {
      coverUrl.value = undefined;
    } finally {
      loading.value = false;
    }
  }

  watchEffect(loadData);

  return {
    coverUrl,
    loading,
  };
}
