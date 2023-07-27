import type { Ref } from 'vue';

/**
 * 存储在本地文件中的音乐信息的key
 */
export const musicsElectronStoreKey = 'MUSICS_STORE';

/**
 * 存储在本地文件中的音乐信息
 */
export type LocalMusicItem = { id: string; name: string; path: string };

/**
 * 存储在session中播放中的音乐的key
 */
export const playingMusicSessionKey = 'MUSIC_PLAYING';

/**
 * 播放中的音乐
 */
export type PlayingMusicType = LocalMusicItem & {
  /** 当前播放时间 */
  current: number;
  /** 播放状态 */
  status: boolean;
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
  elRef: Ref<HTMLMediaElement | undefined>;
};
