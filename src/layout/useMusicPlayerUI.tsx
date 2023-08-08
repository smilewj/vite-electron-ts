import { useAppStore } from '@/stores/app';
import indexScss from './index.module.scss';
import { computed, inject } from 'vue';
import CommonIconVue from '@/components/CommonIcon.vue';
import { ElLink, ElPopover, ElSlider } from 'element-plus';
import { playerSymbol, type PlayerType } from '@/constant';

export function useMusicPlayerUI() {
  const player = inject<PlayerType>(playerSymbol);

  const appStore = useAppStore();
  const playingMusic = computed(() => appStore.playingMusic);
  const playStatus = computed(() => playingMusic.value?.status);
  const currentTime = computed(() => {
    const current = playingMusic.value?.current || 0;
    const m = Math.floor(current / 60)
      .toString()
      .padStart(2, '0');
    const s = parseInt((current % 60).toString())
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  });
  const durationTime = computed(() => {
    const duration = playingMusic.value?.duration || 0;
    const m = Math.floor(duration / 60)
      .toString()
      .padStart(2, '0');
    const s = parseInt((duration % 60).toString())
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  });
  const volumeUI = computed({
    get: () => Math.round((playingMusic.value ? playingMusic.value.volume : 1) * 100),
    set: (val) => {
      player?.volume(val / 100);
    },
  });

  function render() {
    const cm = playingMusic.value;
    return (
      <div class={indexScss['player-ui']}>
        <div class={indexScss['player-ui-left']}>
          <div class={indexScss['player-ui-left-image']}>
            {cm?.cover ? <img src={cm.cover} alt="" /> : <CommonIconVue icon="icon-Ser" class="font24" />}
          </div>
          <div class={indexScss['player-ui-left-info']}>
            <div class={indexScss['player-ui-left-info-name']}>{cm?.name}</div>
          </div>
        </div>
        <div class={indexScss['player-ui-center']}>
          <ElLink type="default" underline={false} class="mr8">
            <CommonIconVue icon="icon-xihuan" class="font16" />
          </ElLink>
          <ElLink type="default" underline={false} class="mr8 color-danger">
            <CommonIconVue icon="icon-xihuan1" class="font16" />
          </ElLink>
          <ElLink type="default" underline={false} onClick={() => player?.prev()}>
            <CommonIconVue icon="icon-shangyishou" class="font26" />
          </ElLink>
          {playStatus.value ? (
            <ElLink type="default" underline={false} class="ml8 mr8" onClick={() => player?.pause()}>
              <CommonIconVue icon="icon-zanting1" class="font32" />
            </ElLink>
          ) : (
            <ElLink type="default" underline={false} class="ml8 mr8" onClick={() => player?.play()}>
              <CommonIconVue icon="icon-bofang1" class="font32" />
            </ElLink>
          )}
          <ElLink type="default" underline={false} onClick={() => player?.next()}>
            <CommonIconVue icon="icon-xiayishou" class="font26" />
          </ElLink>
        </div>
        <div class={indexScss['player-ui-right']}>
          <div class={indexScss['player-ui-right-time']}>
            <span>{currentTime.value}</span>
            <span class="ml2 mr2">/</span>
            <span>{durationTime.value}</span>
          </div>
          <div class={indexScss['player-ui-right-volume']}>
            <ElPopover trigger="click" popper-class="volume-popover">
              {{
                reference: () => (
                  <CommonIconVue icon="icon-shengyin" class={indexScss['player-ui-right-volume-icon']} />
                ),
                default: () => (
                  <div class={indexScss['player-ui-right-volume-popover']}>
                    <ElSlider vertical height="72px" size="small" v-model={volumeUI.value} show-tooltip={false} />
                    <span class={indexScss['player-ui-right-volume-popover-value']}>{volumeUI.value}%</span>
                    <CommonIconVue icon="icon-shengyin" class={indexScss['player-ui-right-volume-popover-icon']} />
                  </div>
                ),
              }}
            </ElPopover>
          </div>
        </div>
      </div>
    );
  }

  return {
    renderPlayerUI: render,
  };
}
