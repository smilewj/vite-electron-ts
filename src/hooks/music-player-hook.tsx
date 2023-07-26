import type { LocalMusicItem, PlayerType } from '@/constant';
import { useAppStore } from '@/stores/app';
import { computed, nextTick, onMounted, ref, type Ref } from 'vue';

/**
 * 渲染播放
 * @returns
 */
export function renderMusicAudio(getPlayer: () => PlayerType) {
  const audioRef = ref<HTMLMediaElement | undefined>();
  const appStore = useAppStore();

  const localMusics = computed(() => appStore.localMusics);
  const playingMusic = computed(() => appStore.playingMusic);

  /**
   * 更新音乐播放的进度
   */
  function handleTimeupdate() {
    const pm = { ...playingMusic.value!, current: audioRef.value!.currentTime };
    appStore.setPlayingMusic(pm);
  }

  /**
   * 播放结束回调
   */
  function handleEnded() {
    playNextMusic();
  }

  /**
   * 暂停回调
   */
  function handlePause() {
    const pm = { ...playingMusic.value!, status: false };
    appStore.setPlayingMusic(pm);
  }

  /**
   * 播放回调
   */
  function handlePlay() {
    const pm = { ...playingMusic.value!, status: true };
    appStore.setPlayingMusic(pm);
  }

  /**
   * 下一首
   */
  function playNextMusic() {
    const currentIndex = localMusics.value.findIndex((it) => it.id === playingMusic.value?.id);
    if (currentIndex === -1) {
      appStore.setPlayingMusic();
      return;
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex >= localMusics.value.length) {
      appStore.setPlayingMusic();
      return;
    }
    const nextMusic = localMusics.value[nextIndex];
    const player = getPlayer();
    player.start(nextMusic);
  }

  function render() {
    return (
      <audio
        style="display: none"
        ref={audioRef}
        onTimeupdate={handleTimeupdate}
        onEnded={handleEnded}
        onPause={handlePause}
        onPlay={handlePlay}
      />
    );
  }

  return { render, audioRef };
}

/**
 * 生成播放器控制方法
 * @param audioRef
 */
export function createMusicPlayer(audioRef: Ref<HTMLMediaElement | undefined>) {
  const appStore = useAppStore();

  const playingMusic = computed(() => appStore.playingMusic);

  /**
   * 开始播放音乐
   */
  function startPlayMusic(data: LocalMusicItem) {
    const pm = { ...data, current: 0, status: true };
    appStore.setPlayingMusic(pm);
    loadMusicDataPlay();
  }

  /**
   * 加载音乐数据，并播放音乐
   */
  async function loadMusicDataPlay() {
    await nextTick();
    if (!audioRef.value || !playingMusic.value) return;
    const { path, current: currentTime, status } = playingMusic.value;
    const musicData = await window.electronAPI.readFileSync(path);
    audioRef.value.setAttribute('src', `data:audio/mp3;base64,${musicData}`);
    audioRef.value.currentTime = currentTime;
    if (status) {
      audioRef.value.play();
    }
  }

  /**
   * 开始播放
   */
  function playMusic() {
    if (!audioRef.value) return;
    audioRef.value.play();
  }

  /**
   * 暂停播放
   */
  function pauseMusic() {
    if (!audioRef.value) return;
    audioRef.value.pause();
  }

  onMounted(loadMusicDataPlay);

  const player: PlayerType = {
    start: startPlayMusic,
    pause: pauseMusic,
    play: playMusic,
  };

  return player;
}
