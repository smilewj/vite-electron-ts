import type { RouteRecordRaw } from 'vue-router';
import AppRouter from '@/views/AppRouter';
import LocalMusic from '@/pages/LocalMusic';
import LoveMusic from '@/pages/LoveMusic';

const appList: RouteRecordRaw[] = [
  {
    path: '/my',
    component: AppRouter,
    name: '我的音乐',
    redirect: { name: '本地歌曲' },
    children: [
      {
        path: 'local',
        component: LocalMusic,
        name: '本地歌曲',
      },
      {
        path: 'love',
        component: LoveMusic,
        name: '我喜欢',
      },
    ],
  },
];

export default appList;
