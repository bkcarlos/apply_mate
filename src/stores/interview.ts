import { defineStore } from 'pinia';
import type { InterviewProcess, InterviewFilterParams, DashboardStats } from '@/types';
import { storageManager, STORAGE_KEYS } from '@/utils/storage';
import { generateId, formatDate } from '@/utils';
import { useCompanyStore } from '@/stores/company';

export const useInterviewStore = defineStore('interview', {
  state: () => ({
    interviews: [] as InterviewProcess[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getInterviewById: (state) => (id: string): InterviewProcess | undefined => {
      return state.interviews.find(interview => interview.id === id);
    },

    getInterviewsByCompany: (state) => (companyId: string): InterviewProcess[] => {
      return state.interviews.filter(interview => interview.companyId === companyId);
    },

    getInterviewsByStatus: (state) => (status: string): InterviewProcess[] => {
      return state.interviews.filter(interview => interview.status === status);
    },

    getOngoingInterviews: (state): InterviewProcess[] => {
      return state.interviews.filter(interview => 
        ['评估中', '面试中'].includes(interview.status)
      );
    },

    getReceivedOffers: (state): InterviewProcess[] => {
      return state.interviews.filter(interview => interview.status === '已发Offer');
    },

    getDashboardStats: (state): DashboardStats => {
      return {
        ongoingInterviews: state.interviews.filter(i => 
          ['评估中', '面试中'].includes(i.status)
        ).length,
        pendingInterviews: state.interviews.filter(i => 
          i.status === '投递中'
        ).length,
        receivedOffers: state.interviews.filter(i => 
          i.status === '已发Offer'
        ).length,
        totalApplications: state.interviews.length,
      };
    },

    getChannelStats: (state) => {
      const channelMap = new Map<string, { total: number; offers: number }>();
      
      state.interviews.forEach(interview => {
        const channel = interview.sourceChannel;
        const current = channelMap.get(channel) || { total: 0, offers: 0 };
        
        current.total += 1;
        if (interview.status === '已发Offer') {
          current.offers += 1;
        }
        
        channelMap.set(channel, current);
      });

      return Array.from(channelMap.entries()).map(([channel, stats]) => ({
        channel,
        applications: stats.total,
        offers: stats.offers,
        successRate: stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0,
      }));
    },

    getOfferComparisons: (state) => {
      const companyStore = useCompanyStore();
      const companyMap = companyStore.companies.reduce((acc: Record<string, string>, c) => {
        acc[c.id] = c.name;
        return acc;
      }, {} as Record<string, string>);
      return state.interviews
        .filter(interview => interview.status === '已发Offer' && interview.offeredSalary)
        .map(interview => ({
          id: interview.id,
          companyName: companyMap[interview.companyId] || interview.companyId,
          position: interview.position,
          monthlySalary: interview.offeredSalary!.base,
          baseAnnualSalary: interview.offeredSalary!.base * 12,
          minAnnualPackage: interview.offeredSalary!.base * 12,
          standardAnnualPackage: interview.offeredSalary!.total,
          maxAnnualPackage: interview.offeredSalary!.total + (interview.offeredSalary!.bonus || 0),
        }));
    },

    // 为兼容性添加别名
    processes: (state): InterviewProcess[] => {
      return state.interviews;
    },

    rounds: (state): InterviewProcess[] => {
      return state.interviews;
    },
  },

  actions: {
    async loadInterviews() {
      this.loading = true;
      this.error = null;
      
      try {
        const interviews = await storageManager.get<InterviewProcess[]>(STORAGE_KEYS.INTERVIEW_PROCESSES);
        this.interviews = interviews || [];
      } catch (error) {
        this.error = '加载面试数据失败';
        console.error('加载面试数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async saveInterviews() {
      try {
        await storageManager.set(STORAGE_KEYS.INTERVIEW_PROCESSES, this.interviews);
        return true;
      } catch (error) {
        this.error = '保存面试数据失败';
        console.error('保存面试数据失败:', error);
        return false;
      }
    },

    async addInterview(interviewData: Omit<InterviewProcess, 'id' | 'createdAt' | 'updatedAt'>) {
      const newInterview: InterviewProcess = {
        ...interviewData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.interviews.push(newInterview);
      const success = await this.saveInterviews();
      
      if (success) {
        return newInterview;
      } else {
        // 回滚操作
        this.interviews.pop();
        throw new Error('添加面试流程失败');
      }
    },

    async updateInterview(id: string, updates: Partial<InterviewProcess>) {
      const index = this.interviews.findIndex(interview => interview.id === id);
      if (index === -1) {
        throw new Error('面试流程不存在');
      }

      const originalInterview = { ...this.interviews[index] };
      
      this.interviews[index] = {
        ...this.interviews[index],
        ...updates,
        id, // 保持ID不变
        updatedAt: new Date(),
      };

      const success = await this.saveInterviews();
      
      if (success) {
        return this.interviews[index];
      } else {
        // 回滚操作
        this.interviews[index] = originalInterview;
        throw new Error('更新面试流程失败');
      }
    },

    async deleteInterview(id: string) {
      const index = this.interviews.findIndex(interview => interview.id === id);
      if (index === -1) {
        throw new Error('面试流程不存在');
      }

      const deletedInterview = this.interviews.splice(index, 1)[0];
      const success = await this.saveInterviews();
      
      if (!success) {
        // 回滚操作
        this.interviews.splice(index, 0, deletedInterview);
        throw new Error('删除面试流程失败');
      }
      
      return true;
    },

    async filterInterviews(filters: InterviewFilterParams): Promise<InterviewProcess[]> {
      let filtered = [...this.interviews];

      if (filters.companyId) {
        filtered = filtered.filter(interview => interview.companyId === filters.companyId);
      }

      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(interview => filters.status!.includes(interview.status));
      }

      if (filters.city) {
        filtered = filtered.filter(interview => 
          interview.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }

      if (filters.sourceChannel) {
        filtered = filtered.filter(interview => interview.sourceChannel === filters.sourceChannel);
      }

      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filtered = filtered.filter(interview =>
          interview.position.toLowerCase().includes(keyword) ||
          interview.remarks?.toLowerCase().includes(keyword)
        );
      }

      return filtered;
    },

    async batchUpdateStatus(ids: string[], status: InterviewProcess['status']) {
      const originalInterviews = [...this.interviews];
      
      try {
        ids.forEach(id => {
          const index = this.interviews.findIndex(interview => interview.id === id);
          if (index !== -1) {
            this.interviews[index] = {
              ...this.interviews[index],
              status,
              updatedAt: new Date(),
            };
          }
        });

        const success = await this.saveInterviews();
        
        if (!success) {
          throw new Error('批量更新失败');
        }
        
        return true;
      } catch (error) {
        // 回滚操作
        this.interviews = originalInterviews;
        throw error;
      }
    },

    async batchDelete(ids: string[]) {
      const originalInterviews = [...this.interviews];
      
      try {
        this.interviews = this.interviews.filter(interview => !ids.includes(interview.id));
        const success = await this.saveInterviews();
        
        if (!success) {
          throw new Error('批量删除失败');
        }
        
        return true;
      } catch (error) {
        // 回滚操作
        this.interviews = originalInterviews;
        throw error;
      }
    },

    clearError() {
      this.error = null;
    },

    // 导入导出功能
    async importInterviews(interviews: InterviewProcess[]) {
      const originalInterviews = [...this.interviews];
      
      try {
  const existingIds = new Set(this.interviews.map(i => i.id));
  const toAdd = interviews.map(i => existingIds.has(i.id) ? { ...i, id: generateId() } : i);
  this.interviews.push(...toAdd);
        const success = await this.saveInterviews();
        
        if (!success) {
          throw new Error('导入失败');
        }
        
  return { imported: toAdd.length };
      } catch (error) {
        // 回滚操作
        this.interviews = originalInterviews;
        throw error;
      }
    },

    async exportInterviews(): Promise<InterviewProcess[]> {
      return [...this.interviews];
    },

    // 统计分析相关
    getInterviewTrends(days: number = 30) {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
      
      const trends = [];
      const dateMap = new Map<string, number>();
      
      this.interviews
        .filter(interview => 
          new Date(interview.createdAt) >= startDate && 
          new Date(interview.createdAt) <= endDate
        )
        .forEach(interview => {
          const dateKey = formatDate(interview.createdAt);
          dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
        });

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateKey = formatDate(date);
        trends.push({
          date: dateKey,
          count: dateMap.get(dateKey) || 0,
        });
      }

      return trends;
    },

    // 为兼容性添加别名方法
    async loadProcesses() {
      return this.loadInterviews();
    },

    async loadRounds() {
      return this.loadInterviews();
    },

    async addRound(data: any) {
      return this.addInterview(data);
    },

    async updateRound(id: string, updates: any) {
      return this.updateInterview(id, updates);
    },

    async deleteRound(id: string) {
      return this.deleteInterview(id);
    },

    async clearAll(): Promise<boolean> {
      try {
        this.interviews = [];
        return await this.saveInterviews();
      } catch (error) {
        console.error('清空面试数据失败:', error);
        return false;
      }
    },
  },
});
