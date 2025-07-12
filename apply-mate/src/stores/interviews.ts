import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { InterviewProcess, InterviewRound, DashboardStats } from '@/types'

export const useInterviewsStore = defineStore('interviews', () => {
  // State
  const processes = ref<InterviewProcess[]>([])
  const rounds = ref<InterviewRound[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const processesCount = computed(() => processes.value.length)
  
  const getProcessById = computed(() => {
    return (id: string) => processes.value.find(process => process.id === id)
  })

  const getRoundsByProcessId = computed(() => {
    return (processId: string) => rounds.value.filter(round => round.processId === processId)
  })

  const dashboardStats = computed((): DashboardStats => {
    const ongoing = processes.value.filter(p => p.status === '面试中').length
    const pending = rounds.value.filter(r => r.status === '待安排').length
    const offers = processes.value.filter(p => p.status === '已发Offer').length
    const total = processes.value.length

    return {
      ongoingInterviews: ongoing,
      pendingInterviews: pending,
      receivedOffers: offers,
      totalApplications: total
    }
  })

  const processesByStatus = computed(() => {
    return (status: InterviewProcess['status']) => {
      return processes.value.filter(p => p.status === status)
    }
  })

  const upcomingInterviews = computed(() => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return rounds.value
      .filter(round => {
        const scheduleTime = new Date(round.scheduledTime)
        return scheduleTime >= now && scheduleTime <= nextWeek && round.status === '已安排'
      })
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
  })

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const addProcess = (process: InterviewProcess) => {
    processes.value.push(process)
  }

  const updateProcess = (id: string, updates: Partial<InterviewProcess>) => {
    const index = processes.value.findIndex(p => p.id === id)
    if (index !== -1) {
      processes.value[index] = { 
        ...processes.value[index], 
        ...updates,
        updateTime: new Date()
      }
    }
  }

  const removeProcess = (id: string) => {
    const index = processes.value.findIndex(p => p.id === id)
    if (index !== -1) {
      processes.value.splice(index, 1)
      // Also remove related rounds
      rounds.value = rounds.value.filter(r => r.processId !== id)
    }
  }

  const addRound = (round: InterviewRound) => {
    rounds.value.push(round)
  }

  const updateRound = (id: string, updates: Partial<InterviewRound>) => {
    const index = rounds.value.findIndex(r => r.id === id)
    if (index !== -1) {
      rounds.value[index] = { ...rounds.value[index], ...updates }
    }
  }

  const removeRound = (id: string) => {
    const index = rounds.value.findIndex(r => r.id === id)
    if (index !== -1) {
      rounds.value.splice(index, 1)
    }
  }

  const searchProcesses = (query: string) => {
    if (!query.trim()) return processes.value
    
    const lowercaseQuery = query.toLowerCase()
    return processes.value.filter(process => 
      process.position.toLowerCase().includes(lowercaseQuery) ||
      process.city.toLowerCase().includes(lowercaseQuery) ||
      process.sourceChannel.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Mock data for development
  const loadMockData = () => {
    const mockProcesses: InterviewProcess[] = [
      {
        id: '1',
        companyId: '1',
        position: '高级前端开发工程师',
        city: '北京',
        status: '面试中',
        conclusion: '进行中',
        sourceChannel: 'Boss直聘',
        expectedSalary: { min: 25000, max: 35000 },
        createTime: new Date('2024-01-15'),
        updateTime: new Date('2024-01-20'),
        remarks: '技术栈匹配度高，团队氛围不错'
      },
      {
        id: '2',
        companyId: '2',
        position: '资深产品经理',
        city: '杭州',
        status: '已发Offer',
        conclusion: '通过',
        sourceChannel: '内推',
        expectedSalary: { min: 30000, max: 40000 },
        offeredSalary: {
          base: 35000,
          bonus: 10000,
          options: '期权价值约20万',
          total: 530000
        },
        createTime: new Date('2024-01-10'),
        updateTime: new Date('2024-01-25'),
        remarks: '业务前景很好，成长空间大'
      },
      {
        id: '3',
        companyId: '3',
        position: '技术专家',
        city: '深圳',
        status: '评估中',
        conclusion: '进行中',
        sourceChannel: 'LinkedIn',
        expectedSalary: { min: 40000, max: 50000 },
        createTime: new Date('2024-01-18'),
        updateTime: new Date('2024-01-18'),
        remarks: '技术挑战大，薪资有竞争力'
      }
    ]

    const mockRounds: InterviewRound[] = [
      {
        id: '1',
        processId: '1',
        roundName: 'HR面试',
        scheduledTime: new Date('2024-01-22T10:00:00'),
        status: '已完成',
        interviewer: '王小丽 - HR',
        feedback: '沟通顺畅，对公司文化认同度高'
      },
      {
        id: '2',
        processId: '1',
        roundName: '技术一面',
        scheduledTime: new Date('2024-01-24T14:00:00'),
        status: '已安排',
        interviewer: '张工 - 技术负责人',
        feedback: ''
      },
      {
        id: '3',
        processId: '2',
        roundName: '产品面试',
        scheduledTime: new Date('2024-01-20T15:30:00'),
        status: '已完成',
        interviewer: '李总 - 产品总监',
        feedback: '产品思维强，经验丰富'
      }
    ]

    processes.value = mockProcesses
    rounds.value = mockRounds
  }

  return {
    // State
    processes,
    rounds,
    loading,
    error,
    
    // Getters
    processesCount,
    getProcessById,
    getRoundsByProcessId,
    dashboardStats,
    processesByStatus,
    upcomingInterviews,
    
    // Actions
    setLoading,
    setError,
    addProcess,
    updateProcess,
    removeProcess,
    addRound,
    updateRound,
    removeRound,
    searchProcesses,
    loadMockData
  }
})