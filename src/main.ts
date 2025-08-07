import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { APP_VERSION } from '@/constants';

import App from './App.vue';
import router from './router';
import i18n from './i18n';
import './styles/index.scss';

// 创建应用实例
const app = createApp(App);

// 注册 Pinia 状态管理
const pinia = createPinia();
app.use(pinia);

// 注册路由
app.use(router);

// 注册 Element Plus
app.use(ElementPlus);

// 注册 i18n
app.use(i18n);

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 挂载应用
app.mount('#app');

// 开发环境配置
if (import.meta.env.DEV) {
  console.log('🚀 Apply Mate 开发模式启动');
  console.log('📱 版本:', APP_VERSION);
  console.log('🎨 主题: 橙色系年轻趣味风格');
}
