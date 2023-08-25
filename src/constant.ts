import type { Ref } from 'vue';
import type { LocalMusicItem } from './constant-node';

/**
 * 存储在本地文件中的音乐信息的key
 */
export const musicsElectronStoreKey = 'MUSICS_STORE';

/**
 * 存储在本地文件中播放中的音乐的key
 */
export const playingMusicElectronStoreKey = 'MUSIC_PLAYING';

/**
 * 存储在本地文件中播放中的音乐的key
 */
export const playingMusicSessionKey = 'SESSION_MUSIC_PLAYING';

/**
 * 存储在本地文件中的喜欢的音乐信息的key
 */
export const loveElectronStoreKey = 'MUSICS_LOVE';

/**
 * 播放中的音乐
 */
export type PlayingMusicType = LocalMusicItem & {
  /** 播放音量 */
  volume: number;
};

/**
 * session 播放中的音乐
 */
export type SessionPlayingMusicType = LocalMusicItem & {
  /** 当前播放时间（秒） */
  current: number;
  /** 播放状态 */
  status: boolean;
};

/**
 * 音乐播放器 key
 */
export const playerSymbol = Symbol('player');
export const playerPromiseSymbol = Symbol('player-promise');

/**
 * 音乐播放器
 */
export type PlayerType = {
  /**
   * 音频分析器
   */
  audioCtx: AudioCtxType;
  /**
   * 开始播放一个新的音乐
   * @param data 音乐数据
   */
  start: (data: LocalMusicItem) => void;
  /**
   * 暂停
   */
  pause: () => void;
  /**
   * 播放
   */
  play: () => void;
  /**
   * 停止
   */
  stop: () => void;
  /**
   * 设置音量
   */
  volume: (volume: number) => void;
  /**
   * 下一首
   */
  next: () => void;
  /**
   * 上一首
   */
  prev: () => void;
  elRef: Ref<HTMLMediaElement | undefined>;

  initPlaying: () => Promise<void>;
};

export type PromisePlayerType = Promise<PlayerType>;

/**
 * audio 分线器
 */
export type AudioCtxType = {
  ctx: AudioContext | undefined; // 音频分析处理器节点
  analyser: AnalyserNode | undefined; // 音频分析处理器节点
  buffer: Uint8Array | undefined; // 音频分析数据
};

/**
 * 歌词
 */
export type LyricItemType = {
  time: number;
  text: string;
};
