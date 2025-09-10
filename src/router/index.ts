import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
    meta: { title: '壁纸生成器' }
  },
  {
    path: '/xhs',
    name: 'Poster',
    component: () => import('@/pages/poster/index.vue'),
    meta: { title: '小红书封面大字报' }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = String(to.meta.title);
  }
});

export default router;
