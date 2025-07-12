import type { Company, InterviewProcess, InterviewRound } from '@/types'
import { generateId } from './index'

// 测试公司数据
export const generateTestCompanies = (): Company[] => {
  const companies: Company[] = [
    {
      id: generateId(),
      name: '阿里巴巴',
      type: 'large',
      industry: 'internet',
      size: 'huge',
      location: '杭州',
      website: 'https://www.alibaba.com',
      rating: 4.2,
      description: '全球领先的云计算及人工智能科技公司',
      notes: '技术氛围好，福利待遇不错',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '腾讯',
      type: 'large',
      industry: 'internet',
      size: 'huge',
      location: '深圳',
      website: 'https://www.tencent.com',
      rating: 4.1,
      description: '中国领先的互联网增值服务提供商',
      notes: '产品导向，用户体验重视',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '字节跳动',
      type: 'large',
      industry: 'internet',
      size: 'huge',
      location: '北京',
      website: 'https://www.bytedance.com',
      rating: 4.3,
      description: '全球化的移动互联网公司',
      notes: '工作节奏快，成长机会多',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '美团',
      type: 'large',
      industry: 'ecommerce',
      size: 'xlarge',
      location: '北京',
      website: 'https://www.meituan.com',
      rating: 3.9,
      description: '中国领先的生活服务电子商务平台',
      notes: '业务多元化，技术挑战大',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '滴滴出行',
      type: 'large',
      industry: 'automotive',
      size: 'xlarge',
      location: '北京',
      website: 'https://www.didiglobal.com',
      rating: 3.8,
      description: '全球领先的移动出行平台',
      notes: '算法和大数据技术领先',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '小米',
      type: 'listed',
      industry: 'manufacturing',
      size: 'xlarge',
      location: '北京',
      website: 'https://www.mi.com',
      rating: 4.0,
      description: '以手机、智能硬件和IoT平台为核心的互联网公司',
      notes: '硬件+软件+互联网服务',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '京东',
      type: 'listed',
      industry: 'ecommerce',
      size: 'huge',
      location: '北京',
      website: 'https://www.jd.com',
      rating: 3.9,
      description: '中国领先的技术驱动的电商和零售基础设施服务商',
      notes: '物流技术强，供应链完善',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '网易',
      type: 'listed',
      industry: 'gaming',
      size: 'large',
      location: '杭州',
      website: 'https://www.163.com',
      rating: 4.0,
      description: '中国领先的互联网技术公司',
      notes: '游戏业务强，技术实力雄厚',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '百度',
      type: 'listed',
      industry: 'ai',
      size: 'xlarge',
      location: '北京',
      website: 'https://www.baidu.com',
      rating: 3.7,
      description: '全球领先的人工智能平台型公司',
      notes: 'AI技术领先，搜索引擎核心',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: '华为',
      type: 'large',
      industry: 'manufacturing',
      size: 'huge',
      location: '深圳',
      website: 'https://www.huawei.com',
      rating: 4.1,
      description: '全球领先的ICT基础设施和智能终端提供商',
      notes: '技术研发投入大，国际化程度高',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
  
  return companies
}

// 测试面试流程数据
export const generateTestInterviews = (companies: Company[]): InterviewProcess[] => {
  const interviews: InterviewProcess[] = []
  const statuses = ['投递中', '评估中', '面试中', '已发Offer', '已拒绝', '已结束']
  const conclusions = ['未开始', '进行中', '通过', '未通过', '待定']
  const channels = ['Boss直聘', '拉勾网', '智联招聘', '猎聘', '内推', '官网投递']
  const positions = [
    '前端开发工程师',
    '后端开发工程师',
    '全栈开发工程师',
    'React开发工程师',
    'Vue.js开发工程师',
    'Node.js开发工程师',
    '高级前端工程师',
    '高级后端工程师',
    '技术专家',
    '架构师'
  ]
  
  // 为每个公司生成1-3个面试流程
  companies.forEach(company => {
    const interviewCount = Math.floor(Math.random() * 3) + 1
    
    for (let i = 0; i < interviewCount; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const conclusion = conclusions[Math.floor(Math.random() * conclusions.length)]
      const position = positions[Math.floor(Math.random() * positions.length)]
      const channel = channels[Math.floor(Math.random() * channels.length)]
      
      const baseDate = new Date()
      baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 30))
      
      const interview: InterviewProcess = {
        id: generateId(),
        companyId: company.id,
        position,
        city: company.location || '北京',
        status: status as any,
        conclusion: conclusion as any,
        sourceChannel: channel,
        expectedSalary: {
          min: Math.floor(Math.random() * 10 + 15), // 15-25k
          max: Math.floor(Math.random() * 15 + 20)  // 20-35k
        },
        createdAt: baseDate,
        updatedAt: baseDate,
        remarks: `通过${channel}投递的${position}职位，目前状态：${status}`
      }
      
      // 为已发Offer的面试添加薪资信息
      if (status === '已发Offer') {
        interview.offeredSalary = {
          base: Math.floor(Math.random() * 10 + 20), // 20-30k
          bonus: Math.floor(Math.random() * 6 + 2), // 2-8个月
          total: Math.floor(Math.random() * 50 + 300), // 300-350k年包
          options: Math.random() > 0.5 ? '有期权' : undefined
        }
      }
      
      interviews.push(interview)
    }
  })
  
  return interviews
}

// 测试面试轮次数据
export const generateTestRounds = (interviews: InterviewProcess[], companies: Company[]): InterviewRound[] => {
  const rounds: InterviewRound[] = []
  const roundNames = ['初试', '技术面试', 'HR面试', '总监面试', '终面']
  const interviewTypes = ['现场面试', '视频面试', '电话面试', '线上面试']
  const statuses = ['pending', 'scheduled', 'completed', 'cancelled']
  const interviewers = [
    '张工程师', '李技术经理', '王HR', '陈总监', '刘架构师',
    '赵产品经理', '孙技术专家', '周部门主管', '吴技术总监', '郑HR经理'
  ]
  
  // 为每个面试流程生成1-4个面试轮次
  interviews.forEach(interview => {
    const company = companies.find(c => c.id === interview.companyId)
    const roundCount = Math.floor(Math.random() * 4) + 1
    
    for (let i = 0; i < roundCount; i++) {
      const roundName = roundNames[Math.min(i, roundNames.length - 1)]
      const type = interviewTypes[Math.floor(Math.random() * interviewTypes.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const interviewer = interviewers[Math.floor(Math.random() * interviewers.length)]
      
      const scheduledDate = new Date()
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 14)) // 未来14天内
      scheduledDate.setHours(9 + Math.floor(Math.random() * 10)) // 9-18点
      scheduledDate.setMinutes(Math.floor(Math.random() * 4) * 15) // 整点或15分钟间隔
      
      const round: InterviewRound = {
        id: generateId(),
        processId: interview.id,
        companyId: interview.companyId,
        roundName,
        scheduledTime: scheduledDate,
        status: status as any,
        interviewer,
        feedback: status === 'completed' ? '面试表现良好，技术能力符合要求' : '',
        createdAt: new Date(),
        updatedAt: new Date(),
        // 扩展字段
        company,
        position: interview.position,
        round: i + 1,
        type,
        notes: `${roundName} - ${type}`,
        expectedSalary: interview.expectedSalary.max,
        result: status === 'completed' ? (Math.random() > 0.3 ? '通过' : '未通过') : undefined
      }
      
      rounds.push(round)
    }
  })
  
  return rounds
}

// 清除所有测试数据
export const clearAllTestData = () => {
  localStorage.removeItem('apply-mate-companies')
  localStorage.removeItem('apply-mate-interview-processes')
  localStorage.removeItem('apply-mate-interview-rounds')
  localStorage.removeItem('apply-mate-user-profile')
}

// 生成完整的测试数据集
export const generateCompleteTestData = () => {
  const companies = generateTestCompanies()
  const interviews = generateTestInterviews(companies)
  const rounds = generateTestRounds(interviews, companies)
  
  return {
    companies,
    interviews,
    rounds
  }
} 