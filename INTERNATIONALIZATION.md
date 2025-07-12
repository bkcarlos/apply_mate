# Apply Mate 多语言支持

## 概述

Apply Mate 现已支持多语言功能，目前支持中文（zh）和英文（en）两种语言。

## 技术实现

### 使用的技术栈
- **Vue I18n 9**: Vue.js 的国际化插件
- **TypeScript**: 类型安全的语言文件
- **Element Plus**: UI组件库的国际化支持

### 文件结构
```
src/
├── i18n/
│   ├── index.ts          # i18n 配置文件
│   └── locales/
│       ├── zh.ts         # 中文语言文件
│       └── en.ts         # 英文语言文件
├── components/
│   └── LanguageSwitcher.vue  # 语言切换组件
└── main.ts               # 主应用文件（已集成i18n）
```

## 使用方法

### 1. 在组件中使用翻译

#### 在模板中使用
```vue
<template>
  <div>
    <h1>{{ $t('dashboard.title') }}</h1>
    <p>{{ $t('dashboard.welcome') }}</p>
  </div>
</template>
```

#### 在脚本中使用
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 在函数中使用
const title = t('dashboard.title')
</script>
```

### 2. 添加新的翻译文本

#### 在中文语言文件中添加（src/i18n/locales/zh.ts）
```typescript
export default {
  // 现有内容...
  newFeature: {
    title: '新功能',
    description: '这是一个新功能的描述'
  }
}
```

#### 在英文语言文件中添加（src/i18n/locales/en.ts）
```typescript
export default {
  // 现有内容...
  newFeature: {
    title: 'New Feature',
    description: 'This is a description of the new feature'
  }
}
```

### 3. 语言切换

用户可以通过头部的语言切换器来切换语言：
- 点击头部的语言按钮
- 选择所需的语言
- 页面会自动刷新以应用新语言

### 4. 程序化语言切换

```typescript
import { setLocale } from '@/i18n'

// 切换到英文
setLocale('en')

// 切换到中文
setLocale('zh')
```

## 语言文件结构

语言文件按功能模块组织：

```typescript
export default {
  // 通用文本
  common: {
    confirm: '确认',
    cancel: '取消',
    // ...
  },
  
  // 导航相关
  nav: {
    dashboard: '工作台',
    calendar: '面试日历',
    // ...
  },
  
  // 工作台相关
  dashboard: {
    title: '工作台',
    welcome: '欢迎使用 Apply Mate！',
    // ...
  },
  
  // 面试管理相关
  interview: {
    title: '面试管理',
    newInterview: '新建面试',
    // ...
  },
  
  // 公司管理相关
  company: {
    title: '公司管理',
    newCompany: '新建公司',
    // ...
  },
  
  // 其他模块...
}
```

## 已实现的功能

### ✅ 基础功能
- [x] Vue I18n 配置和初始化
- [x] 中文和英文语言文件
- [x] 语言切换组件
- [x] 浏览器语言自动检测
- [x] 语言偏好本地存储

### ✅ 组件国际化
- [x] 头部导航组件
- [x] 语言切换器组件
- [x] 工作台页面
- [x] 统计卡片

### 🔄 进行中的功能
- [ ] 面试管理页面
- [ ] 公司管理页面
- [ ] 日历页面
- [ ] 数据分析页面
- [ ] 设置页面

### 📋 计划中的功能
- [ ] 表单验证消息国际化
- [ ] 日期和时间格式国际化
- [ ] 数字和货币格式国际化
- [ ] 更多语言支持（日语、韩语等）

## 开发指南

### 添加新语言

1. 在 `src/i18n/locales/` 目录下创建新的语言文件
2. 在 `src/i18n/index.ts` 中导入新语言
3. 更新 `supportedLocales` 数组
4. 为新语言添加完整的翻译文本

### 命名约定

- 使用驼峰命名法：`interviewManagement`
- 使用层级结构：`interview.newInterview`
- 保持一致的命名风格
- 避免过深的嵌套（建议最多3层）

### 最佳实践

1. **保持翻译文本的一致性**：确保中英文翻译准确对应
2. **使用有意义的键名**：键名应该反映文本的用途和位置
3. **避免硬编码文本**：所有用户可见的文本都应该通过i18n系统
4. **测试多语言**：确保在不同语言下UI布局正常
5. **定期审查翻译**：保持翻译文本的质量和准确性

## 故障排除

### 常见问题

1. **翻译文本不显示**
   - 检查语言文件中是否存在对应的键
   - 确认键名拼写正确
   - 检查是否正确导入了语言文件

2. **语言切换不生效**
   - 检查浏览器控制台是否有错误
   - 确认语言文件格式正确
   - 检查localStorage中的语言设置

3. **部分文本未翻译**
   - 检查是否遗漏了某些组件的国际化
   - 确认新添加的文本是否已加入语言文件

## 贡献指南

如果您想为多语言功能做出贡献：

1. 确保新功能的所有文本都已国际化
2. 为新文本提供准确的中英文翻译
3. 更新相关文档
4. 测试多语言功能正常工作

## 技术支持

如有问题，请查看：
- Vue I18n 官方文档：https://vue-i18n.intlify.dev/
- Element Plus 国际化文档：https://element-plus.org/zh-CN/guide/i18n.html 