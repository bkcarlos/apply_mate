export default {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    loading: 'Loading...',
    noData: 'No Data',
    operation: 'Operation',
    status: 'Status',
    createTime: 'Create Time',
    updateTime: 'Update Time',
    remark: 'Remark',
    required: 'Required',
    optional: 'Optional',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    interviews: 'Interviews',
    companies: 'Companies',
    analysis: 'Analysis',
    settings: 'Settings',
    profile: 'Profile',
    about: 'About',
    logout: 'Logout'
  },

  // Header
  header: {
    brandName: 'Apply Mate',
    newInterview: 'New Interview',
    todayInterviews: 'Today\'s Interviews',
    notifications: 'Notifications',
    userMenu: 'User Menu',
    language: 'Language'
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome to Apply Mate!',
    overview: 'Overview',
    totalInterviews: 'Total Interviews',
    pendingInterviews: 'Pending',
    completedInterviews: 'Completed',
    offerReceived: 'Offers Received',
    upcomingInterviews: 'Upcoming Interviews',
    recentActivity: 'Recent Activity',
    interviewTrend: 'Interview Trend',
    statusDistribution: 'Status Distribution',
    noUpcomingInterviews: 'No upcoming interviews',
    noRecentActivity: 'No recent activity',
    newInterview: 'New Interview',
    viewCalendar: 'View Calendar',
    quickStart: 'Quick Start',
    newInterviewProcess: 'New Interview Process',
    manageCompanies: 'Manage Companies',
    ongoingInterviews: 'Ongoing Interviews',
    pendingSchedule: 'Pending Schedule',
    receivedOffers: 'Received Offers',
    totalApplications: 'Total Applications',
    upcomingSchedule: 'Upcoming Schedule',
    viewAll: 'View All',
    offerSalaryComparison: 'Offer Salary Comparison',
    detailedAnalysis: 'Detailed Analysis',
    
    // Test Data Features
    generateTestData: 'Generate Test Data',
    clearTestData: 'Clear Test Data',
    generateTestDataTitle: 'Generate Test Data',
    generateTestDataConfirm: 'Are you sure you want to generate test data? This will create some sample companies and interview records to help you experience the system features.',
    clearTestDataTitle: 'Clear Test Data',
    clearTestDataConfirm: 'Are you sure you want to clear all data? This operation will delete all companies, interview records and other data, and cannot be undone.',
    testDataGenerated: 'Test data generated successfully! The page will refresh shortly.',
    testDataCleared: 'Test data cleared successfully! The page will refresh shortly.',
    testDataGenerationFailed: 'Failed to generate test data',
    testDataClearingFailed: 'Failed to clear test data',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },

  // Interview Management
  interview: {
    title: 'Interview Management',
    newInterview: 'New Interview',
    editInterview: 'Edit Interview',
    interviewDetails: 'Interview Details',
    companyName: 'Company Name',
    position: 'Position',
    interviewDate: 'Interview Date',
    interviewTime: 'Interview Time',
    interviewType: 'Interview Type',
    interviewer: 'Interviewer',
    location: 'Location',
    description: 'Description',
    requirements: 'Requirements',
    salary: 'Salary',
    benefits: 'Benefits',
    contactInfo: 'Contact Info',
    applicationStatus: 'Application Status',
    interviewStatus: 'Interview Status',
    feedback: 'Feedback',
    nextStep: 'Next Step',
    
    // Interview Detail Page
    detail: {
      back: 'Back',
      title: 'Interview Details',
      edit: 'Edit',
      delete: 'Delete',
      basicInfo: 'Basic Information',
      company: 'Company',
      city: 'City',
      sourceChannel: 'Source Channel',
      expectedSalary: 'Expected Salary',
      offeredSalary: 'Offered Salary',
      totalPackage: 'Total Package',
      rounds: 'Interview Rounds',
      addRound: 'Add Round',
      interviewer: 'Interviewer',
      time: 'Time',
      feedback: 'Feedback',
      noRounds: 'No interview rounds yet',
      unknownCompany: 'Unknown Company',
      notScheduled: 'Not Scheduled',
      deleteConfirm: 'This will permanently delete the interview record. Continue?',
      deleteTitle: 'Confirm',
      deleteSuccess: 'Deleted successfully'
    },
    
    // Interview Types
    types: {
      phone: 'Phone Interview',
      video: 'Video Interview',
      onsite: 'Onsite Interview',
      technical: 'Technical Interview',
      behavioral: 'Behavioral Interview',
      final: 'Final Interview'
    },

    // Application Statuses
    applicationStatuses: {
      applied: 'Applied',
      screening: 'Screening',
      interview: 'Interview',
      offer: 'Offer Received',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn'
    },

    // Interview Statuses
    interviewStatuses: {
      scheduled: 'Scheduled',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled'
    }
  },

  // Company Management
  company: {
    title: 'Company Management',
    newCompany: 'New Company',
    editCompany: 'Edit Company',
    companyDetails: 'Company Details',
    companyName: 'Company Name',
    industry: 'Industry',
    size: 'Company Size',
    location: 'Location',
    website: 'Website',
    description: 'Description',
    culture: 'Company Culture',
    benefits: 'Benefits',
    contactPerson: 'Contact Person',
    contactEmail: 'Contact Email',
    contactPhone: 'Contact Phone',
    notes: 'Notes',
    
    // Company Sizes
    sizes: {
      startup: 'Startup (1-50 employees)',
      small: 'Small (51-200 employees)',
      medium: 'Medium (201-1000 employees)',
      large: 'Large (1000+ employees)'
    },

    // Industries
    industries: {
      technology: 'Technology',
      finance: 'Finance',
      healthcare: 'Healthcare',
      education: 'Education',
      retail: 'Retail',
      manufacturing: 'Manufacturing',
      consulting: 'Consulting',
      media: 'Media',
      other: 'Other'
    }
  },



  // Analysis
  analysis: {
    title: 'Data Analysis',
    overview: 'Overview Statistics',
    trends: 'Trend Analysis',
    success: 'Success Rate Analysis',
    timeline: 'Timeline Analysis',
    comparison: 'Comparison Analysis',
    
    // Date Range
    dateRange: {
      separator: 'to',
      startPlaceholder: 'Start Date',
      endPlaceholder: 'End Date'
    },
    
    // Buttons
    exportData: 'Export Data',
    
    // Statistics Cards
    stats: {
      totalApplications: 'Total Applications',
      totalInterviews: 'Total Interviews',
      totalOffers: 'Offers Received',
      successRate: 'Overall Success Rate'
    },
    
    // Chart Titles
    charts: {
      applicationTrend: 'Application Trend Analysis',
      interviewStatus: 'Interview Status Distribution',
      companyType: 'Company Type Analysis',
      industryDistribution: 'Industry Distribution',
      interviewRound: 'Interview Round Analysis'
    },
    
    // Table Headers
    tables: {
      companyStats: 'Company Application Statistics',
      industryStats: 'Industry Application Statistics',
      companyName: 'Company Name',
      applications: 'Applications',
      interviews: 'Interviews',
      offers: 'Offers',
      successRate: 'Success Rate',
      industry: 'Industry',
      companies: 'Companies'
    },
    
    // Status Mapping
    statusMap: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      pending: 'Pending'
    },
    
    // Other
    uncategorized: 'Uncategorized',
    exportInProgress: 'Data export feature is under development...',
    
    // Metrics
    metrics: {
      totalApplications: 'Total Applications',
      totalInterviews: 'Total Interviews',
      totalOffers: 'Total Offers',
      averageSalary: 'Average Salary',
      averageTime: 'Average Time',
      activeApplications: 'Active Applications',
      pendingInterviews: 'Pending Interviews'
    }
  },

  // Settings
  settings: {
    title: 'Settings',
    general: 'General Settings',
    notifications: 'Notification Settings',
    privacy: 'Privacy Settings',
    data: 'Data Management',
    about: 'About',
    
    // Profile
    profile: {
      title: 'Personal Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      jobDirection: 'Job Direction',
      expectedSalary: 'Expected Salary',
      experience: 'Work Experience',
      namePlaceholder: 'Please enter your name',
      emailPlaceholder: 'Please enter your email',
      phonePlaceholder: 'Please enter your phone number',
      locationPlaceholder: 'Please enter your location',
      jobDirectionPlaceholder: 'e.g., Frontend Developer',
      expectedSalaryPlaceholder: 'e.g., 15K-25K',
      experienceOptions: {
        fresh: 'Fresh Graduate',
        under1: 'Less than 1 year',
        '1to3': '1-3 years',
        '3to5': '3-5 years',
        '5to10': '5-10 years',
        over10: 'More than 10 years'
      },
      save: 'Save Personal Information'
    },
    
    // System Preferences
    system: {
      title: 'System Preferences',
      theme: 'Theme Mode',
      themeOptions: {
        light: 'Light Mode',
        dark: 'Dark Mode',
        auto: 'Follow System'
      },
      defaultView: 'Default View',
      defaultViewOptions: {
        dashboard: 'Dashboard',
        calendar: 'Interview Calendar',
        interviews: 'Interview List',
        companies: 'Company Management'
      },
      autoSave: 'Auto Save',
      autoSaveDesc: 'Automatically save form data when enabled',
      notifications: 'Desktop Notifications',
      notificationsDesc: 'Important notifications like interview reminders',
      autoBackup: 'Data Backup',
      autoBackupDesc: 'Regularly backup data to local storage',
      save: 'Save System Settings'
    },
    
    // Data Management
    dataManagement: {
      title: 'Data Management',
      importExport: 'Data Import/Export',
      exportAll: 'Export All Data',
      importData: 'Import Data',
      dataCleaning: 'Data Cleaning',
      clearCompleted: 'Clear Completed Interviews',
      clearCancelled: 'Clear Cancelled Interviews',
      clearAll: 'Clear All Data',
      exportSuccess: 'Data exported successfully',
      exportFailed: 'Export failed',
      importSuccess: 'Data imported successfully',
      importFailed: 'Import failed',
      importConfirm: 'Importing data will overwrite existing data. Are you sure you want to continue?',
      importTitle: 'Import Confirmation',
      dataFormatError: 'Data format is incorrect',
      clearCompletedConfirm: 'Are you sure you want to clear all completed interview records?',
      clearCancelledConfirm: 'Are you sure you want to clear all cancelled interview records?',
      clearAllConfirm: 'Are you sure you want to clear all data? This operation cannot be undone!',
      clearAllFinalConfirm: 'Please confirm again, this will delete all companies, interviews, and application records!',
      clearTitle: 'Clear Confirmation',
      clearDangerTitle: 'Dangerous Operation Confirmation',
      clearFinalTitle: 'Final Confirmation',
      clearSuccess: 'All data has been cleared',
      clearFailed: 'Clear failed',
      clearedRecords: 'Cleared {count} records'
    },
    
    // Usage Statistics
    stats: {
      title: 'Usage Statistics',
      registerTime: 'Registration Time',
      totalApplications: 'Total Applications',
      totalInterviews: 'Total Interviews',
      totalOffers: 'Offers Received',
      dataStorage: 'Data Storage',
      lastUsed: 'Last Used',
      unknown: 'Unknown'
    },
    
    // Quick Actions
    quickActions: {
      title: 'Quick Actions',
      newInterview: 'New Interview',
      newCompany: 'New Company',
      viewCalendar: 'View Calendar',
      dataAnalysis: 'Data Analysis'
    },
    
    // System Information
    systemInfo: {
      title: 'System Information',
      appVersion: 'App Version',
      buildTime: 'Build Time',
      browser: 'Browser',
      storage: 'Storage Method'
    },
    
    // General Settings
    language: 'Language',
    theme: 'Theme',
    timezone: 'Timezone',
    dateFormat: 'Date Format',
    currency: 'Currency',
    
    // Notification Settings
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    reminderSettings: 'Reminder Settings',
    interviewReminder: 'Interview Reminder',
    applicationDeadline: 'Application Deadline Reminder',
    
    // Data Management
    exportData: 'Export Data',
    importData: 'Import Data',
    backupData: 'Backup Data',
    clearData: 'Clear Data',
    dataFormat: 'Data Format'
  },

  // Form Validation
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    date: 'Please select a valid date',
    time: 'Please select a valid time',
    number: 'Please enter a valid number',
    min: 'Minimum value is {min}',
    max: 'Maximum value is {max}',
    minLength: 'Minimum length is {min} characters',
    maxLength: 'Maximum length is {max} characters'
  },

  // Messages
  messages: {
    saveSuccess: 'Saved successfully',
    saveError: 'Save failed',
    deleteSuccess: 'Deleted successfully',
    deleteError: 'Delete failed',
    deleteConfirm: 'Are you sure you want to delete? This action cannot be undone.',
    networkError: 'Network error, please try again later',
    permissionDenied: 'Permission denied',
    dataLoadError: 'Data loading failed',
    operationSuccess: 'Operation successful',
    operationError: 'Operation failed',
    noDataSelected: 'Please select data',
    invalidInput: 'Invalid input',
    sessionExpired: 'Session expired, please login again'
  },

  // Time
  time: {
    now: 'Now',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    nextWeek: 'Next Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    nextMonth: 'Next Month',
    thisYear: 'This Year',
    lastYear: 'Last Year',
    nextYear: 'Next Year',
    
    // Relative Time
    justNow: 'Just now',
    minutesAgo: '{n} minutes ago',
    hoursAgo: '{n} hours ago',
    daysAgo: '{n} days ago',
    weeksAgo: '{n} weeks ago',
    monthsAgo: '{n} months ago',
    yearsAgo: '{n} years ago'
  },

  // 404 Page
  notFound: {
    title: 'Page Not Found',
    message: 'Sorry, the page you are looking for does not exist or has been moved.',
    backHome: 'Back to Home',
    goBack: 'Go Back',
    suggestions: 'You might be looking for:',
    links: {
      dashboard: 'Dashboard',
      calendar: 'Interview Calendar',
      interviews: 'Interview Management',
      companies: 'Company Management',
      analysis: 'Data Analysis',
      settings: 'Settings'
    }
  },

  // Company Form
  companyForm: {
    // Form Labels
    labels: {
      name: 'Company Name',
      type: 'Company Type',
      industry: 'Industry',
      size: 'Company Size',
      location: 'Location',
      website: 'Website',
      rating: 'Company Rating',
      description: 'Company Description',
      notes: 'Notes'
    },
    
    // Placeholders
    placeholders: {
      name: 'Enter company name',
      type: 'Select company type',
      industry: 'Select industry',
      size: 'Select company size',
      location: 'Enter company location',
      website: 'Enter company website',
      description: 'Enter company description (business scope, development history, corporate culture, etc.)',
      notes: 'Enter notes (personal feelings, referral channels, interview difficulty, etc.)'
    },
    
    // Company Type Options
    companyTypes: {
      startup: 'Startup',
      sme: 'SME',
      large: 'Large Enterprise',
      foreign: 'Foreign Company',
      stateOwned: 'State-owned Enterprise',
      listed: 'Listed Company',
      unicorn: 'Unicorn'
    },
    
    // Industry Options
    industries: {
      internet: 'Internet',
      software: 'Software Development',
      ai: 'Artificial Intelligence',
      fintech: 'Fintech',
      ecommerce: 'E-commerce',
      gaming: 'Gaming & Entertainment',
      enterprise: 'Enterprise Services',
      education: 'Education & Training',
      healthcare: 'Healthcare',
      retail: 'New Retail',
      automotive: 'Automotive & Transportation',
      realestate: 'Real Estate & Construction',
      manufacturing: 'Manufacturing',
      other: 'Other'
    },
    
    // Company Size Options
    companySizes: {
      tiny: '1-20 employees',
      small: '20-99 employees',
      medium: '100-499 employees',
      large: '500-999 employees',
      xlarge: '1000-4999 employees',
      xxlarge: '5000-9999 employees',
      huge: '10000+ employees'
    },
    
    // Rating Template
    ratingTemplate: '{value} points',
    ratingHint: 'Overall evaluation of the company (work environment, salary, development prospects, etc.)',
    
    // Buttons
    buttons: {
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update'
    },
    
    // Validation Messages
    validation: {
      nameRequired: 'Please enter company name',
      nameLength: 'Company name length should be between 2 and 50 characters',
      typeRequired: 'Please select company type',
      invalidWebsite: 'Please enter a valid website address',
      formValidationFailed: 'Please check form input'
    },
    
    // Comments
    comments: {
      editMode: 'Edit mode - fill with existing data',
      createMode: 'Create mode - use default values',
      urlValidation: 'Simple URL validation',
      websiteValidation: 'Validate website URL format',
      ensureProtocol: 'Ensure website URL contains protocol'
    }
  },

  // Interview Form
  interviewForm: {
    // Form Labels
    labels: {
      company: 'Company',
      position: 'Position',
      scheduledTime: 'Interview Time',
      round: 'Interview Round',
      type: 'Interview Type',
      interviewer: 'Interviewer',
      expectedSalary: 'Expected Salary',
      status: 'Status',
      result: 'Interview Result',
      notes: 'Notes',
      feedback: 'Feedback'
    },
    
    // Placeholders
    placeholders: {
      company: 'Select company',
      position: 'Enter position title',
      scheduledTime: 'Select interview time',
      type: 'Select type',
      interviewer: 'Enter interviewer name',
      expectedSalary: 'e.g., 15K-20K',
      status: 'Select status',
      result: 'Select result',
      notes: 'Enter interview notes or preparation items',
      feedback: 'Enter interview feedback'
    },
    
    // Interview Type Options
    interviewTypes: {
      onsite: 'Onsite Interview',
      video: 'Video Interview',
      phone: 'Phone Interview'
    },
    
    // Status Options
    statusOptions: {
      pending: 'Pending',
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    
    // Result Options
    resultOptions: {
      passed: 'Passed',
      failed: 'Failed',
      pending: 'Pending'
    },
    
    // Buttons
    buttons: {
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update'
    },
    
    // Validation Messages
    validation: {
      companyRequired: 'Please select a company',
      positionRequired: 'Please enter position title',
      scheduledTimeRequired: 'Please select interview time',
      roundRequired: 'Please enter interview round',
      typeRequired: 'Please select interview type',
      statusRequired: 'Please select status',
      formValidationFailed: 'Please check form input'
    },
    
    // Comments
    comments: {
      editMode: 'Edit mode - fill with existing data',
      createMode: 'Create mode - use default values',
      createNewCompany: 'Need to create new company'
    }
  },

  // Upcoming Interviews Component
  upcomingInterviews: {
    // Empty State
    emptyState: {
      description: 'No interviews scheduled recently',
      createButton: 'Schedule New Interview'
    },
    
    // Tooltips
    tooltips: {
      viewDetail: 'View Details',
      editRound: 'Edit Round'
    },
    
    // Link Text
    viewMore: 'View Full Calendar',
    
    // Status Mapping
    statusMap: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    
    // Default Text
    unknownCompany: 'Unknown Company',
    unknownPosition: 'Unknown Position',
    
    // Messages
    messages: {
      editRoundInProgress: 'Edit round feature is under development...',
      loadDataFailed: 'Failed to load interview data'
    },
    
    // Comments
    comments: {
      ensureDataLoaded: 'Ensure data is loaded',
      implementEditRound: 'Implement edit round functionality'
    }
  },

  // Company List Page
  companyList: {
    // Page Title
    title: 'Company Management',
    
    // Search and Filter
    search: {
      placeholder: 'Search company name or industry',
      typeFilter: 'Company type filter'
    },
    
    // Buttons
    buttons: {
      addCompany: 'Add Company',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete'
    },
    
    // Statistics Cards
    stats: {
      totalCompanies: 'Total Companies',
      activeCompanies: 'Active Applications',
      offerCompanies: 'Offers Received',
      averageRating: 'Average Rating'
    },
    
    // View Modes
    viewModes: {
      grid: 'Grid View',
      table: 'Table View'
    },
    
    // Table Column Headers
    table: {
      companyName: 'Company Name',
      industry: 'Industry',
      size: 'Size',
      location: 'Location',
      interviewCount: 'Interview Count',
      offerCount: 'Offer Count',
      rating: 'Rating',
      actions: 'Actions',
      noRating: 'No Rating'
    },
    
    // Card View
    card: {
      interviewCount: 'Interview Count',
      offerCount: 'Offer Count'
    },
    
    // Dialog Titles
    dialogs: {
      companyDetail: 'Company Details',
      addCompany: 'Add Company',
      editCompany: 'Edit Company'
    },
    
    // Confirm Dialog
    confirmDelete: {
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this company? Related interview records will also be deleted.',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    },
    
    // Messages
    messages: {
      deleteSuccess: 'Deleted successfully',
      deleteFailed: 'Delete failed',
      updateSuccess: 'Updated successfully',
      addSuccess: 'Added successfully',
      operationFailed: 'Operation failed'
    },
    
    // Status Filters
    statusFilters: {
      interviewing: 'Interviewing',
      evaluating: 'Evaluating',
      offered: 'Offered'
    }
  },

  // Interview Form View
  interviewFormView: {
    // Page Titles
    titles: {
      add: 'Add Interview Process',
      edit: 'Edit Interview Process'
    },
    
    // Card Titles
    cardTitles: {
      basicInfo: 'Basic Information',
      salaryInfo: 'Salary Information',
      remarks: 'Remarks'
    },
    
    // Form Labels
    labels: {
      company: 'Company',
      position: 'Position',
      city: 'City',
      sourceChannel: 'Application Channel',
      status: 'Status',
      conclusion: 'Conclusion',
      expectedSalary: 'Expected Salary',
      remarks: 'Remarks'
    },
    
    // Placeholders
    placeholders: {
      company: 'Select company',
      position: 'Enter position title',
      city: 'Enter city',
      sourceChannel: 'e.g., Boss Zhipin, Lagou, etc.',
      status: 'Select status',
      conclusion: 'Select conclusion',
      minSalary: 'Min',
      maxSalary: 'Max',
      remarks: 'Enter remarks'
    },
    
    // Status Options
    statusOptions: {
      applying: 'Applying',
      evaluating: 'Evaluating',
      interviewing: 'Interviewing',
      offered: 'Offered',
      rejected: 'Rejected',
      finished: 'Finished'
    },
    
    // Conclusion Options
    conclusionOptions: {
      notStarted: 'Not Started',
      inProgress: 'In Progress',
      passed: 'Passed',
      failed: 'Failed',
      pending: 'Pending'
    },
    
    // Salary Unit
    salaryUnit: 'k',
    salarySeparator: '-',
    
    // Buttons
    buttons: {
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update'
    },
    
    // Validation Messages
    validation: {
      companyRequired: 'Please select a company',
      positionRequired: 'Please enter position title',
      cityRequired: 'Please enter city',
      statusRequired: 'Please select status',
      conclusionRequired: 'Please select conclusion',
      sourceChannelRequired: 'Please enter application channel'
    },
    
    // Messages
    messages: {
      updateSuccess: 'Updated successfully',
      createSuccess: 'Created successfully',
      saveFailed: 'Save failed'
    }
  },

  // Calendar Page
  calendar: {
    title: 'Interview Calendar',
    monthView: 'Month View',
    weekView: 'Week View',
    addInterview: 'Add Interview',
    today: 'Today',
    
    // Weekdays
    weekdays: {
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat'
    },
    
    // Interview Detail Dialog
    interviewDetail: 'Interview Details',
    company: 'Company',
    position: 'Position',
    interviewTime: 'Interview Time',
    round: 'Interview Round',
    roundNumber: 'Round {number}',
    interviewType: 'Interview Type',
    interviewer: 'Interviewer',
    notes: 'Notes',
    statusLabel: 'Status',
    close: 'Close',
    edit: 'Edit',
    
    // General
    unknown: 'Unknown',
    unknownCompany: 'Unknown Company',
    noNotes: 'No notes',
    
    // Interview Types
    types: {
      online: 'Online Interview',
      onsite: 'On-site Interview',
      video: 'Video Interview',
      phone: 'Phone Interview'
    },
    
    // Status
    status: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      pending: 'Pending'
    },
    
    // Mock Data
    mockData: {
      technicalInterview: 'Technical Interview',
      hrInterview: 'HR Interview',
      finalInterview: 'Final Interview',
      initialInterview: 'Initial Interview',
      engineer: 'Engineer Zhang',
      hrManager: 'HR Manager Li',
      director: 'Director Wang',
      techManager: 'Tech Manager Chen',
      alibaba: 'Alibaba',
      tencent: 'Tencent',
      bytedance: 'ByteDance',
      meituan: 'Meituan',
      frontendEngineer: 'Frontend Engineer',
      reactDeveloper: 'React Developer',
      seniorFrontend: 'Senior Frontend Engineer',
      vueEngineer: 'Vue.js Engineer',
      prepareAlgorithm: 'Prepare algorithm questions and project introduction',
      salaryNegotiation: 'Salary negotiation and benefits discussion',
      teamCulture: 'Team culture and development planning',
      positiveFeedback: 'Technical skills meet requirements, good communication',
      passedWaitingNext: 'Passed, waiting for next round notification'
    }
  },

  // Interview List Page
  interviewList: {
    title: 'Interview Management',
    
    // Search and Filter
    search: {
      placeholder: 'Search company name or position',
      statusFilter: 'Status filter'
    },
    
    // Buttons
    buttons: {
      addInterview: 'Add Interview',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete'
    },
    
    // Statistics
    stats: {
      totalInterviews: 'Total Interviews',
      scheduledInterviews: 'Scheduled',
      completedInterviews: 'Completed',
      successRate: 'Success Rate'
    },
    
    // Table Column Headers
    table: {
      company: 'Company',
      position: 'Position',
      interviewTime: 'Interview Time',
      round: 'Round',
      interviewType: 'Interview Type',
      status: 'Status',
      interviewer: 'Interviewer',
      actions: 'Actions'
    },
    
    // Status Options
    statusOptions: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      pending: 'Pending'
    },
    
    // Interview Types
    interviewTypes: {
      onsite: 'On-site Interview',
      video: 'Video Interview',
      phone: 'Phone Interview',
      online: 'Online Interview'
    },
    
    // Dialog Titles
    dialogs: {
      interviewDetail: 'Interview Details',
      addInterview: 'Add Interview',
      editInterview: 'Edit Interview'
    },
    
    // Confirm Delete Dialog
    confirmDelete: {
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this interview record?',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    },
    
    // Messages
    messages: {
      deleteSuccess: 'Deleted successfully',
      deleteError: 'Delete failed',
      updateSuccess: 'Updated successfully',
      addSuccess: 'Added successfully',
      operationError: 'Operation failed'
    },
    
    // General Text
    expected: 'Expected',
    notScheduled: 'Not scheduled',
    unknown: 'Unknown',
    unknownCompany: 'Unknown Company',
    roundNumber: 'Round {number}'
  },

  // Miscellaneous
  misc: {
    appName: 'Apply Mate',
    appDescription: 'Interview Management System',
    version: 'Version',
    copyright: 'Copyright',
    poweredBy: 'Powered by',
    contactUs: 'Contact Us',
    feedback: 'Feedback',
    help: 'Help',
    documentation: 'Documentation',
    shortcuts: 'Shortcuts',
    tips: 'Tips'
  }
} 