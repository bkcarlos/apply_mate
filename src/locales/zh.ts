export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    export: '导出',
    import: '导入',
    loading: '加载中...',
    noData: '暂无数据',
    back: '返回',
    refresh: '刷新',
    more: '更多',
    submit: '提交',
    clear: '清除',
    close: '关闭',
    view: '查看',
    next: '下一步',
    prev: '上一步',
    finish: '完成',
    all: '全部',
    actions: '操作'
  },

  // 导航
  nav: {
    dashboard: '仪表盘',
    interviews: '面试管理',
    companies: '公司库',
    analysis: '数据分析',
    settings: '设置'
  },

  // 面试状态
  interviewStatus: {
    applied: '已投递',
    screening: '筛选中',
    interviewing: '面试中',
    offer: '已录用',
    rejected: '已拒绝',
    withdrawn: '已撤回'
  },

  // 面试结论
  interviewConclusion: {
    notStarted: '未开始',
    inProgress: '进行中',
    passed: '通过',
    failed: '未通过',
    pending: '待定'
  },

  // 面试轮次结果
  roundResult: {
    pending: '待面试',
    passed: '通过',
    failed: '未通过',
    cancelled: '已取消'
  },

  // 面试类型
  roundType: {
    phone: '电话面试',
    video: '视频面试',
    onsite: '现场面试',
    technical: '技术面试',
    hr: 'HR面试',
    final: '终面'
  },

  // 页面标题和描述
  pages: {
    dashboard: {
      title: '仪表盘',
      subtitle: '面试进展概览',
      activeInterviews: '进行中的面试',
      pendingInterviews: '待安排的面试',
      receivedOffers: '已收到 Offer',
      totalApplications: '总投递数',
      recentInterviews: '近期面试安排',
      upcomingInterviews: '近期面试安排',
      upcomingInterviewsSubtitle: '未来 7 天的面试安排',
      viewAll: '查看全部',
      noScheduledInterviews: '暂无安排的面试',
      noUpcomingInterviews: '未来 7 天暂无面试安排',
      offerSalaryComparison: 'Offer 薪资对比',
      detailedAnalysis: '详细分析',
      // 雷达图相关
      baseMonthlySalary: '基础月薪',
      baseAnnualSalary: '基础年薪',
      minAnnualPackage: '年包最小值',
      typicalAnnualPackage: '年包典型值',
      maxAnnualPackage: '年包最大值',
      // 测试数据按钮
      generateTestData: '生成测试数据',
      clearTestData: '清理测试数据',
      // 图表单位
      salaryUnit: '单位: ¥k',
      quickActions: '快速操作',
      newInterviewProcess: '新建面试流程',
      manageCompanies: '管理公司库',
      viewStatistics: '查看统计',
      pendingStatus: '待安排',
      scheduledStatus: '已安排',
      completedStatus: '已完成',
      cancelledStatus: '已取消',
      annualSalary: '年薪 (k)',
      annualPackage: '年度总包',
      interviewTime: '面试时间',
      today: '今天',
      tomorrow: '明天',
      dayAfterTomorrow: '后天',
      thisWeek: '本周',
      nextWeek: '下周'
    },
    interviews: {
      title: '面试管理',
      subtitle: '管理您的面试流程',
      new: '新建面试流程',
      detail: '面试详情',
      list: '面试列表',
      basicInfo: '基本信息',
      rounds: '面试轮次',
      addRound: '添加轮次',
      editRound: '编辑面试轮次',
      roundNumber: '第{number}轮',
      notFound: '面试流程不存在',
      notFoundDesc: '该面试流程可能已被删除或不存在',
      backToList: '返回面试管理'
    },
    companies: {
      title: '公司库',
      subtitle: '管理公司信息',
      new: '添加公司',
      edit: '编辑公司'
    },
    analysis: {
      title: '数据分析',
      subtitle: '面试数据统计分析',
      salaryComparison: 'Offer 薪资对比',
      filterCity: '筛选城市',
      allCities: '全部城市',
      filterPosition: '筛选岗位',
      allPositions: '全部岗位',
      noOfferData: '暂无 Offer 数据',
      channelEfficiency: '投递渠道效率分析',
      noApplicationData: '暂无投递数据',
      statusDistribution: '面试状态分布',
      noInterviewData: '暂无面试数据',
      offerComparisonPlanning: 'Offer 对比与年度收入规划',
      currentMonthlySalary: '当前税前月薪',
      currentSalaryPlaceholder: '请输入当前月薪',
      expectedHandoverDate: '预期交接日期',
      selectHandoverDate: '选择交接日期',
      calculateAnnualIncome: '计算年度收入',
      selectOfferToCompare: '选择要对比的 Offer:',
      addVirtualComparison: '添加虚拟对比项',
      companyNamePlaceholder: '公司名称',
      positionPlaceholder: '岗位',
      annualPackagePlaceholder: '年度总包',
      annualIncomeAnalysisResult: '年度收入分析结果:',
      companyOption: '公司/选项',
      annualPackage: '年度总包',
      estimatedAnnualIncome: '预估年度收入',
      monthlySalaryChange: '月薪变化',
      increaseRatio: '涨幅比例',
      annualSalary: '年薪',
      channelName: '投递渠道',
      interviewStatus: '面试状态',
      successRate: '成功率'
    },
    settings: {
      title: '设置',
      subtitle: '系统配置'
    },
    notFound: {
      title: '页面不存在',
      subtitle: '抱歉，您访问的页面不存在。',
      backHome: '返回首页',
      goBack: '返回上一页'
    }
  },

  // 表单标签
  form: {
    company: '公司',
    position: '职位',
    city: '城市',
    status: '状态',
    conclusion: '结论',
    sourceChannel: '投递渠道',
    appliedAt: '投递时间',
    updatedAt: '更新时间',
    notes: '备注',
    salary: '薪资',
    expectedSalary: '期望薪资',
    offeredSalary: '提供薪资',
    baseSalary: '基础月薪',
    yearEndMonths: '年终奖月数',
    guaranteedMonths: '保底月数',
    typicalMonths: '典型月数',
    
    // 面试轮次
    round: '轮次',
    roundType: '面试类型',
    scheduledAt: '面试时间',
    scheduledAtWithTime: '面试时间（日期和时间）',
    interviewer: '面试官',
    location: '面试地点',
    result: '面试结果',
    feedback: '面试反馈',
    
    // 公司信息
    companyName: '公司名称',
    companyLogo: '公司Logo',
    industry: '行业',
    scale: '公司规模',
    website: '官网',
    description: '公司描述'
  },

  // 消息提示
  message: {
    success: {
      save: '保存成功',
      delete: '删除成功',
      add: '添加成功',
      update: '更新成功',
      export: '导出成功',
      import: '导入成功'
    },
    error: {
      save: '保存失败',
      delete: '删除失败',
      add: '添加失败',
      update: '更新失败',
      export: '导出失败',
      import: '导入失败',
      load: '加载失败',
      network: '网络错误',
      validation: '表单验证失败'
    },
    warning: {
      noSelection: '请选择要操作的数据',
      confirmDelete: '确定要删除吗？此操作不可恢复',
      unsavedChanges: '有未保存的更改，确定要离开吗？'
    }
  },

  // 验证消息
  validation: {
    required: '此字段为必填项',
    email: '请输入有效的邮箱地址',
    phone: '请输入有效的手机号码',
    url: '请输入有效的网址',
    number: '请输入有效的数字',
    positive: '请输入正数',
    min: '不能少于 {min}',
    max: '不能超过 {max}',
    length: '长度应在 {min} 到 {max} 之间'
  },

  // 语言切换
  language: {
    chinese: '中文',
    english: 'English'
  },

  // 统计数据
  stats: {
    totalProcesses: '总流程数',
    activeProcesses: '进行中',
    receivedOffers: '收到Offer',
    pendingInterviews: '待面试',
    avgResponseTime: '平均响应时间',
    successRate: '成功率',
    totalCompanies: '公司总数',
    thisWeek: '本周',
    thisMonth: '本月',
    lastMonth: '上月',
    trend: '趋势',
    totalRecords: '共 {total} 条记录'
  },

  // 操作确认
  confirm: {
    deleteProcess: '确定要删除这个面试流程吗？删除后将无法恢复，包括所有相关的面试轮次数据。',
    deleteRound: '确定删除这轮面试吗？',
    deleteCompany: '确定要删除这个公司吗？',
    batchDelete: '确定要删除选中的 {count} 条记录吗？此操作不可恢复。'
  },

  // 空状态
  empty: {
    interviews: '暂无面试流程',
    rounds: '暂无面试轮次',
    companies: '暂无公司数据',
    addFirst: '添加第一个',
    addFirstInterview: '添加首轮面试',
    noResults: '未找到匹配的结果',
    createNow: '立即创建'
  },

  // 设置页面
  settings: {
    language: '语言设置',
    theme: '主题设置',
    dataManagement: '数据管理',
    about: '关于',
    version: '版本',
    feedback: '反馈',
    help: '帮助',
    exportData: '导出数据',
    importData: '导入数据',
    clearData: '清空数据',
    lightTheme: '浅色主题',
    darkTheme: '深色主题',
    autoTheme: '跟随系统',
    personalSettings: '个人设置',
    currentMonthlySalary: '当前税前月薪',
    currentSalaryPlaceholder: '用于年度收入模拟计算',
    currentSalaryHelp: '此信息仅用于年度收入对比计算，不会上传到任何服务器',
    saveSettings: '保存设置',
    exportDataTitle: '数据导出',
    exportDataDescription: '导出您的所有数据，包括公司信息、面试流程和轮次记录',
    importDataTitle: '数据导入',
    importDataDescription: '从之前导出的文件中恢复数据',
    selectFileImport: '选择文件导入',
    skipDuplicate: '跳过重复',
    overwriteDuplicate: '覆盖重复',
    clearDataTitle: '数据清除',
    clearDataDescription: '危险操作：这将删除所有本地数据，且无法恢复',
    clearDataConfirm: '确定要清除所有数据吗？此操作无法撤销！',
    clearDataOk: '确定清除',
    clearAllData: '清除所有数据',
    aboutApp: '关于 ApplyMate',
    versionLabel: '版本',
    lastUpdate: '最后更新',
    techStack: '技术栈',
    dataStorage: '数据存储',
    dataStorageDescription: '所有数据仅存储在您的浏览器本地，不会上传到任何服务器',
    sourceCode: '开源地址',
    settingsSaveSuccess: '设置保存成功',
    settingsSaveError: '保存失败',
    exportSuccess: '数据导出成功',
    exportError: '数据导出失败',
    importFormatError: '请选择 JSON 格式的文件',
    importSizeError: '文件大小不能超过 10MB',
    importSuccess: '数据导入成功 (策略: {strategy})',
    importError: '数据导入失败，请检查文件格式',
    clearSuccess: '所有数据已清除',
    clearError: '数据清除失败'
  },

  status: {
    applied: '已投递',
    evaluating: '评估中',
    interviewing: '面试中',
    negotiating: '沟通中',
    offered: '已发Offer',
    rejected: '已拒绝',
    closed: '已结束'
  },

  conclusion: {
    not_started: '未开始',
    in_progress: '进行中',
    passed: '通过',
    failed: '未通过',
    pending: '待定'
  },

  // 行业分类
  industry: {
    internet: '互联网',
    finance: '金融',
    ecommerce: '电商',
    gaming: '游戏',
    education: '教育',
    healthcare: '医疗',
    automotive: '汽车',
    realestate: '房地产',
    manufacturing: '制造业',
    consulting: '咨询',
    other: '其他'
  },

  // 公司规模
  companyScale: {
    small: '0-20人',
    medium: '20-100人',
    large: '100-500人',
    xlarge: '500-1000人',
    xxlarge: '1000-5000人',
    xxxlarge: '5000-10000人',
    huge: '10000人以上'
  },

  // 投递渠道
  sourceChannels: {
    boss: 'Boss直聘',
    lagou: '拉勾网',
    zhilian: '智联招聘',
    qianchengwuyou: '前程无忧',
    liepin: '猎聘',
    referral: '内推',
    linkedin: 'LinkedIn',
    official: '公司官网'
  },

  // 公司相关
  company: {
    visitWebsite: '访问官网',
    interviewProcessCount: '{count} 个面试流程',
    viewDetail: '查看 {name} 的详细信息',
    createSuccess: '公司创建成功',
    deleteSuccess: '删除成功',
    deleteError: '删除失败',
    createCompany: '新建公司'
  },

  // 筛选器
  filter: {
    selectIndustry: '选择行业',
    selectScale: '选择规模',
    searchCompany: '搜索公司名称'
  },

  // 面试流程创建
  interview: {
    editProcess: '编辑面试流程',
    offerSalaryDetails: 'Offer 薪资详情',
    createSuccess: '面试流程创建成功',
    createError: '创建失败',
    loadCompaniesError: '加载公司数据失败',
    selectOrCreateCompany: '选择或创建公司',
    positionPlaceholder: '请输入岗位名称',
    cityPlaceholder: '请输入工作城市',
    statusPlaceholder: '选择状态',
    conclusionPlaceholder: '选择结论',
    channelPlaceholder: '如：Boss直聘、内推、LinkedIn等',
    salaryRangePlaceholder: '期望薪资范围 (年薪)',
    minSalary: '最低',
    maxSalary: '最高',
    remarksPlaceholder: '记录面试相关的备注信息',
    createProcess: '创建面试流程',
    cancel: '取消',
    refreshData: '刷新数据',
    batchActions: '批量操作',
    exportData: '导出数据',
    batchDelete: '批量删除',
    view: '查看',
    edit: '编辑',
    delete: '删除',
    confirmDelete: '确定要删除这个面试流程吗？',
    noSalary: '暂无',
    baseSalaryFormat: '基础: ¥{amount}/月',
    unknownCompany: '未知',
    exportFilename: '面试数据_{date}.json',
    exportSuccess: '已导出 {count} 条记录',
    deleteSuccess: '删除成功',
    deleteError: '删除失败',
    batchDeleteTitle: '批量删除确认',
    batchDeleteContent: '确定要删除选中的 {count} 条面试流程吗？此操作不可恢复。',
    batchDeleteSuccess: '已删除 {count} 条记录',
    batchDeleteError: '批量删除失败',
    loadDataError: '加载数据失败'
  },

  // 薪资编辑器
  salaryEditor: {
    baseSalary: '基础月薪',
    baseSalaryPlaceholder: '请输入基础月薪',
    baseSalaryRequired: '请输入基础月薪',
    yearEndMonths: '年终奖月数',
    yearEndMonthsPlaceholder: '理想情况下年终奖月数',
    yearEndMonthsHelp: '公司最高年终奖或理想情况下的月数',
    yearEndMonthsRequired: '请输入年终奖月数',
    typicalMonths: '过去大多数月数',
    typicalMonthsPlaceholder: '过去大多数员工拿到的年终月数',
    typicalMonthsHelp: '根据了解到的情况，大多数员工实际拿到的年终月数',
    typicalMonthsRequired: '请输入过去大多数月数',
    typicalMonthsValidation: '大多数月数不能小于保底月数',
    typicalMonthsValidation2: '大多数月数不能大于年终奖月数',
    guaranteedMonths: '保底月数',
    guaranteedMonthsPlaceholder: '公司承诺的保底年终月数',
    guaranteedMonthsHelp: '公司明确承诺或合同规定的最低年终月数',
    guaranteedMonthsRequired: '请输入保底月数',
    guaranteedMonthsValidation: '保底月数不能大于大多数月数',
    calculationResult: '薪资计算结果',
    minPackage: '年包最小值 (保底)',
    typicalPackage: '年包典型值 (大多数)',
    maxPackage: '年包最大值 (理想)',
    salaryRange: '薪资范围：',
    confirm: '确定'
  }
}
