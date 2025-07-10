import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { title: '仪表盘' }
    },
    {
      path: '/interviews',
      name: 'InterviewList',
      component: () => import('@/views/InterviewList.vue'),
      meta: { title: '面试管理' }
    },
    {
      path: '/interviews/new',
      name: 'NewInterview',
      component: () => import('@/views/NewInterview.vue'),
      meta: { title: '新建面试流程' }
    },
    {
      path: '/interviews/:id',
      name: 'InterviewDetail',
      component: () => import('@/views/InterviewDetail.vue'),
      meta: { title: '面试详情' },
      props: true
    },
    {
      path: '/companies',
      name: 'CompanyList',
      component: () => import('@/views/CompanyList.vue'),
      meta: { title: '公司库' }
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: () => import('@/views/Analysis.vue'),
      meta: { title: '统计分析' }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { title: '设置' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '页面不存在' }
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - ApplyMate`;
  }
  next();
});

export default router;
