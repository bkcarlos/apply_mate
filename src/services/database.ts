import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { 
  Company, 
  InterviewProcess, 
  InterviewRound, 
  UserProfile,
  ExportData 
} from '@/types';

// 数据库Schema定义
interface ApplyMateDB extends DBSchema {
  companies: {
    key: string;
    value: Company;
  };
  interviewProcesses: {
    key: string;
    value: InterviewProcess;
    indexes: { 'by-company': string; 'by-status': string };
  };
  interviewRounds: {
    key: string;
    value: InterviewRound;
    indexes: { 'by-process': string };
  };
  userProfile: {
    key: string;
    value: UserProfile;
  };
}

class DatabaseService {
  private db: IDBPDatabase<ApplyMateDB> | null = null;
  private readonly DB_NAME = 'ApplyMateDB';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<ApplyMateDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // 公司表
        if (!db.objectStoreNames.contains('companies')) {
          db.createObjectStore('companies', { keyPath: 'id' });
        }

        // 面试流程表
        if (!db.objectStoreNames.contains('interviewProcesses')) {
          const processStore = db.createObjectStore('interviewProcesses', { keyPath: 'id' });
          processStore.createIndex('by-company', 'companyId');
          processStore.createIndex('by-status', 'status');
        }

        // 面试轮次表
        if (!db.objectStoreNames.contains('interviewRounds')) {
          const roundStore = db.createObjectStore('interviewRounds', { keyPath: 'id' });
          roundStore.createIndex('by-process', 'processId');
        }

        // 用户配置表
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      },
    });
  }

  private ensureDB(): IDBPDatabase<ApplyMateDB> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  // ========== 公司相关操作 ==========
  async addCompany(company: Omit<Company, 'id' | 'createTime' | 'updateTime'>): Promise<Company> {
    const db = this.ensureDB();
    const now = new Date();
    const newCompany: Company = {
      ...company,
      id: crypto.randomUUID(),
      createTime: now,
      updateTime: now,
    };
    
    await db.add('companies', newCompany);
    return newCompany;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    const db = this.ensureDB();
    const existing = await db.get('companies', id);
    if (!existing) {
      throw new Error(`Company with id ${id} not found`);
    }

    const updated: Company = {
      ...existing,
      ...updates,
      id,
      updateTime: new Date(),
    };

    await db.put('companies', updated);
    return updated;
  }

  async deleteCompany(id: string): Promise<void> {
    const db = this.ensureDB();
    // 检查是否有关联的面试流程
    const processes = await db.getAllFromIndex('interviewProcesses', 'by-company', id);
    if (processes.length > 0) {
      throw new Error('Cannot delete company with existing interview processes');
    }
    
    await db.delete('companies', id);
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const db = this.ensureDB();
    const company = await db.get('companies', id);
    
    if (!company) return undefined;
    
    // 确保Date对象正确转换
    return {
      ...company,
      createTime: new Date(company.createTime),
      updateTime: new Date(company.updateTime),
    };
  }

  async getAllCompanies(): Promise<Company[]> {
    const db = this.ensureDB();
    const companies = await db.getAll('companies');
    
    // 确保Date对象正确转换
    return companies.map(company => ({
      ...company,
      createTime: new Date(company.createTime),
      updateTime: new Date(company.updateTime),
    }));
  }

  // ========== 面试流程相关操作 ==========
  async addInterviewProcess(process: Omit<InterviewProcess, 'id' | 'appliedAt' | 'updatedAt'>): Promise<InterviewProcess> {
    const db = this.ensureDB();
    const now = new Date();
    const newProcess: InterviewProcess = {
      ...process,
      id: crypto.randomUUID(),
      appliedAt: now,
      updatedAt: now,
    };
    
    await db.add('interviewProcesses', newProcess);
    return newProcess;
  }

  async updateInterviewProcess(id: string, updates: Partial<InterviewProcess>): Promise<InterviewProcess> {
    const db = this.ensureDB();
    const existing = await db.get('interviewProcesses', id);
    if (!existing) {
      throw new Error(`Interview process with id ${id} not found`);
    }

    const updated: InterviewProcess = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };

    await db.put('interviewProcesses', updated);
    return updated;
  }

  async deleteInterviewProcess(id: string): Promise<void> {
    const db = this.ensureDB();
    // 删除关联的面试轮次
    const rounds = await db.getAllFromIndex('interviewRounds', 'by-process', id);
    for (const round of rounds) {
      await db.delete('interviewRounds', round.id);
    }
    
    await db.delete('interviewProcesses', id);
  }

  async getInterviewProcess(id: string): Promise<InterviewProcess | undefined> {
    const db = this.ensureDB();
    const process = await db.get('interviewProcesses', id);
    
    if (!process) return undefined;
    
    // 确保Date对象正确转换
    return {
      ...process,
      appliedAt: new Date(process.appliedAt),
      updatedAt: new Date(process.updatedAt),
    };
  }

  async getAllInterviewProcesses(): Promise<InterviewProcess[]> {
    const db = this.ensureDB();
    const processes = await db.getAll('interviewProcesses');
    
    // 确保Date对象正确转换
    return processes.map(process => ({
      ...process,
      appliedAt: new Date(process.appliedAt),
      updatedAt: new Date(process.updatedAt),
    }));
  }

  async getInterviewProcessesByCompany(companyId: string): Promise<InterviewProcess[]> {
    const db = this.ensureDB();
    const processes = await db.getAllFromIndex('interviewProcesses', 'by-company', companyId);
    
    // 确保Date对象正确转换
    return processes.map(process => ({
      ...process,
      appliedAt: new Date(process.appliedAt),
      updatedAt: new Date(process.updatedAt),
    }));
  }

  // ========== 面试轮次相关操作 ==========
  async addInterviewRound(round: Omit<InterviewRound, 'id' | 'createdAt' | 'updatedAt'>): Promise<InterviewRound> {
    const db = this.ensureDB();
    const now = new Date();
    const newRound: InterviewRound = {
      ...round,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    await db.add('interviewRounds', newRound);
    return newRound;
  }

  async updateInterviewRound(id: string, updates: Partial<InterviewRound>): Promise<InterviewRound> {
    const db = this.ensureDB();
    
    console.log('Database updateInterviewRound called with:', { id, updates });
    
    const existing = await db.get('interviewRounds', id);
    if (!existing) {
      throw new Error(`Interview round with id ${id} not found`);
    }

    console.log('Existing round:', existing);

    const updated: InterviewRound = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };

    console.log('Updated round:', updated);

    await db.put('interviewRounds', updated);
    return updated;
  }

  async deleteInterviewRound(id: string): Promise<void> {
    const db = this.ensureDB();
    await db.delete('interviewRounds', id);
  }

  async getInterviewRound(id: string): Promise<InterviewRound | undefined> {
    const db = this.ensureDB();
    const round = await db.get('interviewRounds', id);
    
    if (!round) return undefined;
    
    // 确保Date对象正确转换
    return {
      ...round,
      scheduledAt: new Date(round.scheduledAt),
      createdAt: new Date(round.createdAt),
      updatedAt: new Date(round.updatedAt),
    };
  }

  async getInterviewRoundsByProcess(processId: string): Promise<InterviewRound[]> {
    const db = this.ensureDB();
    const rounds = await db.getAllFromIndex('interviewRounds', 'by-process', processId);
    
    // 确保Date对象正确转换
    return rounds.map(round => ({
      ...round,
      scheduledAt: new Date(round.scheduledAt),
      createdAt: new Date(round.createdAt),
      updatedAt: new Date(round.updatedAt),
    }));
  }

  // ========== 用户配置相关操作 ==========
  async getUserProfile(): Promise<UserProfile> {
    const db = this.ensureDB();
    const profile = await db.get('userProfile', 'default');
    if (!profile) {
      // 创建默认配置
      const defaultProfile: UserProfile = {
        id: 'default',
      };
      await db.add('userProfile', defaultProfile);
      return defaultProfile;
    }
    return profile;
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const db = this.ensureDB();
    const existing = await this.getUserProfile();
    const updated: UserProfile = {
      ...existing,
      ...updates,
      id: 'default',
    };

    await db.put('userProfile', updated);
    return updated;
  }

  // ========== 数据导入导出 ==========
  async exportData(): Promise<ExportData> {
    const [companies, processes, rounds, userProfile] = await Promise.all([
      this.getAllCompanies(),
      this.getAllInterviewProcesses(),
      this.getAllInterviewRounds(),
      this.getUserProfile(),
    ]);

    return {
      version: '1.4.0',
      exportDate: new Date(),
      companies,
      interviewProcesses: processes,
      interviewRounds: rounds,
      userProfile,
    };
  }

  async importData(data: ExportData, strategy: 'skip' | 'overwrite' = 'skip'): Promise<void> {
    const db = this.ensureDB();
    
    // 导入公司数据
    for (const company of data.companies) {
      const existing = await db.get('companies', company.id);
      if (!existing || strategy === 'overwrite') {
        await db.put('companies', company);
      }
    }

    // 导入面试流程数据
    for (const process of data.interviewProcesses) {
      const existing = await db.get('interviewProcesses', process.id);
      if (!existing || strategy === 'overwrite') {
        await db.put('interviewProcesses', process);
      }
    }

    // 导入面试轮次数据
    for (const round of data.interviewRounds) {
      const existing = await db.get('interviewRounds', round.id);
      if (!existing || strategy === 'overwrite') {
        await db.put('interviewRounds', round);
      }
    }

    // 导入用户配置
    if (strategy === 'overwrite') {
      await db.put('userProfile', data.userProfile);
    }
  }

  async getAllInterviewRounds(): Promise<InterviewRound[]> {
    const db = this.ensureDB();
    const rounds = await db.getAll('interviewRounds');
    
    // 确保Date对象正确转换
    return rounds.map(round => ({
      ...round,
      scheduledAt: new Date(round.scheduledAt),
      createdAt: new Date(round.createdAt),
      updatedAt: new Date(round.updatedAt),
    }));
  }

  // ========== 统计分析相关 ==========
  async getDashboardStats() {
    const processes = await this.getAllInterviewProcesses();
    const rounds = await this.getAllInterviewRounds();

    const ongoingInterviews = processes.filter(p => 
      ['applied', 'evaluating', 'interviewing'].includes(p.status)
    ).length;

    const pendingInterviews = rounds.filter(r => 
      r.result === 'pending'
    ).length;

    const receivedOffers = processes.filter(p => 
      p.status === 'offered'
    ).length;

    return {
      ongoingInterviews,
      pendingInterviews,
      receivedOffers,
      totalApplications: processes.length,
    };
  }
}

// 创建单例实例
export const dbService = new DatabaseService();

// 初始化数据库
export const initDatabase = async () => {
  await dbService.init();
};
