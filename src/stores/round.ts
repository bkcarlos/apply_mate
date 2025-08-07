import { defineStore } from 'pinia';
import type { InterviewRound } from '@/types';
import { storageManager, STORAGE_KEYS } from '@/utils/storage';
import { generateId } from '@/utils';
import { ROUND_STATUS } from '@/constants';
import { createError, ERROR_CODES } from '@/utils/errors';

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

    // 未来 N 天内（含今天）待进行的轮次（pending / scheduled）
    getUpcomingRounds: (state) => (days: number = 7): InterviewRound[] => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      const allowed = new Set<InterviewRound['status']>([ROUND_STATUS.PENDING, ROUND_STATUS.SCHEDULED]);
      return state.rounds
        .filter(round => {
          const scheduledTime = new Date(round.scheduledTime);
          return scheduledTime >= now &&
                 scheduledTime <= futureDate &&
                 allowed.has(round.status);
        })
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    },

    getTodayRounds: (state): InterviewRound[] => {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      const allowed = new Set<InterviewRound['status']>([ROUND_STATUS.SCHEDULED, ROUND_STATUS.COMPLETED]);
      return state.rounds
        .filter(round => {
          const scheduledTime = new Date(round.scheduledTime);
          return scheduledTime >= startOfDay &&
                 scheduledTime < endOfDay &&
                 allowed.has(round.status);
        })
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    },

    getRoundsByStatus: (state) => (status: InterviewRound['status']): InterviewRound[] => {
      return state.rounds
        .filter(round => round.status === status)
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    },

    getRoundStats: (state) => () => {
      const statusCount = state.rounds.reduce((acc, round) => {
        acc[round.status] = (acc[round.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return {
        total: state.rounds.length,
        byStatus: statusCount,
        completed: statusCount[ROUND_STATUS.COMPLETED] || 0,
        scheduled: statusCount[ROUND_STATUS.SCHEDULED] || 0,
        pending: statusCount[ROUND_STATUS.PENDING] || 0,
        cancelled: statusCount[ROUND_STATUS.CANCELLED] || 0,
      };
    },

    getInterviewerStats: (state) => () => {
      const interviewerMap = new Map<string, number>();
      state.rounds
        .filter(round => round.interviewer && round.status === ROUND_STATUS.COMPLETED)
        .forEach(round => {
          const interviewer = round.interviewer!;
          interviewerMap.set(interviewer, (interviewerMap.get(interviewer) || 0) + 1);
        });
      return Array.from(interviewerMap.entries())
        .map(([interviewer, count]) => ({ interviewer, count }))
        .sort((a, b) => b.count - a.count);
    },
  },

  actions: {
    async loadRounds() {
      this.loading = true;
      this.error = null;
      try {
        const rounds = await storageManager.get<InterviewRound[]>(STORAGE_KEYS.INTERVIEW_ROUNDS);
        // 兼容旧数据：如果存在中文状态则映射到英文
        const legacyMap: Record<string, string> = {
          '待安排': ROUND_STATUS.PENDING,
          '已安排': ROUND_STATUS.SCHEDULED,
          '已完成': ROUND_STATUS.COMPLETED,
          '已取消': ROUND_STATUS.CANCELLED,
        };
        this.rounds = (rounds || []).map(r => ({
          ...r,
          status: (legacyMap[r.status as string] as any) || r.status,
        }));
      } catch (error) {
  const appErr = createError(ERROR_CODES.STORE_SAVE_FAILED, '加载面试轮次数据失败', error);
  this.error = appErr.message;
  console.error(appErr);
      } finally {
        this.loading = false;
      }
    },

    async saveRounds() {
      try {
        await storageManager.set(STORAGE_KEYS.INTERVIEW_ROUNDS, this.rounds);
        return true;
      } catch (error) {
  const appErr = createError(ERROR_CODES.STORE_SAVE_FAILED, '保存面试轮次数据失败', error);
  this.error = appErr.message;
  console.error(appErr);
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
      if (success) return newRound;
      this.rounds.pop();
  throw createError(ERROR_CODES.STORE_SAVE_FAILED, '添加面试轮次失败');
    },

    async updateRound(id: string, updates: Partial<InterviewRound>) {
      const index = this.rounds.findIndex(round => round.id === id);
  if (index === -1) throw createError(ERROR_CODES.STORE_ENTITY_NOT_FOUND, '面试轮次不存在', undefined, { id });
      const originalRound = { ...this.rounds[index] };
      this.rounds[index] = { ...this.rounds[index], ...updates, id, updatedAt: new Date() };
      const success = await this.saveRounds();
      if (success) return this.rounds[index];
      this.rounds[index] = originalRound;
  throw createError(ERROR_CODES.STORE_SAVE_FAILED, '更新面试轮次失败');
    },

    async deleteRound(id: string) {
      const index = this.rounds.findIndex(round => round.id === id);
  if (index === -1) throw createError(ERROR_CODES.STORE_ENTITY_NOT_FOUND, '面试轮次不存在', undefined, { id });
      const deletedRound = this.rounds.splice(index, 1)[0];
      const success = await this.saveRounds();
      if (!success) {
        this.rounds.splice(index, 0, deletedRound);
  throw createError(ERROR_CODES.STORE_SAVE_FAILED, '删除面试轮次失败');
      }
      return true;
    },

    async deleteRoundsByProcess(processId: string) {
      const originalRounds = [...this.rounds];
      try {
        this.rounds = this.rounds.filter(round => round.processId !== processId);
        const success = await this.saveRounds();
  if (!success) throw createError(ERROR_CODES.STORE_SAVE_FAILED, '删除面试轮次失败');
        return true;
      } catch (error) {
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
              this.rounds[index] = { ...this.rounds[index], ...updates, updatedAt: new Date() };
            }
        });
        const success = await this.saveRounds();
  if (!success) throw createError(ERROR_CODES.STORE_SAVE_FAILED, '批量更新失败');
        return true;
      } catch (error) {
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
                 round.status !== ROUND_STATUS.CANCELLED;
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
      return this.updateRound(id, { scheduledTime: newTime, status: ROUND_STATUS.SCHEDULED });
    },

    async completeRound(id: string, feedback?: string) {
      return this.updateRound(id, { status: ROUND_STATUS.COMPLETED, feedback });
    },

    async cancelRound(id: string) {
      return this.updateRound(id, { status: ROUND_STATUS.CANCELLED });
    },

    clearError() { this.error = null; },

    async importRounds(rounds: InterviewRound[]) {
      const originalRounds = [...this.rounds];
      try {
        const existingIds = new Set(this.rounds.map(r => r.id));
        const normalized = rounds.map(r => ({
          ...r,
          status: (r.status as any) || ROUND_STATUS.PENDING,
        }));
        const toAdd = normalized.map(r => existingIds.has(r.id) ? { ...r, id: generateId() } : r);
        this.rounds.push(...toAdd);
        const success = await this.saveRounds();
  if (!success) throw createError(ERROR_CODES.STORE_SAVE_FAILED, '导入失败');
        return { imported: toAdd.length };
      } catch (error) {
        this.rounds = originalRounds;
        throw error;
      }
    },

    async exportRounds(): Promise<InterviewRound[]> { return [...this.rounds]; },

    async clearAll(): Promise<boolean> {
      try { this.rounds = []; return await this.saveRounds(); } catch (e) { console.error('清空轮次数据失败:', e); return false; }
    },
  },
});
