import localforage from 'localforage';
import type { Company, InterviewProcess, InterviewRound, UserProfile, ExportData } from '@/types';
import { APP_VERSION } from '@/constants';
import { createError, ERROR_CODES } from '@/utils/errors';

// 配置 localforage
localforage.config({
  name: 'ApplyMate',
  version: 1.0,
  storeName: 'applymate_data',
  description: '求职面试管理应用数据存储'
});

// 存储键名常量
export const STORAGE_KEYS = {
  COMPANIES: 'companies',
  INTERVIEW_PROCESSES: 'interviewProcesses',
  INTERVIEW_ROUNDS: 'interviewRounds',
  USER_PROFILE: 'userProfile',
  APP_VERSION: 'appVersion'
} as const;

/**
 * 数据存储管理类
 */
class StorageManager {
  /**
   * 序列化数据，处理Date对象
   */
  private serializeData(data: any): any {
    return JSON.parse(JSON.stringify(data, (_key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    }));
  }

  /**
   * 反序列化数据，恢复Date对象
   */
  private deserializeData(data: any): any {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data), (_key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
  }

  /**
   * 获取数据
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await localforage.getItem<T>(key);
      return this.deserializeData(data);
    } catch (error) {
      console.error(createError(ERROR_CODES.STORAGE_GET_FAILED, `获取数据失败 [${key}]`, error));
      return null;
    }
  }

  /**
   * 存储数据
   */
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const serializedData = this.serializeData(value);
      await localforage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error(createError(ERROR_CODES.STORAGE_SET_FAILED, `存储数据失败 [${key}]`, error));
      return false;
    }
  }

  /**
   * 删除数据
   */
  async remove(key: string): Promise<boolean> {
    try {
      await localforage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除数据失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<boolean> {
    try {
      await localforage.clear();
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  }

  /**
   * 获取所有键名
   */
  async keys(): Promise<string[]> {
    try {
      return await localforage.keys();
    } catch (error) {
      console.error('获取键名失败:', error);
      return [];
    }
  }

  /**
   * 获取存储大小（近似值）
   */
  async getStorageSize(): Promise<number> {
    try {
      const keys = await this.keys();
      // 并行获取，提升性能
      const values = await Promise.all(keys.map(k => this.get(k)));
      return values.reduce<number>((sum, v) => {
        if (!v) return sum;
        try {
          return sum + JSON.stringify(v).length;
        } catch {
          return sum;
        }
      }, 0);
    } catch (error) {
      console.error('计算存储大小失败:', error);
      return 0;
    }
  }

  /**
   * 导出所有数据
   */
  async exportData(): Promise<ExportData | null> {
    try {
      const [companies, interviewProcesses, interviewRounds, userProfile] = await Promise.all([
        this.get<Company[]>(STORAGE_KEYS.COMPANIES),
        this.get<InterviewProcess[]>(STORAGE_KEYS.INTERVIEW_PROCESSES),
        this.get<InterviewRound[]>(STORAGE_KEYS.INTERVIEW_ROUNDS),
        this.get<UserProfile>(STORAGE_KEYS.USER_PROFILE)
      ]);

      return {
        version: APP_VERSION,
        exportDate: new Date(),
        companies: companies || [],
        interviewProcesses: interviewProcesses || [],
        interviewRounds: interviewRounds || [],
        userProfile: userProfile || {
          id: 'default',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
    } catch (error) {
      console.error('导出数据失败:', error);
      return null;
    }
  }

  /**
   * 导入数据
   */
  async importData(data: ExportData): Promise<boolean> {
    try {
      if (!validateImportData(data)) {
        throw createError(ERROR_CODES.STORAGE_IMPORT_INVALID, '导入数据结构不合法');
      }

      const normalizedCompanies = (data.companies || []).map(c => this.normalizeDates(c, ['createdAt', 'updatedAt']));
      const normalizedProcesses = (data.interviewProcesses || []).map(p => this.normalizeDates(p, ['createdAt', 'updatedAt']));
      const normalizedRounds = (data.interviewRounds || []).map(r => this.normalizeDates(r, ['scheduledTime', 'createdAt', 'updatedAt']));
      const normalizedProfile = this.normalizeDates(data.userProfile, ['createdAt', 'updatedAt']);

      const operations = [
        this.set(STORAGE_KEYS.COMPANIES, normalizedCompanies),
        this.set(STORAGE_KEYS.INTERVIEW_PROCESSES, normalizedProcesses),
        this.set(STORAGE_KEYS.INTERVIEW_ROUNDS, normalizedRounds),
        this.set(STORAGE_KEYS.USER_PROFILE, normalizedProfile),
        this.set(STORAGE_KEYS.APP_VERSION, data.version || APP_VERSION)
      ];

      const results = await Promise.all(operations);
      return results.every(Boolean);
    } catch (error) {
  console.error(createError(ERROR_CODES.STORAGE_IMPORT_FAILED, '导入数据失败', error));
      return false;
    }
  }

  /**
   * 初始化默认数据
   */
  async initDefaultData(): Promise<void> {
    try {
      const companies = await this.get<Company[]>(STORAGE_KEYS.COMPANIES);
      if (!companies) {
        await this.set(STORAGE_KEYS.COMPANIES, []);
      }

      const interviewProcesses = await this.get<InterviewProcess[]>(STORAGE_KEYS.INTERVIEW_PROCESSES);
      if (!interviewProcesses) {
        await this.set(STORAGE_KEYS.INTERVIEW_PROCESSES, []);
      }

      const interviewRounds = await this.get<InterviewRound[]>(STORAGE_KEYS.INTERVIEW_ROUNDS);
      if (!interviewRounds) {
        await this.set(STORAGE_KEYS.INTERVIEW_ROUNDS, []);
      }

      const userProfile = await this.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
      if (!userProfile) {
        await this.set(STORAGE_KEYS.USER_PROFILE, {
          id: 'default',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await this.set(STORAGE_KEYS.APP_VERSION, APP_VERSION);
    } catch (error) {
      console.error('初始化默认数据失败:', error);
    }
  }

  /**
   * 规范化对象中的日期字段：如果是字符串且可被 Date 解析则转为 Date
   */
  private normalizeDates<T extends Record<string, any>>(obj: T, dateKeys: string[]): T {
    if (!obj || typeof obj !== 'object') return obj;
    const cloned: Record<string, any> = { ...obj };
    dateKeys.forEach(k => {
      const v = cloned[k];
      if (typeof v === 'string' || typeof v === 'number') {
        const d = new Date(v);
        if (!isNaN(d.getTime())) cloned[k] = d;
      }
    });
    return cloned as T;
  }
}

// 创建单例实例
export const storageManager = new StorageManager();

// 数据验证工具函数
export const validateImportData = (data: any): data is ExportData => {
  if (!data || typeof data !== 'object') return false;
  const requiredFields = ['version', 'exportDate', 'companies', 'interviewProcesses', 'interviewRounds', 'userProfile'];
  if (!requiredFields.every(f => f in data)) return false;
  if (!Array.isArray(data.companies) || !Array.isArray(data.interviewProcesses) || !Array.isArray(data.interviewRounds)) return false;
  // 粗略结构校验（必填字段最小集）
  const companyShapeOk = data.companies.every((c: any) => c && typeof c === 'object' && 'name' in c);
  const processShapeOk = data.interviewProcesses.every((p: any) => p && typeof p === 'object' && 'companyId' in p && 'position' in p);
  const roundsShapeOk = data.interviewRounds.every((r: any) => r && typeof r === 'object' && 'processId' in r && 'scheduledTime' in r);
  if (!companyShapeOk || !processShapeOk || !roundsShapeOk) return false;
  return true;
};

// 文件下载工具函数
export const downloadJSON = (data: any, filename: string): void => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 文件读取工具函数
export const readJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('文件格式错误，请选择有效的JSON文件'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsText(file);
  });
};
