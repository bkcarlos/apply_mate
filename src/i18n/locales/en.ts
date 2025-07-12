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
    detailedAnalysis: 'Detailed Analysis'
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

  // Calendar
  calendar: {
    title: 'Interview Calendar',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
    noEvents: 'No Events',
    createEvent: 'Create Event',
    editEvent: 'Edit Event',
    eventDetails: 'Event Details',
    allDay: 'All Day',
    startTime: 'Start Time',
    endTime: 'End Time',
    reminder: 'Reminder',
    repeat: 'Repeat'
  },

  // Analysis
  analysis: {
    title: 'Data Analysis',
    overview: 'Overview Statistics',
    trends: 'Trend Analysis',
    success: 'Success Rate Analysis',
    timeline: 'Timeline Analysis',
    comparison: 'Comparison Analysis',
    
    // Chart Titles
    charts: {
      applicationTrend: 'Application Trend',
      interviewTrend: 'Interview Trend',
      successRate: 'Success Rate',
      industryDistribution: 'Industry Distribution',
      positionDistribution: 'Position Distribution',
      salaryDistribution: 'Salary Distribution',
      timeToOffer: 'Time to Offer',
      interviewRounds: 'Interview Rounds Analysis'
    },

    // Metrics
    metrics: {
      totalApplications: 'Total Applications',
      totalInterviews: 'Total Interviews',
      totalOffers: 'Total Offers',
      successRate: 'Success Rate',
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