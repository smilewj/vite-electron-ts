import type { LocalMusicItem } from './constant';
import { type IpcRendererEvent } from 'electron';

export interface IElectronAPI {
  selectMusicFiles: () => Promise<LocalMusicItem[] | undefined>;
  storeSet: ({ key: string, value: any }) => Promise<void>;
  storeGet: <T>(key: string) => Promise<T>;
  storeDelete: (key: string) => Promise<void>;
  readFileSync: (path: string) => Promise<string | undefined>;
  readLyricSync: (music: LocalMusicItem) => Promise<string | undefined>;
  readCoverSync: (music: LocalMusicItem) => Promise<string | undefined>;
  mediaNext: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  mediaPlayPause: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  mediaPrevious: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
