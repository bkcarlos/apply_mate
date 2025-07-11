# ApplyMate - Arco Pro 风格迁移指南

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **现代浏览器**: Chrome 90+, Firefox 88+, Safari 14+

### 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器
```bash
# 开发模式
npm run dev

# 或
yarn dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本
```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

## 🎨 主要变更内容

### 1. 布局架构升级
- ✅ 顶部导航栏 + 侧边菜单的现代化布局
- ✅ 全局搜索功能
- ✅ 智能通知中心
- ✅ 主题切换支持
- ✅ 响应式移动端适配

### 2. Dashboard 2.0
- ✅ 重新设计的统计卡片（渐变背景 + 趋势指示）
- ✅ 面试时间轴（替代表格展示）
- ✅ 智能推荐系统
- ✅ 快速操作网格
- ✅ 增强的图表组件

### 3. 新增日历模块
- ✅ 月/周/日三种视图模式
- ✅ 面试事件的可视化展示
- ✅ 快速创建面试功能
- ✅ 响应式日历布局

### 4. 视觉设计系统
- ✅ Arco Pro 企业级色彩系统
- ✅ 统一的间距和圆角规范
- ✅ 现代化的阴影和动画效果
- ✅ 完整的响应式断点系统

## 🔧 技术架构

### 核心依赖
```json
{
  "@arco-design/web-vue": "^2.57.0",
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "pinia": "^2.1.0",
  "vue-i18n": "^9.14.4",
  "dayjs": "^1.11.0",
  "echarts": "^5.4.0"
}
```

### 新增文件结构
```
src/
├── hooks/
│   └── useBreakpoint.ts          # 响应式断点检测
├── views/
│   ├── Dashboard.vue              # 重新设计的仪表板
│   └── Calendar.vue               # 新增日历模块
├── locales/
│   ├── zh.ts                      # 更新的中文语言包
│   └── en.ts                      # 更新的英文语言包
└── App.vue                        # 重构的主布局
```

## 📱 响应式设计

### 断点系统
```scss
$breakpoints: (
  xs: 480px,   // 手机
  sm: 768px,   // 平板竖屏
  md: 1024px,  // 平板横屏
  lg: 1280px,  // 笔记本
  xl: 1440px   // 桌面
);
```

### 自适应特性
- **移动端**: 抽屉式侧边栏，触摸友好的控件
- **平板端**: 适配的栅格布局和组件尺寸
- **桌面端**: 完整的功能布局和交互体验

## 🎯 使用指南

### 1. 导航使用
- **全局搜索**: 顶部搜索栏支持搜索公司、职位、面试信息
- **通知中心**: 点击铃铛图标查看面试提醒和重要通知
- **主题切换**: 点击月亮/太阳图标切换明暗主题
- **用户菜单**: 点击头像访问个人设置

### 2. Dashboard 功能
- **统计卡片**: 显示关键指标和趋势变化
- **面试时间轴**: 查看未来7天的面试安排
- **智能推荐**: 基于数据的个性化建议
- **快速操作**: 一键访问常用功能

### 3. 日历模块
- **视图切换**: 月/周/日三种视图模式
- **快速创建**: 点击时间槽直接创建面试
- **时间导航**: 使用左右箭头切换时间范围
- **事件管理**: 点击面试事件查看详情

## 🎨 自定义主题

### CSS 变量定制
```scss
:root {
  --primary-color: #165DFF;        // 主色调
  --success-color: #00B42A;        // 成功色
  --warning-color: #FF7D00;        // 警告色
  --error-color: #F53F3F;          // 错误色
  
  --border-radius-small: 6px;      // 小圆角
  --border-radius-medium: 8px;     // 中圆角
  --border-radius-large: 12px;     // 大圆角
  
  --spacing-base: 4px;             // 基础间距
}
```

### 暗色主题
通过 `document.body.setAttribute('arco-theme', 'dark')` 启用暗色主题

## 🔧 开发注意事项

### 1. 组件使用
- 优先使用 Arco Design 组件
- 遵循统一的设计规范
- 确保响应式兼容性

### 2. 状态管理
- 使用 Pinia 进行状态管理
- 按功能模块划分 Store
- 合理使用计算属性

### 3. 国际化
- 所有文案都应支持国际化
- 使用 `$t()` 函数进行文本翻译
- 保持中英文键值对一致

### 4. 性能优化
- 使用路由懒加载
- 图片资源优化
- 避免不必要的重渲染

## 🐛 常见问题

### Q: 启动时出现依赖错误？
A: 确保已安装所有依赖：`npm install` 或 `yarn install`

### Q: 浏览器兼容性问题？
A: 使用现代浏览器，建议 Chrome 90+ 或 Firefox 88+

### Q: 移动端显示异常？
A: 检查响应式断点和移动端适配样式

### Q: 主题切换不生效？
A: 确保正确设置了 `arco-theme` 属性和对应的 CSS 变量

## 📞 技术支持

### 相关文档
- [Arco Design Vue 官方文档](https://arco.design/vue/docs/start)
- [Vue 3 官方文档](https://v3.vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)

### 社区资源
- [Arco Design 社区](https://github.com/arco-design/arco-design-vue)
- [Vue 中文社区](https://cn.vuejs.org/)

## 🎉 后续开发

### 即将推出的功能
- [ ] ProTable 高级表格组件
- [ ] ProForm 智能表单组件
- [ ] 数据看板模块
- [ ] AI 智能推荐
- [ ] 团队协作功能

### 贡献指南
1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

*更新时间: 2025年1月*  
*版本: 2.0.0 (Arco Pro Edition)*