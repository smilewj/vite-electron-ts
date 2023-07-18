import type { RouteRecordRaw } from 'vue-router';

const appList: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('@/pages/PageHome'),
    name: '首页',
    meta: { name: '首页' },
  },
];

export default appList;
