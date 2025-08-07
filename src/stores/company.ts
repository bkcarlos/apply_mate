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

    // 批量操作 (增强: 支持 mode)
    /**
     * 导入公司数据
     * @param companies 待导入公司列表
     * @param options.mode 导入模式:
     *  - append(默认): 追加, 按名称去重
     *  - replace: 全量替换, 不做去重
     *  - merge: 同名合并(更新已有的非空字段, 不覆盖已有非空值)
     */
    async importCompanies(companies: Company[], options?: { mode?: 'append' | 'replace' | 'merge' }) {
      const mode = options?.mode || 'append';
      const originalCompanies = [...this.companies];

      try {
        if (mode === 'replace') {
          this.companies = [...companies];
          const success = await this.saveCompanies();
          if (!success) throw new Error('导入失败');
          return { imported: companies.length, skipped: 0, mode };
        }

        if (mode === 'append') {
          const existingNames = new Map(this.companies.map(c => [c.name.toLowerCase(), true] as const));
          let imported = 0; let skipped = 0;
          companies.forEach(c => {
            const key = c.name.toLowerCase();
            if (!existingNames.has(key)) {
              this.companies.push(c);
              existingNames.set(key, true);
              imported++;
            } else {
              skipped++;
            }
          });
          return await this._finalizeImport(originalCompanies, imported, skipped, mode);
        }

        if (mode === 'merge') {
          const nameMap = new Map(this.companies.map(c => [c.name.toLowerCase(), c] as const));
          let imported = 0; let merged = 0; let skipped = 0;
          companies.forEach(c => {
            const key = c.name.toLowerCase();
            const existing = nameMap.get(key);
            if (!existing) {
              this.companies.push(c);
              nameMap.set(key, c);
              imported++;
            } else {
              let changed = false;
              const mergedObj: Company = { ...existing };
              (Object.keys(c) as (keyof Company)[]).forEach(k => {
                const newVal = c[k];
                if (newVal !== undefined && newVal !== null && (existing as any)[k] == null) {
                  (mergedObj as any)[k] = newVal;
                  changed = true;
                }
              });
              if (changed) {
                const idx = this.companies.findIndex(cc => cc.id === existing.id);
                if (idx !== -1) {
                  this.companies[idx] = { ...mergedObj, updatedAt: new Date() };
                  merged++;
                }
              } else {
                skipped++;
              }
            }
          });
          const success = await this.saveCompanies();
          if (!success) throw new Error('导入失败');
          return { imported, merged, skipped, mode } as any;
        }
      } catch (error) {
        this.companies = originalCompanies;
        throw error;
      }
    },

    // 内部复用: 处理 append 模式的最终保存与返回
    async _finalizeImport(original: Company[], imported: number, skipped: number, mode: string) {
      const success = await this.saveCompanies();
      if (!success) {
        this.companies = original;
        throw new Error('导入失败');
      }
      return { imported, skipped, mode };
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
