import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Breakpoints {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const breakpointValues = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1440,
};

export function useBreakpoint() {
  const breakpoints = ref<Breakpoints>({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  const updateBreakpoints = () => {
    const width = window.innerWidth;
    
    breakpoints.value.xs = width >= breakpointValues.xs;
    breakpoints.value.sm = width >= breakpointValues.sm;
    breakpoints.value.md = width >= breakpointValues.md;
    breakpoints.value.lg = width >= breakpointValues.lg;
    breakpoints.value.xl = width >= breakpointValues.xl;
    
    breakpoints.value.isMobile = width < breakpointValues.sm;
    breakpoints.value.isTablet = width >= breakpointValues.sm && width < breakpointValues.lg;
    breakpoints.value.isDesktop = width >= breakpointValues.lg;
  };

  onMounted(() => {
    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoints);
  });

  return {
    ...breakpoints.value,
    breakpoints,
    isMobile: computed(() => breakpoints.value.isMobile),
    isTablet: computed(() => breakpoints.value.isTablet),
    isDesktop: computed(() => breakpoints.value.isDesktop),
  };
}