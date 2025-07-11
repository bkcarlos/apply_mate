export default {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    export: 'Export',
    import: 'Import',
    loading: 'Loading...',
    noData: 'No Data',
    back: 'Back',
    refresh: 'Refresh',
    more: 'More',
    submit: 'Submit',
    clear: 'Clear',
    close: 'Close',
    view: 'View',
    next: 'Next',
    prev: 'Previous',
    finish: 'Finish',
    all: 'All',
    actions: 'Actions'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    interviews: 'Interviews',
    companies: 'Companies',
    analysis: 'Analysis',
    settings: 'Settings'
  },

  // Interview Status
  interviewStatus: {
    applied: 'Applied',
    screening: 'Screening',
    interviewing: 'Interviewing',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn'
  },

  // Interview Conclusion
  interviewConclusion: {
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    passed: 'Passed',
    failed: 'Failed',
    pending: 'Pending'
  },

  // Round Result
  roundResult: {
    pending: 'Pending',
    passed: 'Passed',
    failed: 'Failed',
    cancelled: 'Cancelled'
  },

  // Round Type
  roundType: {
    phone: 'Phone Interview',
    video: 'Video Interview',
    onsite: 'Onsite Interview',
    technical: 'Technical Interview',
    hr: 'HR Interview',
    final: 'Final Interview'
  },

  // Pages
  pages: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Interview Progress Overview',
      activeInterviews: 'Active Interviews',
      pendingInterviews: 'Pending Interviews',
      receivedOffers: 'Received Offers',
      totalApplications: 'Total Applications',
      recentInterviews: 'Recent Interview Schedule',
      upcomingInterviews: 'Upcoming Interviews',
      upcomingInterviewsSubtitle: 'Upcoming interviews in next 7 days',
      viewAll: 'View All',
      noScheduledInterviews: 'No scheduled interviews',
      noUpcomingInterviews: 'No upcoming interviews in next 7 days',
      offerSalaryComparison: 'Offer Salary Comparison',
      detailedAnalysis: 'Detailed Analysis',
      // Radar chart related
      baseMonthlySalary: 'Base Monthly Salary',
      baseAnnualSalary: 'Base Annual Salary',
      minAnnualPackage: 'Min Annual Package',
      typicalAnnualPackage: 'Typical Annual Package',
      maxAnnualPackage: 'Max Annual Package',
      // Test data buttons
      generateTestData: 'Generate Test Data',
      clearTestData: 'Clear Test Data',
      quickActions: 'Quick Actions',
      newInterviewProcess: 'New Interview Process',
      manageCompanies: 'Manage Companies',
      viewStatistics: 'View Statistics',
      pendingStatus: 'Pending',
      scheduledStatus: 'Scheduled',
      completedStatus: 'Completed',
      cancelledStatus: 'Cancelled',
      annualSalary: 'Annual Salary (k)',
      annualPackage: 'Annual Package',
      interviewTime: 'Interview Time',
      today: 'Today',
      tomorrow: 'Tomorrow',
      dayAfterTomorrow: 'Day after Tomorrow',
      thisWeek: 'This Week',
      nextWeek: 'Next Week'
    },
    interviews: {
      title: 'Interview Management',
      subtitle: 'Manage your interview processes',
      new: 'New Interview Process',
      detail: 'Interview Details',
      list: 'Interview List',
      basicInfo: 'Basic Information',
      rounds: 'Interview Rounds',
      addRound: 'Add Round',
      editRound: 'Edit Interview Round',
      roundNumber: 'Round {number}',
      notFound: 'Interview Process Not Found',
      notFoundDesc: 'The interview process may have been deleted or does not exist',
      backToList: 'Back to Interview Management'
    },
    companies: {
      title: 'Companies',
      subtitle: 'Manage company information',
      new: 'Add Company',
      edit: 'Edit Company'
    },
    analysis: {
      title: 'Data Analysis',
      subtitle: 'Interview data statistics and analysis',
      salaryComparison: 'Offer Salary Comparison',
      filterCity: 'Filter City',
      allCities: 'All Cities',
      filterPosition: 'Filter Position',
      allPositions: 'All Positions',
      noOfferData: 'No Offer Data',
      channelEfficiency: 'Application Channel Efficiency Analysis',
      noApplicationData: 'No Application Data',
      statusDistribution: 'Interview Status Distribution',
      noInterviewData: 'No Interview Data',
      offerComparisonPlanning: 'Offer Comparison & Annual Income Planning',
      currentMonthlySalary: 'Current Pre-tax Monthly Salary',
      currentSalaryPlaceholder: 'Enter current monthly salary',
      expectedHandoverDate: 'Expected Handover Date',
      selectHandoverDate: 'Select handover date',
      calculateAnnualIncome: 'Calculate Annual Income',
      selectOfferToCompare: 'Select Offers to Compare:',
      addVirtualComparison: 'Add Virtual Comparison',
      companyNamePlaceholder: 'Company Name',
      positionPlaceholder: 'Position',
      annualPackagePlaceholder: 'Annual Package',
      annualIncomeAnalysisResult: 'Annual Income Analysis Result:',
      companyOption: 'Company/Option',
      annualPackage: 'Annual Package',
      estimatedAnnualIncome: 'Estimated Annual Income',
      monthlySalaryChange: 'Monthly Salary Change',
      increaseRatio: 'Increase Ratio',
      annualSalary: 'Annual Salary',
      channelName: 'Application Channel',
      interviewStatus: 'Interview Status',
      successRate: 'Success Rate'
    },
    settings: {
      title: 'Settings',
      subtitle: 'System configuration'
    },
    notFound: {
      title: 'Page Not Found',
      subtitle: 'Sorry, the page you visited does not exist.',
      backHome: 'Back to Home',
      goBack: 'Go Back'
    }
  },

  // Form Labels
  form: {
    company: 'Company',
    position: 'Position',
    city: 'City',
    status: 'Status',
    conclusion: 'Conclusion',
    sourceChannel: 'Source Channel',
    appliedAt: 'Applied Date',
    updatedAt: 'Updated Date',
    notes: 'Notes',
    salary: 'Salary',
    expectedSalary: 'Expected Salary',
    offeredSalary: 'Offered Salary',
    baseSalary: 'Base Monthly Salary',
    yearEndMonths: 'Year-end Bonus Months',
    guaranteedMonths: 'Guaranteed Months',
    typicalMonths: 'Typical Months',
    
    // Interview Round
    round: 'Round',
    roundType: 'Interview Type',
    scheduledAt: 'Scheduled Time',
    scheduledAtWithTime: 'Scheduled Date and Time',
    interviewer: 'Interviewer',
    location: 'Location',
    result: 'Result',
    feedback: 'Feedback',
    
    // Company Info
    companyName: 'Company Name',
    companyLogo: 'Company Logo',
    industry: 'Industry',
    scale: 'Company Size',
    website: 'Website',
    description: 'Description'
  },

  // Messages
  message: {
    success: {
      save: 'Saved successfully',
      delete: 'Deleted successfully',
      add: 'Added successfully',
      update: 'Updated successfully',
      export: 'Exported successfully',
      import: 'Imported successfully'
    },
    error: {
      save: 'Failed to save',
      delete: 'Failed to delete',
      add: 'Failed to add',
      update: 'Failed to update',
      export: 'Failed to export',
      import: 'Failed to import',
      load: 'Failed to load',
      network: 'Network error',
      validation: 'Form validation failed'
    },
    warning: {
      noSelection: 'Please select data to operate',
      confirmDelete: 'Are you sure to delete? This action cannot be undone',
      unsavedChanges: 'You have unsaved changes, are you sure to leave?'
    }
  },

  // Validation
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    positive: 'Please enter a positive number',
    min: 'Cannot be less than {min}',
    max: 'Cannot exceed {max}',
    length: 'Length should be between {min} and {max}'
  },

  // Statistics
  stats: {
    totalProcesses: 'Total Processes',
    activeProcesses: 'Active',
    receivedOffers: 'Offers Received',
    pendingInterviews: 'Pending Interviews',
    avgResponseTime: 'Avg Response Time',
    successRate: 'Success Rate',
    totalCompanies: 'Total Companies',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    trend: 'Trend',
    totalRecords: 'Total {total} records'
  },

  // Confirmations
  confirm: {
    deleteProcess: 'Are you sure to delete this interview process? This action cannot be undone, including all related interview rounds data.',
    deleteRound: 'Are you sure to delete this interview round?',
    deleteCompany: 'Are you sure to delete this company?',
    batchDelete: 'Are you sure to delete the selected {count} records? This action cannot be undone.'
  },

  // Empty States
  empty: {
    interviews: 'No interview processes',
    rounds: 'No interview rounds',
    companies: 'No company data',
    addFirst: 'Add the first one',
    addFirstInterview: 'Add first interview',
    noResults: 'No matching results found',
    createNow: 'Create Now'
  },

  // Settings
  settings: {
    language: 'Language Settings',
    theme: 'Theme Settings',
    dataManagement: 'Data Management',
    about: 'About',
    version: 'Version',
    feedback: 'Feedback',
    help: 'Help',
    exportData: 'Export Data',
    importData: 'Import Data',
    clearData: 'Clear Data',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    autoTheme: 'Follow System',
    personalSettings: 'Personal Settings',
    currentMonthlySalary: 'Current Pre-tax Monthly Salary',
    currentSalaryPlaceholder: 'For annual income simulation calculation',
    currentSalaryHelp: 'This information is only used for annual income comparison calculation and will not be uploaded to any server',
    saveSettings: 'Save Settings',
    exportDataTitle: 'Data Export',
    exportDataDescription: 'Export all your data, including company information, interview processes and round records',
    importDataTitle: 'Data Import',
    importDataDescription: 'Restore data from previously exported files',
    selectFileImport: 'Select File to Import',
    skipDuplicate: 'Skip Duplicate',
    overwriteDuplicate: 'Overwrite Duplicate',
    clearDataTitle: 'Data Clear',
    clearDataDescription: 'Dangerous operation: This will delete all local data and cannot be recovered',
    clearDataConfirm: 'Are you sure to clear all data? This operation cannot be undone!',
    clearDataOk: 'Confirm Clear',
    clearAllData: 'Clear All Data',
    aboutApp: 'About ApplyMate',
    versionLabel: 'Version',
    lastUpdate: 'Last Update',
    techStack: 'Tech Stack',
    dataStorage: 'Data Storage',
    dataStorageDescription: 'All data is only stored locally in your browser and will not be uploaded to any server',
    sourceCode: 'Source Code',
    settingsSaveSuccess: 'Settings saved successfully',
    settingsSaveError: 'Failed to save',
    exportSuccess: 'Data exported successfully',
    exportError: 'Data export failed',
    importFormatError: 'Please select a JSON format file',
    importSizeError: 'File size cannot exceed 10MB',
    importSuccess: 'Data imported successfully (Strategy: {strategy})',
    importError: 'Data import failed, please check file format',
    clearSuccess: 'All data has been cleared',
    clearError: 'Data clear failed'
  },

  status: {
    applied: 'Applied',
    evaluating: 'Evaluating',
    interviewing: 'Interviewing',
    negotiating: 'Negotiating',
    offered: 'Offered',
    rejected: 'Rejected',
    closed: 'Closed'
  },

  conclusion: {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    passed: 'Passed',
    failed: 'Failed',
    pending: 'Pending'
  },

  // Language switcher
  language: {
    chinese: '中文',
    english: 'English'
  },

  // Industry
  industry: {
    internet: 'Internet',
    finance: 'Finance',
    ecommerce: 'E-commerce',
    gaming: 'Gaming',
    education: 'Education',
    healthcare: 'Healthcare',
    automotive: 'Automotive',
    realestate: 'Real Estate',
    manufacturing: 'Manufacturing',
    consulting: 'Consulting',
    other: 'Other'
  },

  // Company Scale
  companyScale: {
    small: '0-20 people',
    medium: '20-100 people',
    large: '100-500 people',
    xlarge: '500-1000 people',
    xxlarge: '1000-5000 people',
    xxxlarge: '5000-10000 people',
    huge: '10000+ people'
  },

  // Source Channels
  sourceChannels: {
    boss: 'Boss Zhipin',
    lagou: 'Lagou',
    zhilian: 'Zhilian',
    qianchengwuyou: '51job',
    liepin: 'Liepin',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    official: 'Company Website'
  },

  // Company
  company: {
    visitWebsite: 'Visit Website',
    interviewProcessCount: '{count} interview process(es)',
    viewDetail: 'View details of {name}',
    createSuccess: 'Company created successfully',
    deleteSuccess: 'Deleted successfully',
    deleteError: 'Failed to delete',
    createCompany: 'New Company'
  },

  // Filter
  filter: {
    selectIndustry: 'Select Industry',
    selectScale: 'Select Scale',
    searchCompany: 'Search company name'
  },

  // Interview Process Creation
  interview: {
    editProcess: 'Edit Interview Process',
    offerSalaryDetails: 'Offer Salary Details',
    createSuccess: 'Interview process created successfully',
    createError: 'Failed to create',
    loadCompaniesError: 'Failed to load company data',
    selectOrCreateCompany: 'Select or create company',
    positionPlaceholder: 'e.g.: Frontend Developer',
    cityPlaceholder: 'e.g.: Beijing, Shanghai, Shenzhen',
    statusPlaceholder: 'Select status',
    conclusionPlaceholder: 'Select conclusion',
    channelPlaceholder: 'Select or enter channel',
    salaryRangePlaceholder: 'Expected salary range (annual)',
    minSalary: 'Minimum salary',
    maxSalary: 'Maximum salary',
    remarksPlaceholder: 'Record relevant notes, such as job requirements, company situation, etc.',
    createProcess: 'Create Interview Process',
    cancel: 'Cancel',
    refreshData: 'Refresh Data',
    batchActions: 'Batch Actions',
    exportData: 'Export Data',
    batchDelete: 'Batch Delete',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure to delete this interview process?',
    noSalary: 'N/A',
    baseSalaryFormat: 'Base: ¥{amount}/month',
    unknownCompany: 'Unknown',
    exportFilename: 'interview_data_{date}.json',
    exportSuccess: 'Exported {count} records',
    deleteSuccess: 'Deleted successfully',
    deleteError: 'Failed to delete',
    batchDeleteTitle: 'Batch Delete Confirmation',
    batchDeleteContent: 'Are you sure to delete the selected {count} interview processes? This action cannot be undone.',
    batchDeleteSuccess: 'Deleted {count} records',
    batchDeleteError: 'Failed to batch delete',
    loadDataError: 'Failed to load data'
  },

  // Salary Editor
  salaryEditor: {
    baseSalary: 'Base Monthly Salary',
    baseSalaryPlaceholder: 'Please enter base monthly salary',
    baseSalaryRequired: 'Please enter base monthly salary',
    yearEndMonths: 'Year-end Bonus Months',
    yearEndMonthsPlaceholder: 'Ideal year-end bonus months',
    yearEndMonthsHelp: 'Company maximum year-end bonus or ideal months',
    yearEndMonthsRequired: 'Please enter year-end bonus months',
    typicalMonths: 'Past Typical Months',
    typicalMonthsPlaceholder: 'Typical year-end months most employees received',
    typicalMonthsHelp: 'Based on known information, actual year-end months most employees received',
    typicalMonthsRequired: 'Please enter past typical months',
    typicalMonthsValidation: 'Typical months cannot be less than guaranteed months',
    typicalMonthsValidation2: 'Typical months cannot exceed year-end bonus months',
    guaranteedMonths: 'Guaranteed Months',
    guaranteedMonthsPlaceholder: 'Company promised guaranteed year-end months',
    guaranteedMonthsHelp: 'Company explicitly promised or contractually stipulated minimum year-end months',
    guaranteedMonthsRequired: 'Please enter guaranteed months',
    guaranteedMonthsValidation: 'Guaranteed months cannot exceed typical months',
    calculationResult: 'Salary Calculation Result',
    minPackage: 'Minimum Annual Package (Guaranteed)',
    typicalPackage: 'Typical Annual Package (Typical)',
    maxPackage: 'Maximum Annual Package (Ideal)',
    salaryRange: 'Salary Range:',
    confirm: 'Confirm'
  }
}
