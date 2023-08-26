import { dialog, ipcMain, type IpcMainInvokeEvent, type OpenDialogOptions } from 'electron';
import { CHANNEL_KEYS } from './channel-keys';
import store from '../store';
import path from 'path';
import md5 from 'js-md5';
import fs from 'fs';
import { unitGetAudioDuration, unitGetMusicInfo } from '../unit';
import { handleReadLyricSync } from './lyric';
import { handleReadCoverSync } from './cover';

export default function initIpcMainHandle() {
  ipcMain.handle(CHANNEL_KEYS.OPEN_MUSIC_FILES, handleSelectMusicFiles);
  ipcMain.handle(CHANNEL_KEYS.STORE_SET, handleStoreSet);
  ipcMain.handle(CHANNEL_KEYS.STORE_GET, handleStoreGet);
  ipcMain.handle(CHANNEL_KEYS.STORE_DELETE, handleStoreDelete);
  ipcMain.handle(CHANNEL_KEYS.READ_FILE_SYNC, handleReadFileSync);
  ipcMain.handle(CHANNEL_KEYS.READ_LYRIC_SYNC, handleReadLyricSync);
  ipcMain.handle(CHANNEL_KEYS.READ_COVER_SYNC, handleReadCoverSync);
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
    const list = [];
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      const name = path.basename(filePath, path.extname(filePath));
      const info = unitGetMusicInfo(filePath);
      const duration = await unitGetAudioDuration(filePath);
      list.push({
        name,
        fullName: path.basename(filePath),
        path: filePath,
        id: md5(filePath),
        info,
        duration,
      });
    }
    return list;
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

/**
 * 删除存储
 * @param event
 * @param key
 * @returns
 */
function handleStoreDelete(event: IpcMainInvokeEvent, key: string) {
  if (!key || typeof key !== 'string') return;
  return store.delete(key);
}

/**
 * 读取文件
 * @param event
 * @param path
 * @returns
 */
function handleReadFileSync(event: IpcMainInvokeEvent, path: string) {
  if (!path || typeof path !== 'string') return;
  try {
    return fs.readFileSync(path, { encoding: 'base64' });
  } catch {
    return undefined;
  }
}
