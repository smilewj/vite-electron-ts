import { dialog, ipcMain, type IpcMainInvokeEvent, type OpenDialogOptions } from 'electron';
import { CHANNEL_KEYS } from './channel-keys';
import store from '../store';
import path from 'path';
import md5 from 'js-md5';
import fs from 'fs';
import ID3, { type Tags } from 'node-id3';

export default function initIpcMainHandle() {
  ipcMain.handle(CHANNEL_KEYS.OPEN_MUSIC_FILES, handleSelectMusicFiles);
  ipcMain.handle(CHANNEL_KEYS.STORE_SET, handleStoreSet);
  ipcMain.handle(CHANNEL_KEYS.STORE_GET, handleStoreGet);
  ipcMain.handle(CHANNEL_KEYS.READ_FILE_SYNC, handleReadFileSync);
}

/**
 * 选择音乐文件
 * @returns
 */
async function handleSelectMusicFiles() {
  const extensions = ['mp3', 'flac', 'aac', 'ogg', 'wav', 'wma'];
  const options: OpenDialogOptions = {
    properties: ['createDirectory', 'openFile', 'multiSelections'],
    filters: [{ extensions, name: '选择音乐' }],
  };
  const { canceled, filePaths } = await dialog.showOpenDialog(options);
  if (!canceled) {
    return filePaths.map((filePath) => {
      const tags = ID3.read(filePath);
      const cover = unitGetMusicCover(tags);
      return {
        name: path.basename(filePath, path.extname(filePath)),
        fullName: path.basename(filePath),
        path: filePath,
        id: md5(filePath),
        cover,
      };
    });
  }
}

/**
 * 设置存储
 * @param event
 * @param payload
 * @returns
 */
function handleStoreSet(event: IpcMainInvokeEvent, payload: { key: string; value: any }) {
  if (!payload) return;
  const { key, value } = payload;
  if (!key || typeof key !== 'string') return;
  store.set(key, value);
}

/**
 * 读取存储
 * @param event
 * @param key
 * @returns
 */
function handleStoreGet(event: IpcMainInvokeEvent, key: string) {
  if (!key || typeof key !== 'string') return;
  return store.get(key);
}

function handleReadFileSync(event: IpcMainInvokeEvent, path: string) {
  if (!path || typeof path !== 'string') return;
  try {
    return fs.readFileSync(path, { encoding: 'base64' });
  } catch {
    return undefined;
  }
}

/**
 * 获取歌曲封面图
 * @param tags
 * @returns
 */
function unitGetMusicCover(tags: Tags) {
  try {
    const { image } = tags;
    if (!image) return;
    if (typeof image === 'string') {
      return image;
    }
    const { mime = 'image/jpeg', imageBuffer } = image;
    if (!imageBuffer) return;
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    return `data:${mime};base64,${base64Image}`;
  } catch {
    return undefined;
  }
}
