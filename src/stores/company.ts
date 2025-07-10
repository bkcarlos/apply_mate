import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Company } from '@/types';
import { dbService } from '@/services/database';

export const useCompanyStore = defineStore('company', () => {
  const companies = ref<Company[]>([]);
  const loading = ref(false);

  // Getters
  const getCompanyById = computed(() => {
    return (id: string) => companies.value.find(c => c.id === id);
  });

  const getCompanyByName = computed(() => {
    return (name: string) => companies.value.find(c => c.name === name);
  });

  // Actions
  const loadCompanies = async () => {
    loading.value = true;
    try {
      companies.value = await dbService.getAllCompanies();
    } catch (error) {
      console.error('Failed to load companies:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const addCompany = async (companyData: Omit<Company, 'id' | 'createTime' | 'updateTime'>) => {
    try {
      const newCompany = await dbService.addCompany(companyData);
      companies.value.push(newCompany);
      return newCompany;
    } catch (error) {
      console.error('Failed to add company:', error);
      throw error;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const updatedCompany = await dbService.updateCompany(id, updates);
      const index = companies.value.findIndex(c => c.id === id);
      if (index !== -1) {
        companies.value[index] = updatedCompany;
      }
      return updatedCompany;
    } catch (error) {
      console.error('Failed to update company:', error);
      throw error;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await dbService.deleteCompany(id);
      companies.value = companies.value.filter(c => c.id !== id);
    } catch (error) {
      console.error('Failed to delete company:', error);
      throw error;
    }
  };

  return {
    companies,
    loading,
    getCompanyById,
    getCompanyByName,
    loadCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
  };
});
