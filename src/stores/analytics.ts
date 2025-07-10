import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useInterviewStore } from './interview';
import { useCompanyStore } from './company';
import type { DashboardStats, ChannelStats, YearlyIncomeAnalysis, VirtualOffer } from '@/types';

export const useAnalyticsStore = defineStore('analytics', () => {
  const interviewStore = useInterviewStore();
  const companyStore = useCompanyStore();

  // 仪表盘统计
  const dashboardStats = computed((): DashboardStats => {
    const ongoingInterviews = interviewStore.getOngoingProcesses.length;
    const pendingInterviews = interviewStore.getPendingRounds.length;
    const receivedOffers = interviewStore.getOfferedProcesses.length;
    const totalApplications = interviewStore.processes.length;

    return {
      ongoingInterviews,
      pendingInterviews,
      receivedOffers,
      totalApplications,
    };
  });

  // 渠道效率统计
  const channelStats = computed((): ChannelStats[] => {
    const channelMap = new Map<string, { total: number; success: number }>();

    interviewStore.processes.forEach(process => {
      const channel = process.sourceChannel;
      const stats = channelMap.get(channel) || { total: 0, success: 0 };
      stats.total++;
      
      if (process.status === 'offered' || process.conclusion === 'passed') {
        stats.success++;
      }
      
      channelMap.set(channel, stats);
    });

    return Array.from(channelMap.entries()).map(([channel, stats]) => ({
      channel,
      totalCount: stats.total,
      successCount: stats.success,
      successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0,
    }));
  });

  // 薪资对比数据
  const salaryComparisonData = computed(() => {
    return interviewStore.getOfferedProcesses
      .filter(process => process.offeredSalary)
      .map(process => {
        const company = companyStore.getCompanyById(process.companyId);
        return {
          id: process.id,
          companyName: company?.name || 'Unknown',
          position: process.position,
          city: process.city,
          salary: process.offeredSalary!,
        };
      });
  });

  // 年度收入分析
  const calculateYearlyIncomeAnalysis = (
    currentMonthlySalary: number,
    handoverDate: Date,
    selectedOffers: string[],
    virtualOffers: VirtualOffer[] = []
  ): YearlyIncomeAnalysis[] => {
    const results: YearlyIncomeAnalysis[] = [];
    const currentYear = new Date().getFullYear();
    const yearEnd = new Date(currentYear, 11, 31); // 12月31日
    
    // 计算从交接日期到年底的月数
    const monthsInNewJob = Math.max(0, 
      (yearEnd.getTime() - handoverDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    );
    const monthsInOldJob = 12 - monthsInNewJob;

    // 当前工作收入分析
    const currentYearlyIncome = currentMonthlySalary * 12;
    results.push({
      companyName: '当前状况',
      yearlyTotal: currentYearlyIncome,
      estimatedYearlyIncome: currentYearlyIncome,
      monthlyIncrease: 0,
      increasePercentage: 0,
    });

    // 分析选中的Offer
    selectedOffers.forEach(processId => {
      const process = interviewStore.getProcessById(processId);
      if (process?.offeredSalary) {
        const company = companyStore.getCompanyById(process.companyId);
        const newMonthlyBase = process.offeredSalary.base;
        const estimatedYearlyIncome = 
          (currentMonthlySalary * monthsInOldJob) + 
          (newMonthlyBase * monthsInNewJob);
        
        const monthlyIncrease = newMonthlyBase - currentMonthlySalary;
        const increasePercentage = (monthlyIncrease / currentMonthlySalary) * 100;

        results.push({
          companyName: company?.name || 'Unknown',
          yearlyTotal: process.offeredSalary.base * (12 + process.offeredSalary.typicalMonths),
          estimatedYearlyIncome,
          monthlyIncrease,
          increasePercentage,
        });
      }
    });

    // 分析虚拟Offer
    virtualOffers.forEach(offer => {
      const newMonthlyBase = offer.yearlyTotal / 12;
      const estimatedYearlyIncome = 
        (currentMonthlySalary * monthsInOldJob) + 
        (newMonthlyBase * monthsInNewJob);
      
      const monthlyIncrease = newMonthlyBase - currentMonthlySalary;
      const increasePercentage = (monthlyIncrease / currentMonthlySalary) * 100;

      results.push({
        companyName: offer.companyName,
        yearlyTotal: offer.yearlyTotal,
        estimatedYearlyIncome,
        monthlyIncrease,
        increasePercentage,
      });
    });

    return results;
  };

  return {
    dashboardStats,
    channelStats,
    salaryComparisonData,
    calculateYearlyIncomeAnalysis,
  };
});
