import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import appList from '@/router/app-list';
import { getLoadingInstance, loadingService } from '@/hooks/el-loading-service';
import AppLayout from '@/layout';
import MusicPlaying from '@/pages/MusicPlaying';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'APP',
    component: AppLayout,
    children: appList,
    redirect: { name: appList[0]?.name },
  },
  {
    path: '/playing',
    name: 'playing',
    component: MusicPlaying,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(() => {
  loadingService({ text: '页面加载中...' });
});
router.afterEach(() => {
  const instance = getLoadingInstance();
  if (instance) instance.close();
});

export default router;
