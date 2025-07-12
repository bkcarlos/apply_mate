<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-illustration">
        <ph-magnifying-glass :size="120" />
        <div class="error-code">404</div>
      </div>
      
      <div class="error-message">
        <h2>{{ $t('notFound.title') }}</h2>
        <p>{{ $t('notFound.message') }}</p>
      </div>
      
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <ph-house :size="16" />
          {{ $t('notFound.backHome') }}
        </el-button>
        <el-button @click="goBack">
          <ph-arrow-left :size="16" />
          {{ $t('notFound.goBack') }}
        </el-button>
      </div>
      
      <div class="helpful-links">
        <h3>{{ $t('notFound.suggestions') }}</h3>
        <div class="link-grid">
          <router-link to="/dashboard" class="help-link">
            <ph-chart-pie :size="20" />
            <span>{{ $t('notFound.links.dashboard') }}</span>
          </router-link>
          <router-link to="/calendar" class="help-link">
            <ph-calendar :size="20" />
            <span>{{ $t('notFound.links.calendar') }}</span>
          </router-link>
          <router-link to="/interviews" class="help-link">
            <ph-briefcase :size="20" />
            <span>{{ $t('notFound.links.interviews') }}</span>
          </router-link>
          <router-link to="/companies" class="help-link">
            <ph-buildings :size="20" />
            <span>{{ $t('notFound.links.companies') }}</span>
          </router-link>
          <router-link to="/analysis" class="help-link">
            <ph-chart-line :size="20" />
            <span>{{ $t('notFound.links.analysis') }}</span>
          </router-link>
          <router-link to="/settings" class="help-link">
            <ph-gear :size="20" />
            <span>{{ $t('notFound.links.settings') }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  PhMagnifyingGlass,
  PhHouse,
  PhArrowLeft,
  PhChartPie,
  PhCalendar,
  PhBriefcase,
  PhBuildings,
  PhChartLine,
  PhGear
} from '@phosphor-icons/vue'

const router = useRouter()
const { t } = useI18n()

const goHome = () => {
  router.push('/dashboard')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped lang="scss">
.not-found {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  
  .not-found-content {
    text-align: center;
    max-width: 600px;
    
    .error-illustration {
      position: relative;
      margin-bottom: 40px;
      
      svg {
        color: var(--text-placeholder);
        opacity: 0.6;
        margin-bottom: 16px;
      }
      
      .error-code {
        font-size: 72px;
        font-weight: 700;
        color: var(--primary-color);
        line-height: 1;
        margin-bottom: 20px;
      }
    }
    
    .error-message {
      margin-bottom: 40px;
      
      h2 {
        font-size: 28px;
        color: var(--text-primary);
        margin: 0 0 16px 0;
      }
      
      p {
        font-size: 16px;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.6;
      }
    }
    
    .error-actions {
      margin-bottom: 50px;
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .helpful-links {
      h3 {
        font-size: 18px;
        color: var(--text-primary);
        margin: 0 0 24px 0;
      }
      
      .link-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
        
        .help-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
          border: 1px solid var(--border-color-lighter);
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-regular);
          transition: all 0.2s;
          
          &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(242, 138, 49, 0.15);
          }
          
          svg {
            color: var(--primary-color);
          }
          
          span {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .not-found {
    padding: 20px;
    
    .not-found-content {
      .error-illustration {
        svg {
          width: 80px;
          height: 80px;
        }
        
        .error-code {
          font-size: 48px;
        }
      }
      
      .error-message {
        h2 {
          font-size: 24px;
        }
        
        p {
          font-size: 14px;
        }
      }
      
      .error-actions {
        flex-direction: column;
        
        .el-button {
          width: 100%;
        }
      }
      
      .helpful-links {
        .link-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          
          .help-link {
            padding: 16px 12px;
            
            span {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
