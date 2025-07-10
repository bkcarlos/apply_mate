import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InterviewProcess, InterviewRound } from '@/types';
import { dbService } from '@/services/database';

export const useInterviewStore = defineStore('interview', () => {
  const processes = ref<InterviewProcess[]>([]);
  const rounds = ref<InterviewRound[]>([]);
  const loading = ref(false);

  // Getters
  const getProcessById = computed(() => {
    return (id: string) => processes.value.find((p: InterviewProcess) => p.id === id);
  });

  const getProcessesByCompany = computed(() => {
    return (companyId: string) => processes.value.filter((p: InterviewProcess) => p.companyId === companyId);
  });

  const getRoundsByProcess = computed(() => {
    return (processId: string) => rounds.value.filter((r: InterviewRound) => r.processId === processId);
  });

  const getOfferedProcesses = computed(() => {
    return processes.value.filter((p: InterviewProcess) => p.status === '已发Offer');
  });

  const getOngoingProcesses = computed(() => {
    return processes.value.filter((p: InterviewProcess) => 
      ['投递中', '评估中', '面试中'].includes(p.status)
    );
  });

  const getPendingRounds = computed(() => {
    return rounds.value.filter((r: InterviewRound) => r.status === '待安排');
  });

  // Actions
  const loadProcesses = async () => {
    loading.value = true;
    try {
      processes.value = await dbService.getAllInterviewProcesses();
    } catch (error) {
      console.error('Failed to load interview processes:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const loadRounds = async () => {
    try {
      rounds.value = await dbService.getAllInterviewRounds();
    } catch (error) {
      console.error('Failed to load interview rounds:', error);
      throw error;
    }
  };

  const addProcess = async (processData: Omit<InterviewProcess, 'id' | 'createTime' | 'updateTime'>) => {
    try {
      const newProcess = await dbService.addInterviewProcess(processData);
      processes.value.push(newProcess);
      return newProcess;
    } catch (error) {
      console.error('Failed to add interview process:', error);
      throw error;
    }
  };

  const updateProcess = async (id: string, updates: Partial<InterviewProcess>) => {
    try {
      const updatedProcess = await dbService.updateInterviewProcess(id, updates);
      const index = processes.value.findIndex((p: InterviewProcess) => p.id === id);
      if (index !== -1) {
        processes.value[index] = updatedProcess;
      }
      return updatedProcess;
    } catch (error) {
      console.error('Failed to update interview process:', error);
      throw error;
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      await dbService.deleteInterviewProcess(id);
      processes.value = processes.value.filter((p: InterviewProcess) => p.id !== id);
      // 同时删除相关的轮次
      rounds.value = rounds.value.filter((r: InterviewRound) => r.processId !== id);
    } catch (error) {
      console.error('Failed to delete interview process:', error);
      throw error;
    }
  };

  const addRound = async (roundData: Omit<InterviewRound, 'id' | 'createTime' | 'updateTime'>) => {
    try {
      const newRound = await dbService.addInterviewRound(roundData);
      rounds.value.push(newRound);
      return newRound;
    } catch (error) {
      console.error('Failed to add interview round:', error);
      throw error;
    }
  };

  const updateRound = async (updates: Partial<InterviewRound>) => {
    try {
      if (!updates.id) {
        throw new Error('Round ID is required for update');
      }
      
      console.log('Store updateRound called with:', updates);
      
      const updatedRound = await dbService.updateInterviewRound(updates.id, updates);
      const index = rounds.value.findIndex((r: InterviewRound) => r.id === updates.id);
      if (index !== -1) {
        rounds.value[index] = updatedRound;
      }
      return updatedRound;
    } catch (error) {
      console.error('Failed to update interview round:', error);
      throw error;
    }
  };

  const deleteRound = async (id: string) => {
    try {
      await dbService.deleteInterviewRound(id);
      rounds.value = rounds.value.filter((r: InterviewRound) => r.id !== id);
    } catch (error) {
      console.error('Failed to delete interview round:', error);
      throw error;
    }
  };

  const loadProcessRounds = async (processId: string) => {
    try {
      const processRounds = await dbService.getInterviewRoundsByProcess(processId);
      // 更新或添加轮次到全局状态
      processRounds.forEach(round => {
        const existingIndex = rounds.value.findIndex((r: InterviewRound) => r.id === round.id);
        if (existingIndex !== -1) {
          rounds.value[existingIndex] = round;
        } else {
          rounds.value.push(round);
        }
      });
      return processRounds;
    } catch (error) {
      console.error('Failed to load process rounds:', error);
      throw error;
    }
  };

  return {
    processes,
    rounds,
    loading,
    getProcessById,
    getProcessesByCompany,
    getRoundsByProcess,
    getOfferedProcesses,
    getOngoingProcesses,
    getPendingRounds,
    loadProcesses,
    loadRounds,
    addProcess,
    updateProcess,
    deleteProcess,
    addRound,
    updateRound,
    deleteRound,
    loadProcessRounds,
  };
});
