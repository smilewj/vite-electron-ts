import { contextBridge, ipcRenderer } from 'electron';
import { CHANNEL_KEYS } from './channel-keys';

contextBridge.exposeInMainWorld('electronAPI', {
  selectMusicFiles: (...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.OPEN_MUSIC_FILES, ...args),
  storeSet: (...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.STORE_SET, ...args),
  storeGet: (key: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.STORE_GET, key, ...args),
  storeDelete: (key: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.STORE_DELETE, key, ...args),
  readFileSync: (path: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.READ_FILE_SYNC, path, ...args),
});
