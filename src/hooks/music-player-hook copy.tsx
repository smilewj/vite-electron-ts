import type { AudioCtxType, PlayerType, PlayingMusicType, SessionPlayingMusicType } from '@/constant';
import { useAppStore } from '@/stores/app';
import { computed, nextTick, onMounted, ref, type Ref } from 'vue';
import debMessage from './deb-message';
import { useRoute } from 'vue-router';
import type { LocalMusicItem } from '@/constant-node';

/**
 * 初始化歌曲数据
 */
export function initMusicData(getPlayer: () => PlayerType) {
  const appStore = useAppStore();

  function init() {
    appStore.getLocalMusics();
    appStore.getLoveMusics();
    appStore.getPlayingMusic().then((playingMusic) => {
      const player = getPlayer();
      if (!player || !playingMusic) return;
      player.initPlaying();
    });
  }

  init();
}

/**
 * 渲染播放
 * @returns
 */
export function renderMusicAudio(getPlayer: () => PlayerType) {
  const audioRef = ref<HTMLMediaElement | undefined>();
  const appStore = useAppStore();
  const audioCtx: AudioCtxType = {
    ctx: undefined,
    analyser: undefined,
    buffer: undefined,
  };

  const playingMusic = computed(() => appStore.playingMusic);
  const sessionPlayingMusic = computed(() => appStore.sessionPlayingMusic);

  /**
   * 更新音乐播放的进度
   */
  function handleTimeupdate() {
    const pm: SessionPlayingMusicType = {
      ...sessionPlayingMusic.value!,
      current: audioRef.value!.currentTime,
    };
    appStore.setSessionPlayingMusic(pm);
  }

  /**
   * 更新音乐的播放音量
   */
  function handleVolumechange() {
    const pm: PlayingMusicType = {
      ...playingMusic.value!,
      volume: audioRef.value!.volume,
    };
    appStore.setPlayingMusic(pm);
  }

  /**
   * 播放结束回调
   */
  function handleEnded() {
    const player = getPlayer();
    player.next();
  }

  /**
   * 暂停回调
   */
  function handlePause() {
    const pmSession: SessionPlayingMusicType = {
      ...sessionPlayingMusic.value!,
      status: false,
    };
    appStore.setSessionPlayingMusic(pmSession);
  }

  /**
   * 播放回调
   */
  function handlePlay() {
    const pm: PlayingMusicType = {
      ...playingMusic.value!,
    };
    const pmSession: SessionPlayingMusicType = {
      ...sessionPlayingMusic.value!,
      status: true,
    };
    appStore.setPlayingMusic(pm);
    appStore.setSessionPlayingMusic(pmSession);
    initAutoAnalyser();
  }

  /**
   * 初始化音频分析处理器节点
   */
  function initAutoAnalyser() {
    if (audioCtx.analyser) {
      return;
    }
    audioCtx.ctx = new AudioContext();
    audioCtx.analyser = audioCtx.ctx.createAnalyser();
    audioCtx.analyser.fftSize = 512;
    audioCtx.buffer = new Uint8Array(audioCtx.analyser.frequencyBinCount);
    const source = audioCtx.ctx.createMediaElementSource(audioRef.value!);
    source.connect(audioCtx.analyser);
    audioCtx.analyser.connect(audioCtx.ctx.destination);
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
        onVolumechange={handleVolumechange}
      />
    );
  }

  return { render, audioRef, audioCtx };
}

/**
 * 生成播放器控制方法
 * @param audioRef
 */
export function createMusicPlayer(audioRef: Ref<HTMLMediaElement | undefined>, audioCtx: AudioCtxType) {
  const appStore = useAppStore();

  const playingMusic = computed(() => appStore.playingMusic);
  const sessionPlayingMusic = computed(() => appStore.sessionPlayingMusic);

  const route = useRoute();
  // 当前的播放列表
  const currentMusics = computed(() => {
    const curName = route.name;
    let list;
    switch (curName) {
      case '本地歌曲':
        list = appStore.localMusics;
        break;
      case '我喜欢':
        list = appStore.loveMusics;
        break;
      default:
        list = appStore.localMusics;
        break;
    }
    return list;
  });

  /**
   * 开始播放音乐
   */
  async function startPlayMusic(data: LocalMusicItem) {
    await stopPlay();
    const pm: PlayingMusicType = {
      ...data,
      volume: 1,
    };
    const pmSession: SessionPlayingMusicType = {
      ...data,
      status: true,
      current: 0,
    };
    appStore.setSessionPlayingMusic(pmSession);
    await appStore.setPlayingMusic(pm);
    loadMusicDataPlay();
  }

  /**
   * 加载音乐数据，并播放音乐
   */
  async function loadMusicDataPlay() {
    await nextTick();
    if (!audioRef.value || !playingMusic.value) return;
    const { path, name, id, volume = 1 } = playingMusic.value;
    if (!path) return;
    const musicData = await window.electronAPI.readFileSync(path);
    // 音乐数据加载失败时
    if (!musicData) {
      debMessage({ message: `${name} 文件失效，自动播放下一首`, type: 'error' });
      playNextMusic();
      appStore.deleteLocalMusicById(id);
      return;
    }
    audioRef.value.setAttribute('src', `data:audio/mpeg;base64,${musicData}`);
    audioRef.value.volume = volume;

    // 根据 session 中的状态，恢复播放器
    if (!sessionPlayingMusic.value) {
      const { id, name, fullName, path, info, duration } = playingMusic.value;
      const data = { id, name, fullName, path, info, duration };
      const pmSession: SessionPlayingMusicType = {
        ...data,
        status: false,
        current: 0,
      };
      appStore.setSessionPlayingMusic(pmSession);
      return;
    }
    const { current: currentTime, status } = sessionPlayingMusic.value;
    audioRef.value.currentTime = currentTime;
    if (status) {
      audioRef.value.play();
    }
  }

  /**
   * 播放
   */
  function playMusic() {
    if (!audioRef.value) return;
    if (playingMusic.value) {
      audioRef.value.play();
      return;
    }
  }

  /**
   * 暂停
   */
  function pauseMusic() {
    if (!audioRef.value) return;
    audioRef.value.pause();
  }

  /**
   * 设置音量
   */
  function setVolume(volume: number) {
    if (!audioRef.value) return;
    audioRef.value.volume = volume;
  }

  /**
   * 下一首
   */
  function playNextMusic() {
    const currentIndex = currentMusics.value.findIndex((it) => it.id === playingMusic.value?.id);
    if (currentIndex === -1) {
      stopPlay();
      return;
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex >= currentMusics.value.length) {
      stopPlay();
      return;
    }
    const nextMusic = currentMusics.value[nextIndex];
    startPlayMusic(nextMusic);
  }

  /**
   * 上一首
   */
  function playPrevMusic() {
    const currentIndex = currentMusics.value.findIndex((it) => it.id === playingMusic.value?.id);
    if (currentIndex === -1) {
      stopPlay();
      return;
    }
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      stopPlay();
      return;
    }
    const prevMusic = currentMusics.value[prevIndex];
    startPlayMusic(prevMusic);
  }

  /**
   * 停止播放
   */
  async function stopPlay() {
    await nextTick();
    if (!audioRef.value) return;
    audioRef.value.pause();
    audioRef.value.removeAttribute('src');
    await unitBlock(200);
    appStore.setPlayingMusic();
    appStore.setSessionPlayingMusic();
  }

  onMounted(loadMusicDataPlay);

  const player: PlayerType = {
    audioCtx,
    start: startPlayMusic,
    pause: pauseMusic,
    play: playMusic,
    stop: stopPlay,
    volume: setVolume,
    next: playNextMusic,
    prev: playPrevMusic,
    elRef: audioRef,
    initPlaying: loadMusicDataPlay,
  };

  return player;
}

/**
 * 延时 timeout 毫秒
 * @param timeout
 * @returns
 */
function unitBlock(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), timeout);
  });
}
