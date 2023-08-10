import type { Ref } from 'vue';

/**
 * 存储在本地文件中的音乐信息的key
 */
export const musicsElectronStoreKey = 'MUSICS_STORE';

/**
 * 存储在session中播放中的音乐的key
 */
export const playingMusicSessionKey = 'MUSIC_PLAYING';

/**
 * 存储在本地文件中的喜欢的音乐信息的key
 */
export const loveElectronStoreKey = 'MUSICS_LOVE';

/**
 * 存储在本地文件中的音乐信息
 */
export type LocalMusicItem = {
  /** id */
  id: string;
  /** 名称 */
  name: string;
  /** 名称带后缀 */
  fullName: string;
  /** 文件路径 */
  path: string;
  /** 封面 */
  cover?: string;
};

/**
 * 播放中的音乐
 */
export type PlayingMusicType = LocalMusicItem & {
  /** 当前播放时间（秒） */
  current: number;
  /** 总时间（秒） */
  duration: number;
  /** 播放状态 */
  status: boolean;
  /** 播放音量 */
  volume: number;
};

/**
 * 音乐播放器 key
 */
export const playerSymbol = Symbol('player');

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
};

/**
 * audio 分线器
 */
export type AudioCtxType = {
  ctx: AudioContext | undefined; // 音频分析处理器节点
  analyser: AnalyserNode | undefined; // 音频分析处理器节点
  buffer: Uint8Array | undefined; // 音频分析数据
};
