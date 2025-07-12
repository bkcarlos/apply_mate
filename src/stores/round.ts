import { defineStore } from 'pinia';
import type { InterviewRound } from '@/types';
import { storageManager, STORAGE_KEYS } from '@/utils/storage';
import { generateId } from '@/utils';

export const useRoundStore = defineStore('round', {
  state: () => ({
    rounds: [] as InterviewRound[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getRoundById: (state) => (id: string): InterviewRound | undefined => {
      return state.rounds.find(round => round.id === id);
    },

    getRoundsByProcess: (state) => (processId: string): InterviewRound[] => {
      return state.rounds
        .filter(round => round.processId === processId)
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    },

    getUpcomingRounds: (state) => (days: number = 7): InterviewRound[] => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      
      return state.rounds
        .filter(round => {
          const scheduledTime = new Date(round.scheduledTime);
          return scheduledTime >= now && 
                 scheduledTime <= futureDate && 
                 ['待安排', '已安排'].includes(round.status);
        })
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    },

    getTodayRounds: (state): InterviewRound[] => {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      
      return state.rounds
        .filter(round => {
          const scheduledTime = new Date(round.scheduledTime);
          return scheduledTime >= startOfDay && 
                 scheduledTime < endOfDay &&
                 ['已安排', '已完成'].includes(round.status);
        })
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    },

    getRoundsByStatus: (state) => (status: InterviewRound['status']): InterviewRound[] => {
      return state.rounds.filter(round => round.status === status);
    },
  },

  actions: {
    async loadRounds() {
      this.loading = true;
      this.error = null;
      
      try {
        const rounds = await storageManager.get<InterviewRound[]>(STORAGE_KEYS.INTERVIEW_ROUNDS);
        this.rounds = rounds || [];
      } catch (error) {
        this.error = '加载面试轮次数据失败';
        console.error('加载面试轮次数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async saveRounds() {
      try {
        await storageManager.set(STORAGE_KEYS.INTERVIEW_ROUNDS, this.rounds);
        return true;
      } catch (error) {
        this.error = '保存面试轮次数据失败';
        console.error('保存面试轮次数据失败:', error);
        return false;
      }
    },

    async addRound(roundData: Omit<InterviewRound, 'id' | 'createdAt' | 'updatedAt'>) {
      const newRound: InterviewRound = {
        ...roundData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.rounds.push(newRound);
      const success = await this.saveRounds();
      
      if (success) {
        return newRound;
      } else {
        // 回滚操作
        this.rounds.pop();
        throw new Error('添加面试轮次失败');
      }
    },

    async updateRound(id: string, updates: Partial<InterviewRound>) {
      const index = this.rounds.findIndex(round => round.id === id);
      if (index === -1) {
        throw new Error('面试轮次不存在');
      }

      const originalRound = { ...this.rounds[index] };
      
      this.rounds[index] = {
        ...this.rounds[index],
        ...updates,
        id, // 保持ID不变
        updatedAt: new Date(),
      };

      const success = await this.saveRounds();
      
      if (success) {
        return this.rounds[index];
      } else {
        // 回滚操作
        this.rounds[index] = originalRound;
        throw new Error('更新面试轮次失败');
      }
    },

    async deleteRound(id: string) {
      const index = this.rounds.findIndex(round => round.id === id);
      if (index === -1) {
        throw new Error('面试轮次不存在');
      }

      const deletedRound = this.rounds.splice(index, 1)[0];
      const success = await this.saveRounds();
      
      if (!success) {
        // 回滚操作
        this.rounds.splice(index, 0, deletedRound);
        throw new Error('删除面试轮次失败');
      }
      
      return true;
    },

    async deleteRoundsByProcess(processId: string) {
      const originalRounds = [...this.rounds];
      
      try {
        this.rounds = this.rounds.filter(round => round.processId !== processId);
        const success = await this.saveRounds();
        
        if (!success) {
          throw new Error('删除面试轮次失败');
        }
        
        return true;
      } catch (error) {
        // 回滚操作
        this.rounds = originalRounds;
        throw error;
      }
    },

    async batchUpdateRounds(ids: string[], updates: Partial<InterviewRound>) {
      const originalRounds = [...this.rounds];
      
      try {
        ids.forEach(id => {
          const index = this.rounds.findIndex(round => round.id === id);
          if (index !== -1) {
            this.rounds[index] = {
              ...this.rounds[index],
              ...updates,
              updatedAt: new Date(),
            };
          }
        });

        const success = await this.saveRounds();
        
        if (!success) {
          throw new Error('批量更新失败');
        }
        
        return true;
      } catch (error) {
        // 回滚操作
        this.rounds = originalRounds;
        throw error;
      }
    },

    async getCalendarEvents(startDate: Date, endDate: Date) {
      return this.rounds
        .filter(round => {
          const scheduledTime = new Date(round.scheduledTime);
          return scheduledTime >= startDate && 
                 scheduledTime <= endDate &&
                 round.status !== 'cancelled';
        })
        .map(round => ({
          id: round.id,
          title: round.roundName,
          start: round.scheduledTime,
          processId: round.processId,
          status: round.status,
          interviewer: round.interviewer,
        }));
    },

    async rescheduleRound(id: string, newTime: Date) {
      return this.updateRound(id, {
        scheduledTime: newTime,
        status: 'scheduled' as const,
      });
    },

    async completeRound(id: string, feedback?: string) {
      return this.updateRound(id, {
        status: 'completed' as const,
        feedback,
      });
    },

    async cancelRound(id: string) {
      return this.updateRound(id, {
        status: 'cancelled' as const,
      });
    },

    clearError() {
      this.error = null;
    },

    // 导入导出功能
    async importRounds(rounds: InterviewRound[]) {
      const originalRounds = [...this.rounds];
      
      try {
        this.rounds.push(...rounds);
        const success = await this.saveRounds();
        
        if (!success) {
          throw new Error('导入失败');
        }
        
        return { imported: rounds.length };
      } catch (error) {
        // 回滚操作
        this.rounds = originalRounds;
        throw error;
      }
    },

    async exportRounds(): Promise<InterviewRound[]> {
      return [...this.rounds];
    },

    // 统计功能
    getRoundStats() {
      const statusCount = this.rounds.reduce((acc, round) => {
        acc[round.status] = (acc[round.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: this.rounds.length,
        byStatus: statusCount,
        completed: statusCount['已完成'] || 0,
        scheduled: statusCount['已安排'] || 0,
        pending: statusCount['待安排'] || 0,
        cancelled: statusCount['已取消'] || 0,
      };
    },

    getInterviewerStats() {
      const interviewerMap = new Map<string, number>();
      
      this.rounds
        .filter(round => round.interviewer && round.status === 'completed')
        .forEach(round => {
          const interviewer = round.interviewer!;
          interviewerMap.set(interviewer, (interviewerMap.get(interviewer) || 0) + 1);
        });

      return Array.from(interviewerMap.entries())
        .map(([interviewer, count]) => ({ interviewer, count }))
        .sort((a, b) => b.count - a.count);
    },
  },
});
