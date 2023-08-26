import {
  PlayOrderEnum,
  type AudioCtxType,
  type PlayerType,
  type PlayingMusicType,
  type PromisePlayerType,
  type SessionPlayingMusicType,
} from '@/constant';
import { useAppStore } from '@/stores/app';
import { computed, nextTick, onMounted, ref, type Ref } from 'vue';
import debMessage from './deb-message';
import { useRoute } from 'vue-router';
import type { LocalMusicItem } from '@/constant-node';
import { getRandomNumber } from '@/utils/func';

/**
 * 初始化歌曲数据
 */
export function initMusicData(playerPromise: PromisePlayerType) {
  const appStore = useAppStore();

  function init() {
    appStore.getElectronPlayOrder();
    appStore.getLocalMusics();
    appStore.getLoveMusics();
    appStore.getPlayingMusic().then(async (playingMusic) => {
      if (!playingMusic) return;
      const player = await playerPromise;
      player.initPlaying();
    });
  }

  init();
}

/**
 * 渲染播放
 * @returns
 */
export function renderMusicAudio() {
  let playerResolve: (value: PlayerType | PromiseLike<PlayerType>) => void;
  const audioRef = ref<HTMLMediaElement | undefined>();
  const audioCtx: AudioCtxType = {
    ctx: undefined,
    analyser: undefined,
    buffer: undefined,
  };

  const { handleTimeupdate, handleVolumechange, handleEnded, handlePause, handlePlay } =
    createMusicEventListener(audioRef);

  const controlsFunHandle = createMusicControlsPlayer(audioRef);

  const player: PlayerType = {
    ...controlsFunHandle,
    audioCtx,
    elRef: audioRef,
  };

  const playerPromise = new Promise<PlayerType>((resolve) => {
    playerResolve = resolve;
  });

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

  onMounted(async () => {
    await nextTick();
    initAutoAnalyser();
    controlsFunHandle.initPlaying();
    if (playerResolve) {
      playerResolve(player);
    }
  });

  function render() {
    return (
      <audio
        style="display: none"
        ref={audioRef}
        onTimeupdate={() => handleTimeupdate()}
        onEnded={() =>
          handleEnded(() => {
            controlsFunHandle.next();
          })
        }
        onPause={() => handlePause()}
        onPlay={() => handlePlay()}
        onVolumechange={() => handleVolumechange()}
      />
    );
  }

  return { render, playerPromise, player };
}

/**
 * 生成播放器控制方法
 * @param audioRef
 */
function createMusicControlsPlayer(audioRef: Ref<HTMLMediaElement | undefined>) {
  const appStore = useAppStore();

  const playingMusic = computed(() => appStore.playingMusic);
  const sessionPlayingMusic = computed(() => appStore.sessionPlayingMusic);
  const playOrder = computed(() => appStore.playOrder);

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
    let nextIndex: number = currentIndex;
    if (playOrder.value === PlayOrderEnum.顺序) {
      nextIndex = currentIndex + 1;
      if (nextIndex >= currentMusics.value.length) {
        nextIndex = 0;
      }
    }
    if (playOrder.value === PlayOrderEnum.随机) {
      nextIndex = getRandomNumber(0, currentMusics.value.length, currentIndex);
    }
    if (playOrder.value === PlayOrderEnum.单曲) {
      nextIndex = currentIndex;
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

    let prevIndex: number = currentIndex;
    if (playOrder.value === PlayOrderEnum.顺序) {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = currentMusics.value.length - 1;
      }
    }
    if (playOrder.value === PlayOrderEnum.随机) {
      prevIndex = getRandomNumber(0, currentMusics.value.length, currentIndex);
    }
    if (playOrder.value === PlayOrderEnum.单曲) {
      prevIndex = currentIndex;
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

  return {
    start: startPlayMusic,
    pause: pauseMusic,
    play: playMusic,
    stop: stopPlay,
    volume: setVolume,
    next: playNextMusic,
    prev: playPrevMusic,
    initPlaying: loadMusicDataPlay,
  };
}

/**
 * 生成播放器事件回调函数
 * @param audioRef
 * @returns
 */
function createMusicEventListener(audioRef: Ref<HTMLMediaElement | undefined>) {
  const appStore = useAppStore();
  const sessionPlayingMusic = computed(() => appStore.sessionPlayingMusic);
  const playingMusic = computed(() => appStore.playingMusic);

  /**
   * 更新音乐播放的进度
   */
  function handleTimeupdate(callback?: Function) {
    const pm: SessionPlayingMusicType = {
      ...sessionPlayingMusic.value!,
      current: audioRef.value!.currentTime,
    };
    appStore.setSessionPlayingMusic(pm);
    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  /**
   * 更新音乐的播放音量
   */
  function handleVolumechange(callback?: Function) {
    const pm: PlayingMusicType = {
      ...playingMusic.value!,
      volume: audioRef.value!.volume,
    };
    appStore.setPlayingMusic(pm);
    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  /**
   * 播放结束回调
   */
  function handleEnded(callback?: Function) {
    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  /**
   * 暂停回调
   */
  function handlePause(callback?: Function) {
    const pmSession: SessionPlayingMusicType = {
      ...sessionPlayingMusic.value!,
      status: false,
    };
    appStore.setSessionPlayingMusic(pmSession);
    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  /**
   * 播放回调
   */
  function handlePlay(callback?: Function) {
    const pm: PlayingMusicType = {
      ...playingMusic.value!,
    };
    const pmSession: SessionPlayingMusicType = {
      ...sessionPlayingMusic.value!,
      status: true,
    };
    appStore.setPlayingMusic(pm);
    appStore.setSessionPlayingMusic(pmSession);
    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  return {
    handleTimeupdate,
    handleVolumechange,
    handleEnded,
    handlePause,
    handlePlay,
  };
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
