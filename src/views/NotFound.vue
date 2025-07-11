<template>
  <div class="not-found">
    <a-result
      status="404"
      :title="$t('pages.notFound.title')"
      :sub-title="$t('pages.notFound.subtitle')"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="goHome">
            {{ $t('pages.notFound.backHome') }}
          </a-button>
          <a-button @click="goBack">
            {{ $t('pages.notFound.goBack') }}
          </a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
// import { useI18n } from 'vue-i18n'; // 暂时不需要

const router = useRouter();
// const { t } = useI18n(); // 暂时不需要

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
