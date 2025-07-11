import { RouteLocationNormalized } from 'vue-router';

export default function usePermission() {
  return {
    accessRouter(route: RouteLocationNormalized) {
      // 简单的权限检查，所有路由都允许访问
      return true;
    },
  };
} 