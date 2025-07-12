// 公司信息接口
export interface Company {
  id: string;
  name: string;
  type?: string;
  industry?: string;
  size?: string;
  scale?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  rating?: number;
  description?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 面试流程状态类型
export type InterviewStatus = '投递中' | '评估中' | '面试中' | '已发Offer' | '已拒绝' | '已结束';

// 面试结论类型
export type InterviewConclusion = '未开始' | '进行中' | '通过' | '未通过' | '待定';

// 薪资信息接口
export interface Salary {
  base: number;           // 基础月薪
  bonus: number;         // 年终奖
  options?: string;      // 期权信息
  total: number;         // 年度总包
}

// 面试流程接口
export interface InterviewProcess {
  id: string;
  companyId: string;
  position: string;
  city: string;
  status: InterviewStatus;
  conclusion: InterviewConclusion;
  sourceChannel: string;
  expectedSalary: {
    min: number;
    max: number;
  };
  offeredSalary?: Salary;
  createdAt: Date;
  updatedAt: Date;
  remarks?: string;
}

// 面试轮次状态类型
export type RoundStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';

// 面试轮次接口
export interface InterviewRound {
  id: string;
  processId: string;
  companyId: string;
  roundName: string;
  scheduledTime: Date;
  status: RoundStatus;
  interviewer?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
  // Calendar组件需要的额外属性
  company?: Company;
  position?: string;
  round?: number;
  type?: string;
  notes?: string;
  expectedSalary?: number;
  result?: string;
}

// 用户配置接口
export interface UserProfile {
  id: string;
  currentMonthlySalary?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 统计数据接口
export interface DashboardStats {
  ongoingInterviews: number;
  pendingInterviews: number;
  receivedOffers: number;
  totalApplications: number;
}

// 薪资对比数据接口
export interface OfferComparison {
  companyName: string;
  position: string;
  monthlySalary: number;
  baseAnnualSalary: number;
  minAnnualPackage: number;
  standardAnnualPackage: number;
  maxAnnualPackage: number;
}

// 渠道效率分析数据接口
export interface ChannelEfficiency {
  channel: string;
  applications: number;
  interviews: number;
  offers: number;
  successRate: number;
}

// 年度收入规划选项接口
export interface IncomeOption {
  id: string;
  type: 'current' | 'offer' | 'virtual';
  label: string;
  companyName?: string;
  position?: string;
  annualPackage: number;
  switchDate?: Date;
}

// 年度收入规划结果接口
export interface IncomeProjection {
  option: IncomeOption;
  oldJobIncome: number;
  newJobIncome: number;
  totalAnnualIncome: number;
  monthlyIncrease: number;
  increasePercentage: number;
}

// API 响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 分页请求参数接口
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应接口
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 面试流程筛选参数接口
export interface InterviewFilterParams {
  companyId?: string;
  status?: InterviewStatus[];
  city?: string;
  sourceChannel?: string;
  keyword?: string;
}

// 导出数据接口
export interface ExportData {
  version: string;
  exportDate: Date;
  companies: Company[];
  interviewProcesses: InterviewProcess[];
  interviewRounds: InterviewRound[];
  userProfile: UserProfile;
}

// 表单验证规则类型
export interface ValidationRule {
  required?: boolean;
  message?: string;
  trigger?: string | string[];
  validator?: (rule: any, value: any, callback: any) => void;
}
