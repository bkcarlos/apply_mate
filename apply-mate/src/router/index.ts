import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: '仪表盘' }
    },
    {
      path: '/interviews',
      name: 'interviews',
      component: () => import('../views/InterviewsView.vue'),
      meta: { title: '面试管理' }
    },
    {
      path: '/interviews/new',
      name: 'interview-new',
      component: () => import('../views/InterviewFormView.vue'),
      meta: { title: '新建面试流程' }
    },
    {
      path: '/interviews/:id',
      name: 'interview-detail',
      component: () => import('../views/InterviewDetailView.vue'),
      meta: { title: '面试详情' }
    },
    {
      path: '/interviews/:id/edit',
      name: 'interview-edit',
      component: () => import('../views/InterviewFormView.vue'),
      meta: { title: '编辑面试流程' }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
      meta: { title: '面试日历' }
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../views/CompaniesView.vue'),
      meta: { title: '公司管理' }
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/AnalysisView.vue'),
      meta: { title: '数据分析' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { title: '系统设置' }
    }
  ]
})

// Navigation guard to set page title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - ApplyMate`
  } else {
    document.title = 'ApplyMate - 求职伙伴'
  }
  next()
})

export default router
