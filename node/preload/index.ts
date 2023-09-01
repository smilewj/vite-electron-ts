import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import { CHANNEL_KEYS } from './channel-keys';

contextBridge.exposeInMainWorld('electronAPI', {
  selectMusicFiles: (...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.OPEN_MUSIC_FILES, ...args),
  storeSet: (...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.STORE_SET, ...args),
  storeGet: (key: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.STORE_GET, key, ...args),
  storeDelete: (key: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.STORE_DELETE, key, ...args),
  readFileSync: (path: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.READ_FILE_SYNC, path, ...args),
  readLyricSync: (path: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.READ_LYRIC_SYNC, path, ...args),
  readCoverSync: (path: string, ...args: any[]) => ipcRenderer.invoke(CHANNEL_KEYS.READ_COVER_SYNC, path, ...args),
  mediaNext: (callback: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('media-next-track', callback),
  mediaPlayPause: (callback: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('media-play-pause', callback),
  mediaPrevious: (callback: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('media-previous-track', callback),
});
