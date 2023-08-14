import { computed, defineComponent } from 'vue';
import rootClass from '../index.module.scss';
import { ElButton, ElEmpty, ElLink } from 'element-plus';
import CommonIconVue from '@/components/CommonIcon.vue';
import { initActionFunction } from '../page-hook';
import { useAppStore } from '@/stores/app';
import iconPlaying from '@/assets/images/player_state_playing.gif';
import iconEmpty from '@/assets/images/music-empty.svg';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const appStore = useAppStore();
    const loveMusics = computed(() => appStore.loveMusics);

    const { player, sessionPlayingMusic, handlePlayAll, handleStop, handlePlayMusic, setLove } =
      initActionFunction(loveMusics);

    return function () {
      return (
        <div class={rootClass.root}>
          <div class={rootClass.title}>
            <div class={rootClass['title-text']}>我喜欢</div>
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
          </div>
          {loveMusics.value.length > 0 ? (
            <div class={rootClass.list}>
              {loveMusics.value.map((it) => {
                return (
                  <div class={rootClass['list-item']}>
                    <div class={rootClass['list-item-name']}>{it.fullName}</div>
                    <div class={rootClass['list-item-right']}>
                      <ElLink underline={false} class="mr8 color-danger" onClick={() => setLove(it.id)}>
                        <CommonIconVue icon="icon-xihuan1" class="font16" />
                      </ElLink>
                      {sessionPlayingMusic.value?.id === it.id ? (
                        sessionPlayingMusic.value.status ? (
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
                  <ElLink type="primary" underline={false} onClick={() => router.push({ name: '本地歌曲' })}>
                    去添加
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
