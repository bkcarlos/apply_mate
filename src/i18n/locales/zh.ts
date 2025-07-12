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
    
    // 面试详情页面
    detail: {
      back: '返回',
      title: '面试详情',
      edit: '编辑',
      delete: '删除',
      basicInfo: '基本信息',
      company: '公司',
      city: '城市',
      sourceChannel: '投递渠道',
      expectedSalary: '期望薪资',
      offeredSalary: '提供薪资',
      totalPackage: '总包',
      rounds: '面试轮次',
      addRound: '添加轮次',
      interviewer: '面试官',
      time: '时间',
      feedback: '反馈',
      noRounds: '暂无面试轮次',
      unknownCompany: '未知公司',
      notScheduled: '未安排',
      deleteConfirm: '此操作将永久删除该面试记录, 是否继续?',
      deleteTitle: '提示',
      deleteSuccess: '删除成功'
    },
    
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
    
    // 日期筛选
    dateRange: {
      separator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    },
    
    // 按钮
    exportData: '导出数据',
    
    // 统计卡片
    stats: {
      totalApplications: '总投递数',
      totalInterviews: '面试总数',
      totalOffers: '收到Offer',
      successRate: '总成功率'
    },
    
    // 图表标题
    charts: {
      applicationTrend: '投递趋势分析',
      interviewStatus: '面试状态分布',
      companyType: '公司类型分析',
      industryDistribution: '行业分布',
      interviewRound: '面试轮次分析'
    },
    
    // 表格标题
    tables: {
      companyStats: '公司投递统计',
      industryStats: '行业投递统计',
      companyName: '公司名称',
      applications: '投递数',
      interviews: '面试数',
      offers: 'Offer数',
      successRate: '成功率',
      industry: '行业',
      companies: '公司数'
    },
    
    // 状态映射
    statusMap: {
      scheduled: '已安排',
      completed: '已完成',
      cancelled: '已取消',
      pending: '待确认'
    },
    
    // 其他
    uncategorized: '未分类',
    exportInProgress: '数据导出功能开发中...',
    timeline: '时间线分析',
    comparison: '对比分析',
    
    // 统计指标
    metrics: {
      totalApplications: '总申请数',
      totalInterviews: '总面试数',
      totalOffers: '总Offer数',
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
    
    // 个人信息
    profile: {
      title: '个人信息',
      name: '姓名',
      email: '邮箱',
      phone: '手机号',
      location: '所在城市',
      jobDirection: '求职方向',
      expectedSalary: '期望薪资',
      experience: '工作经验',
      namePlaceholder: '请输入姓名',
      emailPlaceholder: '请输入邮箱',
      phonePlaceholder: '请输入手机号',
      locationPlaceholder: '请输入所在城市',
      jobDirectionPlaceholder: '如：前端开发工程师',
      expectedSalaryPlaceholder: '如：15K-25K',
      experienceOptions: {
        fresh: '应届毕业生',
        under1: '1年以下',
        '1to3': '1-3年',
        '3to5': '3-5年',
        '5to10': '5-10年',
        over10: '10年以上'
      },
      save: '保存个人信息'
    },
    
    // 系统偏好
    system: {
      title: '系统偏好',
      theme: '主题模式',
      themeOptions: {
        light: '浅色模式',
        dark: '深色模式',
        auto: '跟随系统'
      },
      defaultView: '默认视图',
      defaultViewOptions: {
        dashboard: '仪表板',
        calendar: '面试日历',
        interviews: '面试列表',
        companies: '公司管理'
      },
      autoSave: '自动保存',
      autoSaveDesc: '启用后将自动保存表单数据',
      notifications: '桌面通知',
      notificationsDesc: '面试提醒等重要通知',
      autoBackup: '数据备份',
      autoBackupDesc: '定期自动备份数据到本地',
      save: '保存系统设置'
    },
    
    // 数据管理
    dataManagement: {
      title: '数据管理',
      importExport: '数据导入导出',
      exportAll: '导出所有数据',
      importData: '导入数据',
      dataCleaning: '数据清理',
      clearCompleted: '清理已完成面试',
      clearCancelled: '清理已取消面试',
      clearAll: '清空所有数据',
      exportSuccess: '数据导出成功',
      exportFailed: '导出失败',
      importSuccess: '数据导入成功',
      importFailed: '导入失败',
      importConfirm: '导入数据将覆盖现有数据，确定要继续吗？',
      importTitle: '导入确认',
      dataFormatError: '数据格式不正确',
      clearCompletedConfirm: '确定要清理所有已完成的面试记录吗？',
      clearCancelledConfirm: '确定要清理所有已取消的面试记录吗？',
      clearAllConfirm: '确定要清空所有数据吗？此操作不可恢复！',
      clearAllFinalConfirm: '请再次确认，这将删除所有公司、面试、投递记录！',
      clearTitle: '清理确认',
      clearDangerTitle: '危险操作确认',
      clearFinalTitle: '最终确认',
      clearSuccess: '所有数据已清空',
      clearFailed: '清空失败',
      clearedRecords: '已清理 {count} 条记录'
    },
    
    // 使用统计
    stats: {
      title: '使用统计',
      registerTime: '注册时间',
      totalApplications: '总投递数',
      totalInterviews: '总面试数',
      totalOffers: '收到Offer',
      dataStorage: '数据存储',
      lastUsed: '最后使用',
      unknown: '未知'
    },
    
    // 快捷操作
    quickActions: {
      title: '快捷操作',
      newInterview: '新增面试',
      newCompany: '新增公司',
      viewCalendar: '查看日历',
      dataAnalysis: '数据分析'
    },
    
    // 系统信息
    systemInfo: {
      title: '系统信息',
      appVersion: '应用版本',
      buildTime: '构建时间',
      browser: '浏览器',
      storage: '存储方式'
    },
    
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

  // 404页面
  notFound: {
    title: '页面未找到',
    message: '抱歉，您访问的页面不存在或已被移动。',
    backHome: '返回首页',
    goBack: '返回上页',
    suggestions: '您可能在寻找：',
    links: {
      dashboard: '数据仪表板',
      calendar: '面试日历',
      interviews: '面试管理',
      companies: '公司管理',
      analysis: '数据分析',
      settings: '系统设置'
    }
  },

  // 公司表单
  companyForm: {
    // 表单标签
    labels: {
      name: '公司名称',
      type: '公司类型',
      industry: '所属行业',
      size: '公司规模',
      location: '公司地址',
      website: '官方网站',
      rating: '公司评分',
      description: '公司介绍',
      notes: '备注信息'
    },
    
    // 占位符
    placeholders: {
      name: '请输入公司名称',
      type: '选择公司类型',
      industry: '选择所属行业',
      size: '选择公司规模',
      location: '请输入公司地址',
      website: '请输入官方网站地址',
      description: '请输入公司介绍（业务范围、发展历程、企业文化等）',
      notes: '请输入备注信息（个人感受、内推渠道、面试难度等）'
    },
    
    // 公司类型选项
    companyTypes: {
      startup: '初创公司',
      sme: '中小企业',
      large: '大型企业',
      foreign: '外企',
      stateOwned: '国企',
      listed: '上市公司',
      unicorn: '独角兽'
    },
    
    // 行业选项
    industries: {
      internet: '互联网',
      software: '软件开发',
      ai: '人工智能',
      fintech: '金融科技',
      ecommerce: '电子商务',
      gaming: '游戏娱乐',
      enterprise: '企业服务',
      education: '教育培训',
      healthcare: '医疗健康',
      retail: '新零售',
      automotive: '汽车交通',
      realestate: '房产建筑',
      manufacturing: '制造业',
      other: '其他'
    },
    
    // 公司规模选项
    companySizes: {
      tiny: '1-20人',
      small: '20-99人',
      medium: '100-499人',
      large: '500-999人',
      xlarge: '1000-4999人',
      xxlarge: '5000-9999人',
      huge: '10000人以上'
    },
    
    // 评分提示
    ratingTemplate: '{value} 分',
    ratingHint: '对公司的整体评价（工作环境、薪资待遇、发展前景等）',
    
    // 按钮
    buttons: {
      cancel: '取消',
      create: '创建',
      update: '更新'
    },
    
    // 验证消息
    validation: {
      nameRequired: '请输入公司名称',
      nameLength: '公司名称长度在 2 到 50 个字符',
      typeRequired: '请选择公司类型',
      invalidWebsite: '请输入有效的网站地址',
      formValidationFailed: '请检查表单填写'
    },
    
    // 注释
    comments: {
      editMode: '编辑模式 - 填充现有数据',
      createMode: '新增模式 - 使用默认值',
      urlValidation: '简单的URL验证',
      websiteValidation: '验证网站URL格式',
      ensureProtocol: '确保网站URL包含协议'
    }
  },

  // 面试表单
  interviewForm: {
    // 表单标签
    labels: {
      company: '公司',
      position: '职位',
      scheduledTime: '面试时间',
      round: '面试轮次',
      type: '面试方式',
      interviewer: '面试官',
      expectedSalary: '期望薪资',
      status: '状态',
      result: '面试结果',
      notes: '备注',
      feedback: '反馈'
    },
    
    // 占位符
    placeholders: {
      company: '选择公司',
      position: '请输入职位名称',
      scheduledTime: '选择面试时间',
      type: '选择方式',
      interviewer: '请输入面试官姓名',
      expectedSalary: '如：15K-20K',
      status: '选择状态',
      result: '选择结果',
      notes: '请输入面试备注或准备事项',
      feedback: '请输入面试反馈'
    },
    
    // 面试方式选项
    interviewTypes: {
      onsite: '现场面试',
      video: '视频面试',
      phone: '电话面试'
    },
    
    // 状态选项
    statusOptions: {
      pending: '待确认',
      scheduled: '已安排',
      completed: '已完成',
      cancelled: '已取消'
    },
    
    // 结果选项
    resultOptions: {
      passed: '通过',
      failed: '未通过',
      pending: '待定'
    },
    
    // 按钮
    buttons: {
      cancel: '取消',
      create: '创建',
      update: '更新'
    },
    
    // 验证消息
    validation: {
      companyRequired: '请选择公司',
      positionRequired: '请输入职位名称',
      scheduledTimeRequired: '请选择面试时间',
      roundRequired: '请输入面试轮次',
      typeRequired: '请选择面试方式',
      statusRequired: '请选择状态',
      formValidationFailed: '请检查表单填写'
    },
    
    // 注释
    comments: {
      editMode: '编辑模式 - 填充现有数据',
      createMode: '新增模式 - 使用默认值',
      createNewCompany: '需要创建新公司'
    }
  },

  // 即将到来的面试组件
  upcomingInterviews: {
    // 空状态
    emptyState: {
      description: '近期没有安排面试',
      createButton: '安排新面试'
    },
    
    // 操作提示
    tooltips: {
      viewDetail: '查看详情',
      editRound: '编辑轮次'
    },
    
    // 链接文本
    viewMore: '查看完整日历',
    
    // 状态映射
    statusMap: {
      scheduled: '已安排',
      completed: '已完成',
      cancelled: '已取消'
    },
    
    // 默认文本
    unknownCompany: '未知公司',
    unknownPosition: '未知职位',
    
    // 消息提示
    messages: {
      editRoundInProgress: '编辑轮次功能开发中...',
      loadDataFailed: '加载面试数据失败'
    },
    
    // 注释
    comments: {
      ensureDataLoaded: '确保数据已加载',
      implementEditRound: '实现编辑轮次功能'
    }
  },

  // 公司列表页面
  companyList: {
    // 页面标题
    title: '公司管理',
    
    // 搜索和筛选
    search: {
      placeholder: '搜索公司名称或行业',
      typeFilter: '公司类型筛选'
    },
    
    // 按钮
    buttons: {
      addCompany: '新增公司',
      view: '查看',
      edit: '编辑',
      delete: '删除'
    },
    
    // 统计卡片
    stats: {
      totalCompanies: '公司总数',
      activeCompanies: '活跃投递',
      offerCompanies: '收到Offer',
      averageRating: '平均评分'
    },
    
    // 视图模式
    viewModes: {
      grid: '卡片视图',
      table: '表格视图'
    },
    
    // 表格列标题
    table: {
      companyName: '公司名称',
      industry: '行业',
      size: '规模',
      location: '地点',
      interviewCount: '面试次数',
      offerCount: 'Offer数量',
      rating: '评分',
      actions: '操作',
      noRating: '未评分'
    },
    
    // 卡片视图
    card: {
      interviewCount: '面试次数',
      offerCount: 'Offer数量'
    },
    
    // 对话框标题
    dialogs: {
      companyDetail: '公司详情',
      addCompany: '新增公司',
      editCompany: '编辑公司'
    },
    
    // 确认对话框
    confirmDelete: {
      title: '删除确认',
      message: '确定要删除这个公司吗？相关的面试记录也将被删除。',
      confirmText: '确定',
      cancelText: '取消'
    },
    
    // 消息提示
    messages: {
      deleteSuccess: '删除成功',
      deleteFailed: '删除失败',
      updateSuccess: '更新成功',
      addSuccess: '添加成功',
      operationFailed: '操作失败'
    },
    
    // 状态筛选
    statusFilters: {
      interviewing: '面试中',
      evaluating: '评估中',
      offered: '已发Offer'
    }
  },

  // 面试表单页面
  interviewFormView: {
    // 页面标题
    titles: {
      add: '添加面试流程',
      edit: '编辑面试流程'
    },
    
    // 卡片标题
    cardTitles: {
      basicInfo: '基本信息',
      salaryInfo: '薪资信息',
      remarksCard: '备注'
    },
    
    // 表单标签
    labels: {
      company: '公司',
      position: '职位',
      city: '城市',
      sourceChannel: '投递渠道',
      status: '状态',
      conclusion: '结论',
      expectedSalary: '期望薪资',
      remarks: '备注'
    },
    
    // 占位符
    placeholders: {
      company: '选择公司',
      position: '请输入职位名称',
      city: '请输入城市',
      sourceChannel: '如：Boss直聘、拉勾网等',
      status: '选择状态',
      conclusion: '选择结论',
      minSalary: '最低',
      maxSalary: '最高',
      remarks: '请输入备注信息'
    },
    
    // 状态选项
    statusOptions: {
      applying: '投递中',
      evaluating: '评估中',
      interviewing: '面试中',
      offered: '已发Offer',
      rejected: '已拒绝',
      finished: '已结束'
    },
    
    // 结论选项
    conclusionOptions: {
      notStarted: '未开始',
      inProgress: '进行中',
      passed: '通过',
      failed: '未通过',
      pending: '待定'
    },
    
    // 薪资单位
    salaryUnit: 'k',
    salarySeparator: '-',
    
    // 按钮
    buttons: {
      cancel: '取消',
      create: '创建',
      update: '更新'
    },
    
    // 验证消息
    validation: {
      companyRequired: '请选择公司',
      positionRequired: '请输入职位名称',
      cityRequired: '请输入城市',
      statusRequired: '请选择状态',
      conclusionRequired: '请选择结论',
      sourceChannelRequired: '请输入投递渠道'
    },
    
    // 消息提示
    messages: {
      updateSuccess: '更新成功',
      createSuccess: '创建成功',
      saveFailed: '保存失败'
    }
  },

  // 日历页面
  calendar: {
    title: '面试日历',
    monthView: '月视图',
    weekView: '周视图',
    addInterview: '新增面试',
    today: '今天',
    
    // 星期
    weekdays: {
      sun: '日',
      mon: '一',
      tue: '二',
      wed: '三',
      thu: '四',
      fri: '五',
      sat: '六'
    },
    
    // 面试详情弹框
    interviewDetail: '面试详情',
    company: '公司',
    position: '职位',
    interviewTime: '面试时间',
    round: '面试轮次',
    roundNumber: '第{number}轮',
    interviewType: '面试方式',
    interviewer: '面试官',
    notes: '备注',
    statusLabel: '状态',
    close: '关闭',
    edit: '编辑',
    
    // 通用
    unknown: '未知',
    unknownCompany: '未知公司',
    noNotes: '暂无备注',
    
    // 面试方式
    types: {
      online: '线上面试',
      onsite: '现场面试',
      video: '视频面试',
      phone: '电话面试'
    },
    
    // 状态
    status: {
      scheduled: '已安排',
      completed: '已完成',
      cancelled: '已取消',
      pending: '待安排'
    },
    
    // 模拟数据
    mockData: {
      technicalInterview: '技术面试',
      hrInterview: 'HR面试',
      finalInterview: '总监面试',
      initialInterview: '初试',
      engineer: '张工程师',
      hrManager: '李HR',
      director: '王总监',
      techManager: '陈技术经理',
      alibaba: '阿里巴巴',
      tencent: '腾讯',
      bytedance: '字节跳动',
      meituan: '美团',
      frontendEngineer: '前端工程师',
      reactDeveloper: 'React开发工程师',
      seniorFrontend: '高级前端工程师',
      vueEngineer: 'Vue.js工程师',
      prepareAlgorithm: '准备算法题和项目介绍',
      salaryNegotiation: '薪资谈判和福利讨论',
      teamCulture: '团队文化和发展规划',
      positiveFeedback: '技术能力符合要求，沟通表达良好',
      passedWaitingNext: '已通过，等待复试通知'
    }
  },

  // 面试列表页面
  interviewList: {
    title: '面试管理',
    
    // 搜索和筛选
    search: {
      placeholder: '搜索公司名称或职位',
      statusFilter: '状态筛选'
    },
    
    // 按钮
    buttons: {
      addInterview: '新增面试',
      view: '查看',
      edit: '编辑',
      delete: '删除'
    },
    
    // 统计数据
    stats: {
      totalInterviews: '总面试数',
      scheduledInterviews: '待面试',
      completedInterviews: '已完成',
      successRate: '通过率'
    },
    
    // 表格列标题
    table: {
      company: '公司',
      position: '职位',
      interviewTime: '面试时间',
      round: '轮次',
      interviewType: '面试方式',
      status: '状态',
      interviewer: '面试官',
      actions: '操作'
    },
    
    // 状态选项
    statusOptions: {
      scheduled: '已安排',
      completed: '已完成',
      cancelled: '已取消',
      pending: '待确认'
    },
    
    // 面试方式
    interviewTypes: {
      onsite: '现场面试',
      video: '视频面试',
      phone: '电话面试',
      online: '线上面试'
    },
    
    // 对话框标题
    dialogs: {
      interviewDetail: '面试详情',
      addInterview: '新增面试',
      editInterview: '编辑面试'
    },
    
    // 确认删除对话框
    confirmDelete: {
      title: '删除确认',
      message: '确定要删除这个面试记录吗？',
      confirmText: '确定',
      cancelText: '取消'
    },
    
    // 消息提示
    messages: {
      deleteSuccess: '删除成功',
      deleteError: '删除失败',
      updateSuccess: '更新成功',
      addSuccess: '添加成功',
      operationError: '操作失败'
    },
    
    // 通用文本
    expected: '期望',
    notScheduled: '未安排',
    unknown: '未知',
    unknownCompany: '未知公司',
    roundNumber: '第{number}轮'
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