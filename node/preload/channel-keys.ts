/** 定义通道key */
export enum CHANNEL_KEYS {
  /** 选择音乐文件 */
  OPEN_MUSIC_FILES = 'dialog:selectMusicFiles',
  /** store 保存数据 */
  STORE_SET = 'store:set',
  /** store 获取数据 */
  STORE_GET = 'store:get',
  /** store 删除数据 */
  STORE_DELETE = 'store:delete',
  /** 读取文件 */
  READ_FILE_SYNC = 'node:readFileSync',
  /** 读取歌词 */
  READ_LYRIC_SYNC = 'node:readLyricSync',
  /** 获取封面图片 */
  READ_COVER_SYNC = 'node:readCoverSync',
}
