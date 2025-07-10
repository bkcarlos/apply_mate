import { createRouter, createWebHistory } from 'vue-router';
import i18n from '@/locales';

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
      meta: { titleKey: 'pages.dashboard.title' }
    },
    {
      path: '/interviews',
      name: 'InterviewList',
      component: () => import('@/views/InterviewList.vue'),
      meta: { titleKey: 'pages.interviews.title' }
    },
    {
      path: '/interviews/new',
      name: 'NewInterview',
      component: () => import('@/views/NewInterview.vue'),
      meta: { titleKey: 'pages.interviews.new' }
    },
    {
      path: '/interviews/:id',
      name: 'InterviewDetail',
      component: () => import('@/views/InterviewDetail.vue'),
      meta: { titleKey: 'pages.interviews.detail' },
      props: true
    },
    {
      path: '/companies',
      name: 'CompanyList',
      component: () => import('@/views/CompanyList.vue'),
      meta: { titleKey: 'pages.companies.title' }
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: () => import('@/views/Analysis.vue'),
      meta: { titleKey: 'pages.analysis.title' }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { titleKey: 'pages.settings.title' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { titleKey: 'pages.notFound.title' }
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.titleKey) {
    const { t } = i18n.global;
    document.title = `${t(to.meta.titleKey as string)} - ApplyMate`;
  }
  next();
});

export default router;
