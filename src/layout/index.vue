<template>
  <a-layout class="layout">
    <a-layout-sider
      v-if="!hideMenu"
      v-model:collapsed="collapsed"
      :collapsible="true"
      :trigger="null"
      :width="menuWidth"
      :style="{ paddingTop: navbar ? '60px' : '' }"
      :hide-trigger="true"
      class="layout-sider"
      breakpoint="xl"
      @collapse="onCollapse"
    >
      <div class="menu-wrapper">
        <Menu />
      </div>
    </a-layout-sider>
    <a-layout :class="[`layout-content`]" :style="paddingStyle">
      <TabBar v-if="appRoute.meta.requiresAuth !== false" />
      <a-layout-header v-if="navbar" class="layout-navbar" :style="headerStyle">
        <NavBar />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <PageLayout />
      </a-layout-content>
      <a-layout-footer v-if="footer" class="layout-footer">
        <Footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, provide, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore, useUserStore } from '@/stores';
import usePermission from '@/hooks/permission';
import useResponsive from '@/hooks/responsive';
import NavBar from './components/NavBar.vue';
import Menu from './components/Menu/index.vue';
import Footer from './components/Footer.vue';
import TabBar from './components/TabBar/index.vue';
import PageLayout from './page-layout.vue';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const permission = usePermission();
const { hiddenFooter } = useResponsive();

const appRoute = computed(() => {
  return route;
});

const navbar = computed(() => appStore.navbar);
const renderMenu = computed(() => appStore.menu && !appStore.hideMenu);
const hideMenu = computed(() => appStore.hideMenu);
const footer = computed(() => appStore.footer && !hiddenFooter.value);
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 48 : appStore.menuWidth;
});

const collapsed = computed(() => {
  return appStore.menuCollapse;
});

const paddingStyle = computed(() => {
  const paddingLeft =
    renderMenu.value && !hideMenu.value
      ? { paddingLeft: `${menuWidth.value}px` }
      : {};
  const paddingTop = navbar.value ? { paddingTop: '60px' } : {};
  return { ...paddingLeft, ...paddingTop };
});

const headerStyle = computed(() => {
  const paddingLeft =
    renderMenu.value && !hideMenu.value
      ? { paddingLeft: `${menuWidth.value}px` }
      : {};
  return { ...paddingLeft };
});

const onCollapse = (val: boolean, type: string) => {
  if (type === 'responsive') {
    appStore.updateSettings({ hideMenu: val });
  }
};

watch(
  () => userStore.role,
  (roleValue) => {
    if (roleValue && !permission.accessRouter(route))
      router.push({ name: 'notFound' });
  }
);

const drawerVisible = ref(false);
const drawerCancel = () => {
  drawerVisible.value = false;
};

provide('toggleDrawerMenu', () => {
  drawerVisible.value = !drawerVisible.value;
});

onMounted(() => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Edg') > -1) {
    // The current browser is Edge
  }
});
</script>

<style scoped lang="less">
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
  width: 100%;
  height: 100%;
}

.layout-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: @nav-size-height;
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
  }

  > :deep(.arco-layout-sider-children) {
    overflow-y: hidden;
  }
}

.menu-wrapper {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  :deep(.arco-menu) {
    ::-webkit-scrollbar {
      width: 12px;
      height: 4px;
    }

    ::-webkit-scrollbar-thumb {
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 7px;
      background-color: var(--color-text-4);
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-text-3);
    }
  }
}

.layout-content {
  min-height: 100vh;
  overflow-y: hidden;
  background-color: var(--color-fill-2);
  transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}

.layout-footer {
  background-color: var(--color-bg-2);
}
</style> 