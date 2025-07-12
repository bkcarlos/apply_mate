import { defineStore } from 'pinia';
import type { UserProfile, IncomeOption, IncomeProjection } from '@/types';
import { storageManager, STORAGE_KEYS } from '@/utils/storage';
import { generateId, calculateIncreasePercentage } from '@/utils';

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    currentMonthlySalary: (state): number | null => {
      return state.profile?.currentMonthlySalary || null;
    },

    hasProfile: (state): boolean => {
      return state.profile !== null;
    },
  },

  actions: {
    async loadProfile() {
      this.loading = true;
      this.error = null;
      
      try {
        const profile = await storageManager.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
        this.profile = profile || {
          id: 'default',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (error) {
        this.error = '加载用户配置失败';
        console.error('加载用户配置失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async saveProfile() {
      if (!this.profile) return false;
      
      try {
        await storageManager.set(STORAGE_KEYS.USER_PROFILE, this.profile);
        return true;
      } catch (error) {
        this.error = '保存用户配置失败';
        console.error('保存用户配置失败:', error);
        return false;
      }
    },

    async updateProfile(updates: Partial<UserProfile>) {
      if (!this.profile) {
        this.profile = {
          id: 'default',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      const originalProfile = { ...this.profile };
      
      this.profile = {
        ...this.profile,
        ...updates,
        updatedAt: new Date(),
      };

      const success = await this.saveProfile();
      
      if (!success) {
        // 回滚操作
        this.profile = originalProfile;
        throw new Error('更新用户配置失败');
      }
      
      return this.profile;
    },

    async updateCurrentSalary(monthlySalary: number) {
      return this.updateProfile({ currentMonthlySalary: monthlySalary });
    },

    clearError() {
      this.error = null;
    },

    // 年度收入规划功能
    calculateIncomeProjections(
      options: IncomeOption[], 
      switchDate: Date = new Date()
    ): IncomeProjection[] {
      const currentSalary = this.currentMonthlySalary || 0;
      const switchMonth = switchDate.getMonth() + 1; // 月份从1开始
      
      const currentYearRemainMonths = 12 - switchMonth + 1;
      const currentYearWorkedMonths = switchMonth - 1;

      return options.map(option => {
        let oldJobIncome = 0;
        let newJobIncome = 0;
        let totalAnnualIncome = 0;

        if (option.type === 'current') {
          // 当前工作 - 全年收入
          totalAnnualIncome = currentSalary * 12;
          oldJobIncome = totalAnnualIncome;
          newJobIncome = 0;
        } else {
          // 新工作 - 计算切换后的收入
          const monthlyFromNewJob = option.annualPackage / 12;
          
          oldJobIncome = currentSalary * currentYearWorkedMonths;
          newJobIncome = monthlyFromNewJob * currentYearRemainMonths;
          totalAnnualIncome = oldJobIncome + newJobIncome;
        }

        const monthlyIncrease = (totalAnnualIncome - currentSalary * 12) / 12;
        const increasePercentage = calculateIncreasePercentage(
          currentSalary * 12, 
          totalAnnualIncome
        );

        return {
          option,
          oldJobIncome,
          newJobIncome,
          totalAnnualIncome,
          monthlyIncrease,
          increasePercentage,
        };
      });
    },

    createVirtualOffer(
      companyName: string, 
      position: string, 
      annualPackage: number
    ): IncomeOption {
      return {
        id: generateId(),
        type: 'virtual',
        label: `${companyName} - ${position}`,
        companyName,
        position,
        annualPackage,
      };
    },

    getCurrentOption(): IncomeOption | null {
      if (!this.currentMonthlySalary) return null;
      
      return {
        id: 'current',
        type: 'current',
        label: '当前工作',
        annualPackage: this.currentMonthlySalary * 12,
      };
    },

    // 导入导出功能
    async exportProfile(): Promise<UserProfile | null> {
      return this.profile;
    },

    async importProfile(profile: UserProfile) {
      const originalProfile = this.profile;
      
      try {
        this.profile = profile;
        const success = await this.saveProfile();
        
        if (!success) {
          throw new Error('导入失败');
        }
        
        return true;
      } catch (error) {
        // 回滚操作
        this.profile = originalProfile;
        throw error;
      }
    },

    // 重置功能
    async resetProfile() {
      this.profile = {
        id: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return this.saveProfile();
    },
  },
});
