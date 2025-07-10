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
    all: 'All'
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
      subtitle: 'Interview Progress Overview'
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
      subtitle: 'Interview data statistics and analysis'
    },
    settings: {
      title: 'Settings',
      subtitle: 'System configuration'
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
    companies: 'No company information',
    addFirst: 'Add the first one',
    addFirstInterview: 'Add first interview',
    noResults: 'No matching results found'
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
    autoTheme: 'Follow System'
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
  }
}
