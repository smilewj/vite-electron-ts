import { createRouter, createWebHashHistory } from 'vue-router';
import AppRouter from '@/views/AppRouter';
import appList from '@/router/app-list';
import { getLoadingInstance, loadingService } from '@/hooks/el-loading-service';

const routes = [
  {
    path: '/',
    name: 'APP',
    component: AppRouter,
    children: appList,
    redirect: { name: appList[0]?.name },
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
