import localforage from 'localforage';
import type { Company, InterviewProcess, InterviewRound, UserProfile, ExportData } from '@/types';

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
   * 获取数据
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await localforage.getItem<T>(key);
    } catch (error) {
      console.error(`获取数据失败 [${key}]:`, error);
      return null;
    }
  }

  /**
   * 存储数据
   */
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await localforage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`存储数据失败 [${key}]:`, error);
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
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await this.get(key);
        if (value) {
          totalSize += JSON.stringify(value).length;
        }
      }
      
      return totalSize;
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
        version: '1.4.0',
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
      const operations = [
        this.set(STORAGE_KEYS.COMPANIES, data.companies),
        this.set(STORAGE_KEYS.INTERVIEW_PROCESSES, data.interviewProcesses),
        this.set(STORAGE_KEYS.INTERVIEW_ROUNDS, data.interviewRounds),
        this.set(STORAGE_KEYS.USER_PROFILE, data.userProfile),
        this.set(STORAGE_KEYS.APP_VERSION, data.version)
      ];

      const results = await Promise.all(operations);
      return results.every(result => result === true);
    } catch (error) {
      console.error('导入数据失败:', error);
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

      await this.set(STORAGE_KEYS.APP_VERSION, '1.4.0');
    } catch (error) {
      console.error('初始化默认数据失败:', error);
    }
  }
}

// 创建单例实例
export const storageManager = new StorageManager();

// 数据验证工具函数
export const validateImportData = (data: any): data is ExportData => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['version', 'exportDate', 'companies', 'interviewProcesses', 'interviewRounds', 'userProfile'];
  return requiredFields.every(field => field in data);
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
