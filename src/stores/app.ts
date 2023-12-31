import {
  playingMusicElectronStoreKey,
  type PlayingMusicType,
  musicsElectronStoreKey,
  loveElectronStoreKey,
  type SessionPlayingMusicType,
  playingMusicSessionKey,
  PlayOrderEnum,
  playOrderElectronKey,
} from '@/constant';
import type { LocalMusicItem } from '@/constant-node';
import storage from '@/utils/storage';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';

const localSessionPlayingMusic = storage.getSession<SessionPlayingMusicType>(playingMusicSessionKey);

export const useAppStore = defineStore('app', () => {
  /** 音乐列表 */
  const localMusics = shallowRef<LocalMusicItem[]>([]);
  /** 正在播放的音乐 */
  const playingMusic = shallowRef<PlayingMusicType | undefined>();
  /** session 正在播放的音乐 */
  const sessionPlayingMusic = shallowRef<SessionPlayingMusicType | undefined>(localSessionPlayingMusic);
  /** 本地我喜欢的音乐ID */
  const loveMusicIds = ref<string[]>([]);
  /** 我喜欢的音乐列表 */
  const loveMusics = computed(() => localMusics.value.filter((it) => loveMusicIds.value.includes(it.id)));
  /** 播放顺序 */
  const playOrder = ref<PlayOrderEnum>(PlayOrderEnum.顺序);

  /**
   * 设置音乐列表
   * @param musics
   */
  async function setLocalMusics(musics: LocalMusicItem[]) {
    await window.electronAPI.storeSet({ key: musicsElectronStoreKey, value: musics });
    localMusics.value = musics;
  }

  /**
   * 读取本地音乐列表
   */
  async function getLocalMusics() {
    const localMusics = await window.electronAPI.storeGet<LocalMusicItem[] | undefined>(musicsElectronStoreKey);
    setLocalMusics(localMusics || []);
    return localMusics;
  }

  /**
   * 设置本地播放的音乐
   * @param music
   */
  async function setPlayingMusic(music?: PlayingMusicType) {
    if (music) {
      await window.electronAPI.storeSet({ key: playingMusicElectronStoreKey, value: music });
    } else {
      await window.electronAPI.storeDelete(playingMusicElectronStoreKey);
    }
    playingMusic.value = music;
  }

  /**
   * 读取本地播放中的音乐
   */
  async function getPlayingMusic() {
    const localPlayingMusic = await window.electronAPI.storeGet<PlayingMusicType | undefined>(
      playingMusicElectronStoreKey,
    );
    playingMusic.value = localPlayingMusic;
    return localPlayingMusic;
  }

  /**
   * 设置 Session 播放的音乐
   * @param music
   */
  function setSessionPlayingMusic(music?: SessionPlayingMusicType) {
    sessionPlayingMusic.value = music;
    if (music) {
      storage.setSession(playingMusicSessionKey, music);
    } else {
      storage.removeSession(playingMusicSessionKey);
    }
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

  /**
   * 获取本地我喜欢的音乐ID
   */
  async function getLoveMusics() {
    loveMusicIds.value = (await window.electronAPI.storeGet<string[] | undefined>(loveElectronStoreKey)) || [];
  }

  /**
   * 设置喜欢，如果已经存在喜欢列表，则取消喜欢
   * @param musicId
   */
  async function setLoveMusicId(musicId: string) {
    const localLoveMusicIds = loveMusicIds.value;
    const hasLove = loveMusicIds.value.includes(musicId);
    const newLocalLoveMusicIds = hasLove
      ? localLoveMusicIds.filter((it) => it !== musicId)
      : [...localLoveMusicIds, musicId];
    await window.electronAPI.storeSet({ key: loveElectronStoreKey, value: newLocalLoveMusicIds });
    await getLoveMusics();
  }

  /**
   * 判断ID是否在喜欢列表
   */
  function isLoveMusicId(musicId?: string) {
    if (!musicId) return false;
    return loveMusicIds.value.includes(musicId);
  }

  /**
   * 设置播放顺序
   * @param order
   */
  async function setPlayOrder(order: PlayOrderEnum) {
    await window.electronAPI.storeSet({ key: playOrderElectronKey, value: order });
    playOrder.value = order;
  }

  /**
   * 读取本地存储的播放顺序
   */
  async function getElectronPlayOrder() {
    const res = await window.electronAPI.storeGet<PlayOrderEnum | undefined>(playOrderElectronKey);
    playOrder.value = res || PlayOrderEnum.顺序;
  }

  return {
    playOrder,
    localMusics,
    playingMusic,
    loveMusics,
    sessionPlayingMusic,
    setLocalMusics,
    getPlayingMusic,
    setPlayingMusic,
    getLocalMusics,
    deleteLocalMusicById,
    getLoveMusics,
    setLoveMusicId,
    isLoveMusicId,
    setSessionPlayingMusic,
    setPlayOrder,
    getElectronPlayOrder,
  };
});
