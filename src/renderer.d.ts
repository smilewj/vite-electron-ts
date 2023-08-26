import type { LocalMusicItem } from './constant';

export interface IElectronAPI {
  selectMusicFiles: () => Promise<LocalMusicItem[] | undefined>;
  storeSet: ({ key: string, value: any }) => Promise<void>;
  storeGet: <T>(key: string) => Promise<T>;
  storeDelete: (key: string) => Promise<void>;
  readFileSync: (path: string) => Promise<string | undefined>;
  readLyricSync: (music: LocalMusicItem) => Promise<string | undefined>;
  readCoverSync: (music: LocalMusicItem) => Promise<string | undefined>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
