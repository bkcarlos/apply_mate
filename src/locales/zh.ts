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
    all: '全部'
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
      subtitle: '面试进展概览'
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
      subtitle: '面试数据统计分析'
    },
    settings: {
      title: '设置',
      subtitle: '系统配置'
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
    companies: '暂无公司信息',
    addFirst: '添加第一个',
    addFirstInterview: '添加首轮面试',
    noResults: '未找到匹配的结果'
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
    autoTheme: '跟随系统'
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
  }
}
