import { defineStore } from 'pinia';
import type { Company } from '@/types';
import { storageManager, STORAGE_KEYS } from '@/utils/storage';
import { generateId } from '@/utils';

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [] as Company[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getCompanyById: (state) => (id: string): Company | undefined => {
      return state.companies.find(company => company.id === id);
    },

    getCompaniesByIndustry: (state) => (industry: string): Company[] => {
      return state.companies.filter(company => company.industry === industry);
    },

    getAllIndustries: (state): string[] => {
      const industries = state.companies
        .map(company => company.industry)
        .filter(Boolean) as string[];
      return [...new Set(industries)].sort();
    },

    getCompanyOptions: (state) => {
      return state.companies.map(company => ({
        label: company.name,
        value: company.id,
        logoUrl: company.logoUrl,
      }));
    },
  },

  actions: {
    async loadCompanies() {
      this.loading = true;
      this.error = null;
      
      try {
        const companies = await storageManager.get<Company[]>(STORAGE_KEYS.COMPANIES);
        this.companies = companies || [];
      } catch (error) {
        this.error = '加载公司数据失败';
        console.error('加载公司数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async saveCompanies() {
      try {
        await storageManager.set(STORAGE_KEYS.COMPANIES, this.companies);
        return true;
      } catch (error) {
        this.error = '保存公司数据失败';
        console.error('保存公司数据失败:', error);
        return false;
      }
    },

    async addCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) {
      const newCompany: Company = {
        ...companyData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.companies.push(newCompany);
      const success = await this.saveCompanies();
      
      if (success) {
        return newCompany;
      } else {
        // 回滚操作
        this.companies.pop();
        throw new Error('添加公司失败');
      }
    },

    async updateCompany(id: string, updates: Partial<Company>) {
      const index = this.companies.findIndex(company => company.id === id);
      if (index === -1) {
        throw new Error('公司不存在');
      }

      const originalCompany = { ...this.companies[index] };
      
      this.companies[index] = {
        ...this.companies[index],
        ...updates,
        id, // 保持ID不变
        updatedAt: new Date(),
      };

      const success = await this.saveCompanies();
      
      if (success) {
        return this.companies[index];
      } else {
        // 回滚操作
        this.companies[index] = originalCompany;
        throw new Error('更新公司失败');
      }
    },

    async deleteCompany(id: string) {
      const index = this.companies.findIndex(company => company.id === id);
      if (index === -1) {
        throw new Error('公司不存在');
      }

      const deletedCompany = this.companies.splice(index, 1)[0];
      const success = await this.saveCompanies();
      
      if (!success) {
        // 回滚操作
        this.companies.splice(index, 0, deletedCompany);
        throw new Error('删除公司失败');
      }
      
      return true;
    },

    async searchCompanies(keyword: string): Promise<Company[]> {
      if (!keyword.trim()) {
        return this.companies;
      }

      const searchTerm = keyword.toLowerCase().trim();
      return this.companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm) ||
        company.industry?.toLowerCase().includes(searchTerm) ||
        company.scale?.toLowerCase().includes(searchTerm)
      );
    },

    async getCompanySuggestions(keyword: string): Promise<string[]> {
      if (!keyword.trim()) {
        return [];
      }

      const searchTerm = keyword.toLowerCase().trim();
      const suggestions = this.companies
        .filter(company => company.name.toLowerCase().includes(searchTerm))
        .map(company => company.name)
        .slice(0, 10);

      return suggestions;
    },

    clearError() {
      this.error = null;
    },

    // 批量操作
    async importCompanies(companies: Company[]) {
      const originalCompanies = [...this.companies];
      
      try {
        // 去重处理：如果已存在相同名称的公司，则跳过
        const existingNames = new Set(this.companies.map(c => c.name.toLowerCase()));
        const newCompanies = companies.filter(c => !existingNames.has(c.name.toLowerCase()));
        
        this.companies.push(...newCompanies);
        const success = await this.saveCompanies();
        
        if (!success) {
          throw new Error('导入失败');
        }
        
        return {
          imported: newCompanies.length,
          skipped: companies.length - newCompanies.length,
        };
      } catch (error) {
        // 回滚操作
        this.companies = originalCompanies;
        throw error;
      }
    },

    async exportCompanies(): Promise<Company[]> {
      return [...this.companies];
    },

    async clearAll(): Promise<boolean> {
      try {
        this.companies = [];
        return await this.saveCompanies();
      } catch (error) {
        console.error('清空公司数据失败:', error);
        return false;
      }
    },
  },
});
