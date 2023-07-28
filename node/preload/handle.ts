import { dialog, ipcMain, type IpcMainInvokeEvent, type OpenDialogOptions } from 'electron';
import { CHANNEL_KEYS } from './channel-keys';
import store from '../store';
import path from 'path';
import md5 from 'js-md5';
import fs from 'fs';

export default function initIpcMainHandle() {
  ipcMain.handle(CHANNEL_KEYS.OPEN_MUSIC_FILES, handleOpenMusicFiles);
  ipcMain.handle(CHANNEL_KEYS.STORE_SET, handleStoreSet);
  ipcMain.handle(CHANNEL_KEYS.STORE_GET, handleStoreGet);
  ipcMain.handle(CHANNEL_KEYS.READ_FILE_SYNC, handleReadFileSync);
}

/**
 * 选择音乐文件
 * @returns
 */
async function handleOpenMusicFiles() {
  const options: OpenDialogOptions = {
    properties: ['createDirectory', 'openFile', 'multiSelections'],
    filters: [{ extensions: ['mp3'], name: '选择音乐' }],
  };
  const { canceled, filePaths } = await dialog.showOpenDialog(options);
  if (!canceled) {
    return filePaths.map((filePath) => ({
      name: path.basename(filePath, path.extname(filePath)),
      path: filePath,
      id: md5(filePath),
    }));
  }
}

function handleStoreSet(event: IpcMainInvokeEvent, payload: { key: string; value: any }) {
  if (!payload) return;
  const { key, value } = payload;
  if (!key || typeof key !== 'string') return;
  store.set(key, value);
}

function handleStoreGet(event: IpcMainInvokeEvent, key: string) {
  if (!key || typeof key !== 'string') return;
  return store.get(key);
}

function handleReadFileSync(event: IpcMainInvokeEvent, path: string) {
  if (!path || typeof path !== 'string') return;
  return fs.readFileSync(path, { encoding: 'base64' });
}
