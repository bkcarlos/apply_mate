// 公司信息
export interface Company {
  id: string
  name: string
  industry?: string
  scale?: string
  website?: string
  logoUrl?: string
}

// 面试流程
export interface InterviewProcess {
  id: string
  companyId: string
  position: string
  city: string
  status: '投递中' | '评估中' | '面试中' | '已发Offer' | '已拒绝' | '已结束'
  conclusion: '未开始' | '进行中' | '通过' | '未通过' | '待定'
  sourceChannel: string
  expectedSalary: {
    min: number
    max: number
  }
  offeredSalary?: {
    base: number
    bonus: number
    options: string
    total: number
  }
  createTime: Date
  updateTime: Date
  remarks?: string
}

// 面试轮次
export interface InterviewRound {
  id: string
  processId: string
  roundName: string
  scheduledTime: Date
  status: '待安排' | '已安排' | '已完成' | '已取消'
  interviewer?: string
  feedback?: string
}

// 用户配置
export interface UserProfile {
  id: string
  currentMonthlySalary?: number
}

// 统计数据
export interface DashboardStats {
  ongoingInterviews: number
  pendingInterviews: number
  receivedOffers: number
  totalApplications: number
}

// 图表数据
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}

// 导航菜单项
export interface MenuItem {
  path: string
  name: string
  icon: string
  title: string
}