import { playingMusicSessionKey, type LocalMusicItem, type PlayingMusicType, musicsElectronStoreKey } from '@/constant';
import storage from '@/utils/storage';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const sessionPlayingMusic = storage.getSession<PlayingMusicType>(playingMusicSessionKey);

export const useAppStore = defineStore('app', () => {
  /** 音乐列表 */
  const localMusics = ref<LocalMusicItem[]>([]);
  /** 正在播放的音乐 */
  const playingMusic = ref<PlayingMusicType | undefined>(sessionPlayingMusic);

  /**
   * 设置音乐列表
   * @param musics
   */
  async function setLocalMusics(musics: LocalMusicItem[]) {
    await window.electronAPI.storeSet({ key: musicsElectronStoreKey, value: musics });
    localMusics.value = musics;
  }

  /**
   * 设置播放的音乐
   * @param music
   */
  function setPlayingMusic(music?: PlayingMusicType) {
    playingMusic.value = music;
    if (music) {
      storage.setSession<PlayingMusicType>(playingMusicSessionKey, music);
    } else {
      storage.removeSession(playingMusicSessionKey);
    }
  }

  /**
   * 读取本地音乐列表
   */
  async function getLocalMusics() {
    const localMusics = await window.electronAPI.storeGet<LocalMusicItem[] | undefined>(musicsElectronStoreKey);
    setLocalMusics(localMusics || []);
  }

  /**
   * 删除本地音乐
   * @param id
   */
  async function deleteLocalMusicById(id: string) {
    const localMusics = (await window.electronAPI.storeGet<LocalMusicItem[] | undefined>(musicsElectronStoreKey)) || [];
    const filterLocalMusics = localMusics.filter((it) => it.id !== id);
    setLocalMusics(filterLocalMusics);
  }

  return {
    localMusics,
    playingMusic,
    setLocalMusics,
    setPlayingMusic,
    getLocalMusics,
    deleteLocalMusicById,
  };
});
