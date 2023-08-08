import type { RouteRecordRaw } from 'vue-router';
import AppRouter from '@/views/AppRouter';
import PageLocal from '@/pages/LocalMusic';

const appList: RouteRecordRaw[] = [
  {
    path: '/my',
    component: AppRouter,
    name: '我的音乐',
    redirect: { name: '本地歌曲' },
    children: [
      {
        path: 'local',
        component: PageLocal,
        name: '本地歌曲',
      },
    ],
  },
];

export default appList;
