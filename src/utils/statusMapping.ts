import { ROUND_STATUS } from '@/constants';

// 统一状态 -> i18n key 映射
export const roundStatusI18nKey: Record<string, string> = {
  [ROUND_STATUS.PENDING]: 'analysis.statusMap.pending',
  [ROUND_STATUS.SCHEDULED]: 'analysis.statusMap.scheduled',
  [ROUND_STATUS.COMPLETED]: 'analysis.statusMap.completed',
  [ROUND_STATUS.CANCELLED]: 'analysis.statusMap.cancelled'
};

export const mapRoundStatusToLabel = (status: string, t: (k: string) => string): string => {
  const key = roundStatusI18nKey[status];
  return key ? t(key) : status;
};
