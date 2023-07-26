import { computed, defineComponent, inject, onMounted } from 'vue';
import rootClass from './index.module.scss';
import { ElButton } from 'element-plus';
import CommonIconVue from '@/components/CommonIcon.vue';
import { musicsElectronStoreKey, type LocalMusicItem, playerSymbol, type PlayerType } from '@/constant';
import { useAppStore } from '@/stores/app';
import iconPlaying from '@/assets/images/player_state_playing.gif';

/**
 * 首页
 */
export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const localMusics = computed(() => appStore.localMusics);
    const playingMusic = computed(() => appStore.playingMusic);

    const player = inject<PlayerType>(playerSymbol);

    /**
     * 添加本地音乐
     */
    async function handleSelectFiles() {
      const res = await window.electronAPI.openMusicFiles();
      if (!res) return;
      const localMusics =
        (await window.electronAPI.storeGet<LocalMusicItem[] | undefined>(musicsElectronStoreKey)) || [];
      const filterRes = res.filter((it) => !localMusics.map((it) => it.path).includes(it.path));
      const newMusics = [...filterRes, ...localMusics];
      await window.electronAPI.storeSet({ key: musicsElectronStoreKey, value: newMusics });
      getLocalMusics();
    }

    /**
     * 读取本地音乐列表
     */
    async function getLocalMusics() {
      const localMusics = await window.electronAPI.storeGet<LocalMusicItem[] | undefined>(musicsElectronStoreKey);
      appStore.setLocalMusics(localMusics || []);
    }

    /**
     * 清空本地列表
     */
    async function handleClearFiles() {
      await window.electronAPI.storeSet({ key: musicsElectronStoreKey, value: [] });
      getLocalMusics();
    }

    /**
     * 播放按钮点击回调
     */
    function handlePlayMusic(item: LocalMusicItem) {
      if (!player) return;
      player.start(item);
    }

    onMounted(getLocalMusics);

    return function () {
      return (
        <div class={rootClass.root}>
          <div class={rootClass.title}>本地音乐列表</div>
          <div class={rootClass.list}>
            {localMusics.value.map((it) => (
              <div class={rootClass['list-item']}>
                <div class={rootClass['list-item-name']}>{it.name}</div>
                <div class={rootClass['list-item-right']}>
                  {playingMusic.value?.id === it.id && (
                    <>
                      {playingMusic.value.status && (
                        <div class={rootClass['list-item-playing']} onClick={() => player?.pause()}>
                          <img src={iconPlaying} />
                        </div>
                      )}
                      {!playingMusic.value.status && (
                        <div class={rootClass['list-item-pause']} onClick={() => player?.play()}>
                          <CommonIconVue icon="icon-zanting" />
                        </div>
                      )}
                    </>
                  )}
                  {playingMusic.value?.id !== it.id && (
                    <div class={rootClass['list-item-play']} onClick={() => handlePlayMusic(it)}>
                      <CommonIconVue icon="icon-bofang" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div class={rootClass.footer}>
            <ElButton type="primary" onClick={handleSelectFiles}>
              添加音乐
            </ElButton>
            <ElButton type="danger" onClick={handleClearFiles}>
              清空列表
            </ElButton>
          </div>
        </div>
      );
    };
  },
});
