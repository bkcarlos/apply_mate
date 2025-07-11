import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

import App from './App.vue';
import router from './router';
import i18n from './locales';
import { initDatabase } from './services/database';

// 初始化应用
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ArcoVue);

// 初始化数据库后挂载应用
initDatabase().then(() => {
  app.mount('#app');
}).catch(error => {
  console.error('Failed to initialize database:', error);
  // 即使数据库初始化失败，也要挂载应用，让用户看到错误信息
  app.mount('#app');
});
