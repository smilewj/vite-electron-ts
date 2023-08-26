import { useAppStore } from '@/stores/app';
import indexScss from './index.module.scss';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import CommonIconVue from '@/components/CommonIcon.vue';
import { ElLink, ElPopover, ElSlider } from 'element-plus';
import {
  playerPromiseSymbol,
  playerSymbol,
  type LyricItemType,
  type PlayerType,
  type PromisePlayerType,
  PlayOrderEnum,
} from '@/constant';
import { useRouter } from 'vue-router';
import { findCurrentLyric } from '@/utils/func';
import { initLyric } from '@/pages/page-hook';

const playOrderMap = [
  { order: PlayOrderEnum.顺序, icon: 'icon-xunhuan', label: '顺序' },
  { order: PlayOrderEnum.随机, icon: 'icon-suijibofang', label: '随机' },
  { order: PlayOrderEnum.单曲, icon: 'icon-danquxunhuan', label: '单曲' },
];

export function useMusicPlayerUI() {
  const player = inject<PlayerType>(playerSymbol);
  const playerPromise = inject<PromisePlayerType>(playerPromiseSymbol);
  const router = useRouter();

  const currentLyric = ref<LyricItemType | undefined>();

  const appStore = useAppStore();
  const playingMusic = computed(() => appStore.playingMusic);
  const sessionPlayingMusic = computed(() => appStore.sessionPlayingMusic);
  const playStatus = computed(() => sessionPlayingMusic.value?.status);
  const playOrderOption = computed(() => playOrderMap.find((it) => it.order === appStore.playOrder) || playOrderMap[0]);

  const currentTime = computed(() => {
    const current = sessionPlayingMusic.value?.current || 0;
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
  const playingMusicIsLove = computed(() => appStore.isLoveMusicId(playingMusic.value?.id));

  function setLove() {
    if (!playingMusic.value) return;
    appStore.setLoveMusicId(playingMusic.value.id);
  }

  const { lyrics } = initLyric(playingMusic);
  function handleTimeupdate() {
    const currentTime = player?.elRef.value?.currentTime || 0;
    const ci = findCurrentLyric(currentTime, lyrics.value);
    currentLyric.value = ci?.lyric;
  }

  function handleChangePlayOrder() {
    const currentIndex = playOrderMap.findIndex((it) => it.order === playOrderOption.value.order);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= playOrderMap.length) {
      nextIndex = 0;
    }
    appStore.setPlayOrder(playOrderMap[nextIndex].order);
  }

  onMounted(async () => {
    if (!playerPromise) return;
    const player = await playerPromise;
    if (player.elRef.value) {
      player.elRef.value.addEventListener('timeupdate', handleTimeupdate);
    }
  });

  onUnmounted(async () => {
    if (!playerPromise) return;
    const player = await playerPromise;
    if (player.elRef.value) {
      player.elRef.value.removeEventListener('timeupdate', handleTimeupdate);
    }
  });

  function render() {
    const cm = playingMusic.value;
    return (
      <div class={indexScss['player-ui']}>
        <div class={indexScss['player-ui-left']}>
          <div class={indexScss['player-ui-left-image']}>
            {cm?.cover ? <img src={cm.cover} alt="" /> : <CommonIconVue icon="icon-Ser" class="font24" />}
            <div class={indexScss['player-ui-left-image-action']} onClick={() => router.push({ name: 'playing' })}>
              <CommonIconVue icon="icon-xiangshang" class="font26" />
            </div>
          </div>
          <div class={indexScss['player-ui-left-info']}>
            <div class={indexScss['player-ui-left-info-name']}>{cm?.name}</div>
            {cm && <div class={indexScss['player-ui-left-info-lyric']}>{currentLyric.value?.text}</div>}
          </div>
        </div>
        <div class={indexScss['player-ui-center']}>
          <ElLink
            type="default"
            underline={false}
            class={['mr8', playingMusicIsLove.value ? 'color-danger' : '']}
            onClick={setLove}
          >
            <CommonIconVue icon={playingMusicIsLove.value ? 'icon-xihuan1' : 'icon-xihuan'} class="font16" />
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
          <ElLink type="default" underline={false} class="ml8" onClick={() => handleChangePlayOrder()}>
            <CommonIconVue icon={playOrderOption.value.icon} class="font16" />
          </ElLink>
        </div>
        <div class={indexScss['player-ui-right']}>
          {cm && (
            <ElLink type="default" underline={false} class="mt2" onClick={() => router.push('./lyric')}>
              <CommonIconVue icon="icon-geci" class="font26" />
            </ElLink>
          )}
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
    playingMusic,
  };
}
