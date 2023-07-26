import { playingMusicSessionKey, type LocalMusicItem, type PlayingMusicType } from '@/constant';
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
  function setLocalMusics(musics: LocalMusicItem[]) {
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

  return {
    localMusics,
    playingMusic,
    setLocalMusics,
    setPlayingMusic,
  };
});
