import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserProfile } from '@/types';
import { dbService } from '@/services/database';

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null);
  const loading = ref(false);

  // Actions
  const loadProfile = async () => {
    loading.value = true;
    try {
      profile.value = await dbService.getUserProfile();
    } catch (error) {
      console.error('Failed to load user profile:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = await dbService.updateUserProfile(updates);
      profile.value = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    loadProfile,
    updateProfile,
  };
});
