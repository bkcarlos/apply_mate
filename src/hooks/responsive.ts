import { ref, computed } from 'vue';

export default function useResponsive() {
  const hiddenFooter = ref(false);

  return {
    hiddenFooter: computed(() => hiddenFooter.value),
  };
} 