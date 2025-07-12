import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: Date | string | number, format = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(date).format(format);
};

/**
 * 获取相对时间
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const now = dayjs();
  const target = dayjs(date);
  
  const diffInDays = now.diff(target, 'day');
  
  if (diffInDays === 0) {
    return '今天';
  } else if (diffInDays === 1) {
    return '昨天';
  } else if (diffInDays === -1) {
    return '明天';
  } else if (diffInDays > 0 && diffInDays <= 7) {
    return `${diffInDays}天前`;
  } else if (diffInDays < 0 && diffInDays >= -7) {
    return `${Math.abs(diffInDays)}天后`;
  } else {
    return formatDate(date);
  }
};

/**
 * 检查日期是否为今天
 */
export const isToday = (date: Date | string | number): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * 检查日期是否为本周
 */
export const isThisWeek = (date: Date | string | number): boolean => {
  return dayjs(date).isSame(dayjs(), 'week');
};

/**
 * 获取日期范围
 */
export const getDateRange = (days: number): { start: Date; end: Date } => {
  const end = dayjs().endOf('day').toDate();
  const start = dayjs().add(days, 'day').startOf('day').toDate();
  
  return { start, end };
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 深拷贝对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
};

/**
 * 格式化货币
 */
export const formatCurrency = (amount: number, currency = '¥'): string => {
  return `${currency}${amount.toLocaleString()}`;
};

/**
 * 计算薪资涨幅百分比
 */
export const calculateIncreasePercentage = (oldAmount: number, newAmount: number): number => {
  if (oldAmount === 0) return 0;
  return Math.round(((newAmount - oldAmount) / oldAmount) * 100);
};

/**
 * 生成随机颜色
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#F28A31', // 主橙色
    '#6975A7', // 强调蓝
    '#67C23A', // 成功绿
    '#E6A23C', // 警告黄
    '#F56C6C', // 危险红
    '#909399', // 信息灰
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 数组去重
 */
export const uniqueArray = <T>(arr: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * 数组分组
 */
export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * 数组排序
 */
export const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * 检查是否为空值
 */
export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 文件大小格式化
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * URL参数解析
 */
export const parseQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

/**
 * 生成查询字符串
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};
