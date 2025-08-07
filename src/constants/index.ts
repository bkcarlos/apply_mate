// 全局常量与枚举
export const APP_VERSION = '1.4.0';

// 面试轮次状态常量（内部统一使用英文，界面显示由 i18n/映射完成）
export const ROUND_STATUS = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type RoundStatusValue = typeof ROUND_STATUS[keyof typeof ROUND_STATUS];

// 面试流程状态（保留中文枚举供已有数据兼容，建议逐步英文化并用映射显示）
export const INTERVIEW_STATUS = {
  APPLYING: '投递中',
  EVALUATING: '评估中',
  INTERVIEWING: '面试中',
  OFFERED: '已发Offer',
  REJECTED: '已拒绝',
  CLOSED: '已结束'
} as const;

export const COLOR_PALETTE = [
  '#F28A31',
  '#6975A7',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399'
] as const;

export const APP_KEYS = {
  VERSION: 'appVersion'
} as const;
