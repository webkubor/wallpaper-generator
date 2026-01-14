import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    // 主页由 App.vue 自身渲染，不需要单独组件
    component: { render: () => null }
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
