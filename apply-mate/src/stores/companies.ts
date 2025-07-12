import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company } from '@/types'

export const useCompaniesStore = defineStore('companies', () => {
  // State
  const companies = ref<Company[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const companiesCount = computed(() => companies.value.length)
  
  const getCompanyById = computed(() => {
    return (id: string) => companies.value.find(company => company.id === id)
  })

  const companiesByIndustry = computed(() => {
    const grouped: Record<string, Company[]> = {}
    companies.value.forEach(company => {
      const industry = company.industry || '未知'
      if (!grouped[industry]) {
        grouped[industry] = []
      }
      grouped[industry].push(company)
    })
    return grouped
  })

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const addCompany = (company: Company) => {
    companies.value.push(company)
  }

  const updateCompany = (id: string, updates: Partial<Company>) => {
    const index = companies.value.findIndex(c => c.id === id)
    if (index !== -1) {
      companies.value[index] = { ...companies.value[index], ...updates }
    }
  }

  const removeCompany = (id: string) => {
    const index = companies.value.findIndex(c => c.id === id)
    if (index !== -1) {
      companies.value.splice(index, 1)
    }
  }

  const searchCompanies = (query: string) => {
    if (!query.trim()) return companies.value
    
    const lowercaseQuery = query.toLowerCase()
    return companies.value.filter(company => 
      company.name.toLowerCase().includes(lowercaseQuery) ||
      company.industry?.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Mock data for development
  const loadMockData = () => {
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: '字节跳动',
        industry: '互联网',
        scale: '10000+',
        website: 'https://www.bytedance.com',
        logoUrl: 'https://via.placeholder.com/64/F28A31/FFFFFF?text=字节'
      },
      {
        id: '2',
        name: '阿里巴巴',
        industry: '互联网',
        scale: '10000+',
        website: 'https://www.alibaba.com',
        logoUrl: 'https://via.placeholder.com/64/F28A31/FFFFFF?text=阿里'
      },
      {
        id: '3',
        name: '腾讯',
        industry: '互联网',
        scale: '10000+',
        website: 'https://www.tencent.com',
        logoUrl: 'https://via.placeholder.com/64/F28A31/FFFFFF?text=腾讯'
      }
    ]
    companies.value = mockCompanies
  }

  return {
    // State
    companies,
    loading,
    error,
    
    // Getters
    companiesCount,
    getCompanyById,
    companiesByIndustry,
    
    // Actions
    setLoading,
    setError,
    addCompany,
    updateCompany,
    removeCompany,
    searchCompanies,
    loadMockData
  }
})