export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    export: '导出',
    import: '导入',
    loading: '加载中...',
    noData: '暂无数据',
    operation: '操作',
    status: '状态',
    createTime: '创建时间',
    updateTime: '更新时间',
    remark: '备注',
    required: '必填',
    optional: '可选',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息'
  },

  // 导航
  nav: {
    dashboard: '工作台',
    calendar: '面试日历',
    interviews: '面试管理',
    companies: '公司管理',
    analysis: '数据分析',
    settings: '系统设置',
    profile: '个人资料',
    about: '关于',
    logout: '退出登录'
  },

  // 头部
  header: {
    brandName: 'Apply Mate',
    newInterview: '新建面试',
    todayInterviews: '今日面试',
    notifications: '通知',
    userMenu: '用户菜单',
    language: '语言'
  },

  // 工作台
  dashboard: {
    title: '工作台',
    welcome: '欢迎使用 Apply Mate！',
    overview: '概览',
    totalInterviews: '总面试数',
    pendingInterviews: '进行中',
    completedInterviews: '已完成',
    offerReceived: '收到Offer',
    upcomingInterviews: '即将到来的面试',
    recentActivity: '最近活动',
    interviewTrend: '面试趋势',
    statusDistribution: '状态分布',
    noUpcomingInterviews: '暂无即将到来的面试',
    noRecentActivity: '暂无最近活动',
    newInterview: '新建面试',
    viewCalendar: '查看日历',
    quickStart: '快速开始',
    newInterviewProcess: '新建面试流程',
    manageCompanies: '管理公司',
    ongoingInterviews: '进行中的面试',
    pendingSchedule: '待安排的面试',
    receivedOffers: '已收到 Offer',
    totalApplications: '总投递数量',
    upcomingSchedule: '近期面试安排',
    viewAll: '查看全部',
    offerSalaryComparison: 'Offer 薪资对比',
    detailedAnalysis: '详细分析'
  },

  // 面试管理
  interview: {
    title: '面试管理',
    newInterview: '新建面试',
    editInterview: '编辑面试',
    interviewDetails: '面试详情',
    companyName: '公司名称',
    position: '职位',
    interviewDate: '面试日期',
    interviewTime: '面试时间',
    interviewType: '面试类型',
    interviewer: '面试官',
    location: '地点',
    description: '描述',
    requirements: '要求',
    salary: '薪资',
    benefits: '福利',
    contactInfo: '联系信息',
    applicationStatus: '申请状态',
    interviewStatus: '面试状态',
    feedback: '反馈',
    nextStep: '下一步',
    
    // 面试类型
    types: {
      phone: '电话面试',
      video: '视频面试',
      onsite: '现场面试',
      technical: '技术面试',
      behavioral: '行为面试',
      final: '终面'
    },

    // 申请状态
    applicationStatuses: {
      applied: '已投递',
      screening: '筛选中',
      interview: '面试中',
      offer: '已获得Offer',
      rejected: '已拒绝',
      withdrawn: '已撤回'
    },

    // 面试状态
    interviewStatuses: {
      scheduled: '已安排',
      inProgress: '进行中',
      completed: '已完成',
      cancelled: '已取消',
      rescheduled: '已重新安排'
    }
  },

  // 公司管理
  company: {
    title: '公司管理',
    newCompany: '新建公司',
    editCompany: '编辑公司',
    companyDetails: '公司详情',
    companyName: '公司名称',
    industry: '行业',
    size: '公司规模',
    location: '地点',
    website: '官网',
    description: '公司描述',
    culture: '企业文化',
    benefits: '福利待遇',
    contactPerson: '联系人',
    contactEmail: '联系邮箱',
    contactPhone: '联系电话',
    notes: '备注',
    
    // 公司规模
    sizes: {
      startup: '初创公司 (1-50人)',
      small: '小型公司 (51-200人)',
      medium: '中型公司 (201-1000人)',
      large: '大型公司 (1000+人)'
    },

    // 行业
    industries: {
      technology: '科技',
      finance: '金融',
      healthcare: '医疗',
      education: '教育',
      retail: '零售',
      manufacturing: '制造业',
      consulting: '咨询',
      media: '媒体',
      other: '其他'
    }
  },

  // 面试日历
  calendar: {
    title: '面试日历',
    today: '今天',
    month: '月',
    week: '周',
    day: '日',
    agenda: '议程',
    noEvents: '暂无安排',
    createEvent: '创建事件',
    editEvent: '编辑事件',
    eventDetails: '事件详情',
    allDay: '全天',
    startTime: '开始时间',
    endTime: '结束时间',
    reminder: '提醒',
    repeat: '重复'
  },

  // 数据分析
  analysis: {
    title: '数据分析',
    overview: '概览统计',
    trends: '趋势分析',
    success: '成功率分析',
    timeline: '时间线分析',
    comparison: '对比分析',
    
    // 图表标题
    charts: {
      applicationTrend: '申请趋势',
      interviewTrend: '面试趋势',
      successRate: '成功率',
      industryDistribution: '行业分布',
      positionDistribution: '职位分布',
      salaryDistribution: '薪资分布',
      timeToOffer: '获得Offer时间',
      interviewRounds: '面试轮数分析'
    },

    // 统计指标
    metrics: {
      totalApplications: '总申请数',
      totalInterviews: '总面试数',
      totalOffers: '总Offer数',
      successRate: '成功率',
      averageSalary: '平均薪资',
      averageTime: '平均周期',
      activeApplications: '活跃申请',
      pendingInterviews: '待面试'
    }
  },

  // 系统设置
  settings: {
    title: '系统设置',
    general: '通用设置',
    notifications: '通知设置',
    privacy: '隐私设置',
    data: '数据管理',
    about: '关于',
    
    // 通用设置
    language: '语言',
    theme: '主题',
    timezone: '时区',
    dateFormat: '日期格式',
    currency: '货币',
    
    // 通知设置
    emailNotifications: '邮件通知',
    pushNotifications: '推送通知',
    reminderSettings: '提醒设置',
    interviewReminder: '面试提醒',
    applicationDeadline: '申请截止提醒',
    
    // 数据管理
    exportData: '导出数据',
    importData: '导入数据',
    backupData: '备份数据',
    clearData: '清除数据',
    dataFormat: '数据格式'
  },

  // 表单验证
  validation: {
    required: '此字段为必填项',
    email: '请输入有效的邮箱地址',
    phone: '请输入有效的电话号码',
    url: '请输入有效的网址',
    date: '请选择有效的日期',
    time: '请选择有效的时间',
    number: '请输入有效的数字',
    min: '最小值为 {min}',
    max: '最大值为 {max}',
    minLength: '最少输入 {min} 个字符',
    maxLength: '最多输入 {max} 个字符'
  },

  // 消息提示
  messages: {
    saveSuccess: '保存成功',
    saveError: '保存失败',
    deleteSuccess: '删除成功',
    deleteError: '删除失败',
    deleteConfirm: '确定要删除吗？此操作不可撤销。',
    networkError: '网络错误，请稍后重试',
    permissionDenied: '权限不足',
    dataLoadError: '数据加载失败',
    operationSuccess: '操作成功',
    operationError: '操作失败',
    noDataSelected: '请选择数据',
    invalidInput: '输入无效',
    sessionExpired: '会话已过期，请重新登录'
  },

  // 时间相关
  time: {
    now: '现在',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本周',
    lastWeek: '上周',
    nextWeek: '下周',
    thisMonth: '本月',
    lastMonth: '上月',
    nextMonth: '下月',
    thisYear: '今年',
    lastYear: '去年',
    nextYear: '明年',
    
    // 相对时间
    justNow: '刚刚',
    minutesAgo: '{n} 分钟前',
    hoursAgo: '{n} 小时前',
    daysAgo: '{n} 天前',
    weeksAgo: '{n} 周前',
    monthsAgo: '{n} 个月前',
    yearsAgo: '{n} 年前'
  },

  // 其他
  misc: {
    appName: 'Apply Mate',
    appDescription: '面试管理系统',
    version: '版本',
    copyright: '版权所有',
    poweredBy: '技术支持',
    contactUs: '联系我们',
    feedback: '意见反馈',
    help: '帮助',
    documentation: '文档',
    shortcuts: '快捷键',
    tips: '小贴士'
  }
} 