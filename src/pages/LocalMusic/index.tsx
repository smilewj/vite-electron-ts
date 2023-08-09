import { defineComponent, computed } from 'vue';
import rootClass from '../index.module.scss';
import { ElButton, ElEmpty, ElLink } from 'element-plus';
import CommonIconVue from '@/components/CommonIcon.vue';
import { musicsElectronStoreKey, type LocalMusicItem } from '@/constant';
import { useAppStore } from '@/stores/app';
import iconPlaying from '@/assets/images/player_state_playing.gif';
import iconEmpty from '@/assets/images/music-empty.svg';
import elConfirm from '@/hooks/el-confirm';
import { initActionFunction } from '../page-hook';

/**
 * 首页
 */
export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const localMusics = computed(() => appStore.localMusics);

    const { player, playingMusic, handlePlayAll, handleStop, handlePlayMusic, setLove } =
      initActionFunction(localMusics);

    /**
     * 添加本地音乐
     */
    async function handleSelectFiles() {
      const res = await window.electronAPI.selectMusicFiles();
      if (!res) return;
      const localMusics =
        (await window.electronAPI.storeGet<LocalMusicItem[] | undefined>(musicsElectronStoreKey)) || [];
      const filterRes = res.filter((it) => !localMusics.map((it) => it.path).includes(it.path));
      const newMusics = [...filterRes, ...localMusics];
      appStore.setLocalMusics(newMusics);
    }

    /**
     * 清空本地列表
     */
    async function handleClearFiles() {
      try {
        await elConfirm({ message: '确定清空列表吗？', type: 'error' });
        appStore.setLocalMusics([]);
      } catch {
        console.info('could not clear files');
      }
    }

    /**
     * 删除音乐回调
     */
    async function handleDeleteLocalMusic(id: string) {
      try {
        await elConfirm({ message: '确定删除这首歌曲吗？', type: 'error' });
        appStore.deleteLocalMusicById(id);
      } catch {
        console.info('could not delete');
      }
    }

    return function () {
      return (
        <div class={rootClass.root}>
          <div class={rootClass.title}>
            <div class={rootClass['title-text']}>本地音乐</div>
          </div>
          <div class={rootClass.action}>
            <ElButton type="primary" plain round onClick={handlePlayAll}>
              <CommonIconVue icon="icon-a-24gl-play" class="mr5" />
              <span>播放全部</span>
            </ElButton>
            <ElButton type="" plain round onClick={handleStop}>
              <CommonIconVue icon="icon-stop-full" class="mr5" />
              <span>停止</span>
            </ElButton>
            <ElButton type="primary" plain circle class="mlAuto" onClick={handleSelectFiles}>
              <CommonIconVue icon="icon-tianjiayinle" class="font16" />
            </ElButton>
            <ElButton type="danger" plain circle onClick={handleClearFiles}>
              <CommonIconVue icon="icon-qingkong" class="font16" />
            </ElButton>
          </div>
          {localMusics.value.length > 0 ? (
            <div class={rootClass.list}>
              {localMusics.value.map((it) => {
                const isLove = appStore.isLoveMusicId(it.id);
                return (
                  <div class={rootClass['list-item']} onDblclick={() => handlePlayMusic(it)}>
                    <div class={rootClass['list-item-name']}>{it.fullName}</div>
                    <div class={rootClass['list-item-right']}>
                      <ElLink
                        type="default"
                        underline={false}
                        class={['mr8', isLove ? 'color-danger' : '', rootClass['list-item-hover']]}
                        onClick={() => setLove(it.id)}
                      >
                        <CommonIconVue icon={isLove ? 'icon-xihuan1' : 'icon-xihuan'} class="font16" />
                      </ElLink>
                      <ElLink
                        class={rootClass['list-item-hover']}
                        type="danger"
                        underline={false}
                        onClick={() => handleDeleteLocalMusic(it.id)}
                      >
                        <CommonIconVue icon="icon-shanchu" />
                      </ElLink>
                      {playingMusic.value?.id === it.id ? (
                        playingMusic.value.status ? (
                          <div class={rootClass['list-item-playing']} onClick={() => player?.pause()}>
                            <img src={iconPlaying} />
                          </div>
                        ) : (
                          <div class={rootClass['list-item-pause']} onClick={() => player?.play()}>
                            <CommonIconVue icon="icon-zanting" />
                          </div>
                        )
                      ) : (
                        <div class={rootClass['list-item-play']} onClick={() => handlePlayMusic(it)}>
                          <CommonIconVue icon="icon-bofang" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ElEmpty image={iconEmpty}>
              {{
                description: () => (
                  <ElLink type="primary" underline={false} onClick={handleSelectFiles}>
                    添加音乐
                  </ElLink>
                ),
              }}
            </ElEmpty>
          )}
        </div>
      );
    };
  },
});
