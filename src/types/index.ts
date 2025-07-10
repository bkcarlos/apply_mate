// 公司信息
export interface Company {
  id: string; // 唯一ID
  name: string; // 公司名称
  industry?: string; // 所属行业
  scale?: string; // 公司规模, 如 "100-500人"
  website?: string; // 公司官网
  logoUrl?: string; // 公司 Logo 的 URL
  createTime: Date;
  updateTime: Date;
}

// 面试流程状态
export type InterviewStatus = '投递中' | '评估中' | '面试中' | '已发Offer' | '已拒绝' | '已结束';

// 面试结论
export type InterviewConclusion = '未开始' | '进行中' | '通过' | '未通过' | '待定';

// 薪资信息
export interface SalaryInfo {
  base: number; // 基础月薪
  yearEndMonths: number; // 年终奖几个月
  guaranteedMonths: number; // 保底几个月 (包含年终)
  typicalMonths: number; // 过去大多数情况几个月 (包含年终)
  // 计算属性在运行时生成：
  // minTotal = base * (12 + guaranteedMonths)
  // typicalTotal = base * (12 + typicalMonths) 
  // maxTotal = base * (12 + yearEndMonths)
}

// 面试流程
export interface InterviewProcess {
  id: string; // 唯一ID, e.g., UUID
  companyId: string; // 关联的公司ID
  position: string; // 投递的岗位，如 "前端开发工程师"
  city: string; // 工作城市
  status: InterviewStatus; // 当前总体状态
  conclusion: InterviewConclusion; // 当前最终结论
  sourceChannel: string; // 邀约/投递渠道，如 "Boss直聘", "内推", "LinkedIn"
  expectedSalary: { min: number; max: number }; // 期望薪资范围
  offeredSalary?: SalaryInfo; // 如果有Offer，记录薪资详情
  appliedAt: Date; // 投递时间
  updatedAt: Date; // 最后更新时间
  notes?: string; // 备注
}

// 面试轮次状态  
export type RoundResult = 'pending' | 'passed' | 'failed' | 'cancelled';

// 面试轮次类型
export type RoundType = 'phone' | 'video' | 'onsite' | 'technical' | 'hr' | 'final';

// 面试轮次
export interface InterviewRound {
  id: string; // 唯一ID
  processId: string; // 关联的面试流程ID
  round: number; // 轮次编号，如 1, 2, 3
  type: RoundType; // 面试类型
  scheduledAt: Date; // 安排的面试时间
  result: RoundResult; // 面试结果
  interviewer?: string; // 面试官姓名/职位
  location?: string; // 面试地点
  feedback?: string; // 面试反馈记录
  notes?: string; // 备注
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}

// 用户配置
export interface UserProfile {
  id: string; // 关联的用户ID
  currentMonthlySalary?: number; // 用户当前的税前月薪，用于年度收入模拟
}

// 虚拟Offer（用于对比分析）
export interface VirtualOffer {
  id: string;
  companyName: string;
  position: string;
  yearlyTotal: number;
}

// 年度收入分析结果
export interface YearlyIncomeAnalysis {
  companyName: string;
  yearlyTotal: number;
  estimatedYearlyIncome: number;
  monthlyIncrease: number;
  increasePercentage: number;
}

// 导出数据结构
export interface ExportData {
  version: string;
  exportDate: Date;
  companies: Company[];
  interviewProcesses: InterviewProcess[];
  interviewRounds: InterviewRound[];
  userProfile: UserProfile;
}

// 渠道统计
export interface ChannelStats {
  channel: string;
  totalCount: number;
  successCount: number;
  successRate: number;
}

// 仪表盘统计数据
export interface DashboardStats {
  ongoingInterviews: number;
  pendingInterviews: number;
  receivedOffers: number;
  totalApplications: number;
}
