import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

const messages = {
  zh,
  en
}

// 获取浏览器语言设置
const getDefaultLocale = () => {
  const saved = localStorage.getItem('apply-mate-locale')
  if (saved) return saved
  
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  if (browserLang.startsWith('en')) return 'en'
  return 'zh' // 默认中文
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh',
  messages,
  globalInjection: true
})

export default i18n

// 语言切换函数
export const setLocale = (locale: string) => {
  i18n.global.locale.value = locale as any
  localStorage.setItem('apply-mate-locale', locale)
  document.documentElement.lang = locale
}

// 获取当前语言
export const getLocale = () => {
  return i18n.global.locale.value
}

// 支持的语言列表
export const supportedLocales = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
] 