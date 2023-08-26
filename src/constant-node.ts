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
  /** 信息 */
  info: {
    /** 作者 */
    artist: string | undefined;
    /** 歌曲名称 */
    title: string | undefined;
  };
  /** 总时长 */
  duration?: number;
  /** 封面 */
  cover?: string;
};
