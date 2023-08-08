import type { LocalMusicItem } from './constant';

export interface IElectronAPI {
  selectMusicFiles: () => Promise<LocalMusicItem[] | undefined>;
  storeSet: ({ key: string, value: any }) => Promise<void>;
  storeGet: <T>(key: string) => Promise<T>;
  readFileSync: (path: string) => Promise<string | undefined>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
