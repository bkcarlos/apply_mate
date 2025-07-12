import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 路由组件懒加载
const Dashboard = () => import('@/views/Dashboard.vue');
const Calendar = () => import('@/views/Calendar.vue');
const InterviewList = () => import('@/views/InterviewList.vue');
const InterviewDetail = () => import('@/views/InterviewDetail.vue');
const InterviewForm = () => import('@/views/InterviewForm.vue');
const CompanyList = () => import('@/views/CompanyList.vue');
const Analysis = () => import('@/views/Analysis.vue');
const Settings = () => import('@/views/Settings.vue');

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: '仪表盘',
      icon: 'House',
      showInNav: true,
    },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    meta: {
      title: '面试日历',
      icon: 'Calendar',
      showInNav: true,
    },
  },
  {
    path: '/interviews',
    name: 'InterviewList',
    component: InterviewList,
    meta: {
      title: '面试管理',
      icon: 'Document',
      showInNav: true,
    },
  },
  {
    path: '/interviews/new',
    name: 'InterviewForm',
    component: InterviewForm,
    meta: {
      title: '新建面试流程',
      showInNav: false,
    },
  },
  {
    path: '/interviews/:id',
    name: 'InterviewDetail',
    component: InterviewDetail,
    meta: {
      title: '面试详情',
      showInNav: false,
    },
  },
  {
    path: '/interviews/:id/edit',
    name: 'InterviewEdit',
    component: InterviewForm,
    meta: {
      title: '编辑面试流程',
      showInNav: false,
    },
  },
  {
    path: '/companies',
    name: 'CompanyList',
    component: CompanyList,
    meta: {
      title: '公司管理',
      icon: 'OfficeBuilding',
      showInNav: true,
    },
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: Analysis,
    meta: {
      title: '数据分析',
      icon: 'DataAnalysis',
      showInNav: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: '系统设置',
      icon: 'Setting',
      showInNav: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      showInNav: false,
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫
router.beforeEach((to, _, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Apply Mate`;
  } else {
    document.title = 'Apply Mate - 求职面试管理';
  }
  
  next();
});

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error);
});

export default router;

// 导出导航菜单配置
export const navMenus = routes.filter(route => route.meta?.showInNav);

// 路由工具函数
export const getRouteTitle = (name: string): string => {
  const route = routes.find(r => r.name === name);
  return route?.meta?.title as string || name;
};

export const isActiveRoute = (routeName: string, currentRoute: string): boolean => {
  if (routeName === currentRoute) return true;
  
  // 特殊路由匹配逻辑
  if (routeName === 'InterviewList') {
    return ['InterviewDetail', 'InterviewForm', 'InterviewEdit'].includes(currentRoute);
  }
  
  return false;
};
