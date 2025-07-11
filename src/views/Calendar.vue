<template>
  <div class="calendar-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">{{ $t('nav.calendar') }}</h1>
          <p class="page-subtitle">面试日程管理</p>
        </div>
        <div class="action-section">
          <a-space>
            <a-button-group>
              <a-button 
                :type="viewType === 'month' ? 'primary' : 'secondary'"
                @click="viewType = 'month'"
              >
                月视图
              </a-button>
              <a-button 
                :type="viewType === 'week' ? 'primary' : 'secondary'"
                @click="viewType = 'week'"
              >
                周视图
              </a-button>
              <a-button 
                :type="viewType === 'day' ? 'primary' : 'secondary'"
                @click="viewType = 'day'"
              >
                日视图
              </a-button>
            </a-button-group>
            <a-button @click="goToToday">
              <template #icon><icon-calendar /></template>
              今天
            </a-button>
            <a-button type="primary" @click="showAddModal = true">
              <template #icon><icon-plus /></template>
              新建面试
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <!-- 日历导航 -->
    <div class="calendar-nav">
      <div class="nav-controls">
        <a-button-group>
          <a-button @click="previousPeriod">
            <template #icon><icon-left /></template>
          </a-button>
          <a-button @click="nextPeriod">
            <template #icon><icon-right /></template>
          </a-button>
        </a-button-group>
        <h2 class="current-period">{{ currentPeriodText }}</h2>
      </div>
    </div>

    <!-- 日历主体 -->
    <a-card class="calendar-card">
      <!-- 月视图 -->
      <div v-if="viewType === 'month'" class="month-view">
        <div class="calendar-header">
          <div class="weekday" v-for="day in weekdays" :key="day">
            {{ day }}
          </div>
        </div>
        <div class="calendar-grid">
          <div 
            v-for="date in monthDates" 
            :key="date.date"
            class="calendar-cell"
            :class="{
              'other-month': !date.isCurrentMonth,
              'today': date.isToday,
              'selected': date.isSelected
            }"
            @click="selectDate(date)"
          >
            <div class="date-number">{{ date.day }}</div>
            <div class="interviews-container">
              <div 
                v-for="interview in date.interviews" 
                :key="interview.id"
                class="interview-item"
                :class="`interview-${interview.type}`"
                @click.stop="viewInterviewDetail(interview)"
              >
                <div class="interview-time">{{ formatTime(interview.scheduledAt) }}</div>
                <div class="interview-title">{{ interview.companyName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 周视图 -->
      <div v-else-if="viewType === 'week'" class="week-view">
        <div class="week-header">
          <div class="time-column"></div>
          <div 
            v-for="date in weekDates" 
            :key="date.date"
            class="day-column"
            :class="{ 'today': date.isToday }"
          >
            <div class="day-label">{{ date.dayName }}</div>
            <div class="date-label">{{ date.day }}</div>
          </div>
        </div>
        <div class="week-body">
          <div class="time-slots">
            <div v-for="hour in timeSlots" :key="hour" class="time-slot">
              <div class="time-label">{{ formatHour(hour) }}</div>
              <div class="hour-grid">
                <div 
                  v-for="date in weekDates" 
                  :key="`${date.date}-${hour}`"
                  class="hour-cell"
                  @click="addInterviewAtTime(date, hour)"
                >
                  <div 
                    v-for="interview in getInterviewsAtTime(date, hour)" 
                    :key="interview.id"
                    class="hour-interview"
                    :class="`interview-${interview.type}`"
                    @click.stop="viewInterviewDetail(interview)"
                  >
                    <div class="interview-title">{{ interview.companyName }}</div>
                    <div class="interview-subtitle">{{ $t(`roundType.${interview.type}`) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 日视图 -->
      <div v-else-if="viewType === 'day'" class="day-view">
        <div class="day-header">
          <h3>{{ selectedDateText }}</h3>
        </div>
        <div class="day-timeline">
          <div v-for="hour in timeSlots" :key="hour" class="timeline-hour">
            <div class="hour-label">{{ formatHour(hour) }}</div>
            <div class="hour-content" @click="addInterviewAtTime(selectedDate, hour)">
              <div 
                v-for="interview in getInterviewsAtHour(hour)" 
                :key="interview.id"
                class="timeline-interview"
                :class="`interview-${interview.type}`"
                @click.stop="viewInterviewDetail(interview)"
              >
                <div class="interview-header">
                  <span class="company-name">{{ interview.companyName }}</span>
                  <a-tag :color="getRoundTypeColor(interview.type)" size="small">
                    {{ $t(`roundType.${interview.type}`) }}
                  </a-tag>
                </div>
                <div class="interview-details">
                  <span class="interview-time">
                    <icon-clock-circle />
                    {{ formatTime(interview.scheduledAt) }}
                  </span>
                  <span class="interview-location" v-if="interview.location">
                    <icon-location />
                    {{ interview.location }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 添加面试模态框 -->
    <a-modal
      v-model:visible="showAddModal"
      title="新建面试安排"
      @ok="handleAddInterview"
      @cancel="showAddModal = false"
    >
      <a-form :model="newInterview" layout="vertical">
        <a-form-item label="公司" required>
          <a-select 
            v-model="newInterview.companyId" 
            placeholder="选择公司"
            allow-search
          >
            <a-option 
              v-for="company in companies" 
              :key="company.id" 
              :value="company.id"
            >
              {{ company.name }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="面试类型" required>
          <a-select v-model="newInterview.type" placeholder="选择面试类型">
            <a-option value="phone">电话面试</a-option>
            <a-option value="video">视频面试</a-option>
            <a-option value="onsite">现场面试</a-option>
            <a-option value="technical">技术面试</a-option>
            <a-option value="hr">HR面试</a-option>
            <a-option value="final">终面</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="面试时间" required>
          <a-date-picker 
            v-model="newInterview.scheduledAt" 
            show-time 
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="地点">
          <a-input v-model="newInterview.location" placeholder="面试地点" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model="newInterview.notes" placeholder="面试备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import {
  IconCalendar,
  IconPlus,
  IconLeft,
  IconRight,
  IconClockCircle,
  IconLocation,
} from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';

import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';

const router = useRouter();
const { t } = useI18n();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

// 状态
const viewType = ref<'month' | 'week' | 'day'>('month');
const currentDate = ref(dayjs());
const selectedDate = ref(dayjs());
const showAddModal = ref(false);

// 新面试表单
const newInterview = ref({
  companyId: '',
  type: '',
  scheduledAt: dayjs(),
  location: '',
  notes: ''
});

// 计算属性
const companies = computed(() => companyStore.companies);

const interviews = computed(() => {
  return interviewStore.rounds
    .filter(round => round.scheduledAt && round.result === 'pending')
    .map(round => {
      const process = interviewStore.getProcessById(round.processId);
      const company = process ? companyStore.getCompanyById(process.companyId) : null;
      return {
        ...round,
        companyName: company?.name || '未知公司',
      };
    });
});

const currentPeriodText = computed(() => {
  switch (viewType.value) {
    case 'month':
      return currentDate.value.format('YYYY年 MM月');
    case 'week':
      const startOfWeek = currentDate.value.startOf('week');
      const endOfWeek = currentDate.value.endOf('week');
      return `${startOfWeek.format('MM月DD日')} - ${endOfWeek.format('MM月DD日')}`;
    case 'day':
      return selectedDate.value.format('YYYY年 MM月DD日 dddd');
    default:
      return '';
  }
});

const selectedDateText = computed(() => {
  return selectedDate.value.format('YYYY年 MM月DD日 dddd');
});

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const timeSlots = Array.from({ length: 16 }, (_, i) => i + 8); // 8:00 - 23:00

// 月视图日期
const monthDates = computed(() => {
  const firstDay = currentDate.value.startOf('month');
  const lastDay = currentDate.value.endOf('month');
  const startDate = firstDay.startOf('week');
  const endDate = lastDay.endOf('week');
  
  const dates = [];
  let current = startDate;
  
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    const interviewsOnDate = interviews.value.filter(interview => 
      dayjs(interview.scheduledAt).isSame(current, 'day')
    );
    
    dates.push({
      date: current.format('YYYY-MM-DD'),
      day: current.date(),
      dayName: weekdays[current.day()],
      isCurrentMonth: current.isSame(currentDate.value, 'month'),
      isToday: current.isSame(dayjs(), 'day'),
      isSelected: current.isSame(selectedDate.value, 'day'),
      interviews: interviewsOnDate
    });
    
    current = current.add(1, 'day');
  }
  
  return dates;
});

// 周视图日期
const weekDates = computed(() => {
  const startOfWeek = currentDate.value.startOf('week');
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.add(i, 'day');
    dates.push({
      date: date.format('YYYY-MM-DD'),
      day: date.date(),
      dayName: weekdays[date.day()],
      isToday: date.isSame(dayjs(), 'day'),
      fullDate: date
    });
  }
  
  return dates;
});

// 工具函数
const formatTime = (date: Date | string) => {
  return dayjs(date).format('HH:mm');
};

const formatHour = (hour: number) => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

const getRoundTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    phone: 'blue',
    video: 'green',
    onsite: 'orange',
    technical: 'purple',
    hr: 'cyan',
    final: 'red'
  };
  return colors[type] || 'default';
};

const getInterviewsAtTime = (date: any, hour: number) => {
  return interviews.value.filter(interview => {
    const interviewTime = dayjs(interview.scheduledAt);
    return interviewTime.isSame(date.fullDate, 'day') && 
           interviewTime.hour() === hour;
  });
};

const getInterviewsAtHour = (hour: number) => {
  return interviews.value.filter(interview => {
    const interviewTime = dayjs(interview.scheduledAt);
    return interviewTime.isSame(selectedDate.value, 'day') && 
           interviewTime.hour() === hour;
  });
};

// 事件处理
const goToToday = () => {
  currentDate.value = dayjs();
  selectedDate.value = dayjs();
};

const previousPeriod = () => {
  switch (viewType.value) {
    case 'month':
      currentDate.value = currentDate.value.subtract(1, 'month');
      break;
    case 'week':
      currentDate.value = currentDate.value.subtract(1, 'week');
      break;
    case 'day':
      selectedDate.value = selectedDate.value.subtract(1, 'day');
      break;
  }
};

const nextPeriod = () => {
  switch (viewType.value) {
    case 'month':
      currentDate.value = currentDate.value.add(1, 'month');
      break;
    case 'week':
      currentDate.value = currentDate.value.add(1, 'week');
      break;
    case 'day':
      selectedDate.value = selectedDate.value.add(1, 'day');
      break;
  }
};

const selectDate = (date: any) => {
  selectedDate.value = dayjs(date.date);
  if (viewType.value === 'month') {
    viewType.value = 'day';
  }
};

const addInterviewAtTime = (date: any, hour: number) => {
  const scheduledTime = (date.fullDate || selectedDate.value).hour(hour).minute(0);
  newInterview.value.scheduledAt = scheduledTime;
  showAddModal.value = true;
};

const viewInterviewDetail = (interview: any) => {
  const process = interviewStore.getProcessById(interview.processId);
  if (process) {
    router.push(`/interviews/${process.id}`);
  }
};

const handleAddInterview = async () => {
  try {
    // 这里应该调用添加面试的API
    console.log('Add interview:', newInterview.value);
    Message.success('面试安排创建成功');
    showAddModal.value = false;
    
    // 重置表单
    newInterview.value = {
      companyId: '',
      type: '',
      scheduledAt: dayjs(),
      location: '',
      notes: ''
    };
  } catch (error) {
    Message.error('创建失败');
  }
};

// 加载数据
const loadData = async () => {
  try {
    await Promise.all([
      interviewStore.loadProcesses(),
      interviewStore.loadRounds(),
      companyStore.loadCompanies()
    ]);
  } catch (error) {
    console.error('Failed to load calendar data:', error);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.calendar-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-3);
  margin: 0;
}

.action-section {
  flex-shrink: 0;
}

/* 日历导航 */
.calendar-nav {
  margin-bottom: 24px;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-period {
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-1);
  margin: 0;
}

/* 日历卡片 */
.calendar-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.calendar-card :deep(.arco-card-body) {
  padding: 0;
}

/* 月视图 */
.month-view {
  min-height: 600px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--color-fill-1);
  border-bottom: 1px solid var(--color-border-2);
}

.weekday {
  padding: 12px 8px;
  text-align: center;
  font-weight: 500;
  color: var(--color-text-2);
  border-right: 1px solid var(--color-border-2);
}

.weekday:last-child {
  border-right: none;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.calendar-cell {
  min-height: 100px;
  padding: 8px;
  border-right: 1px solid var(--color-border-2);
  border-bottom: 1px solid var(--color-border-2);
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-cell:hover {
  background: var(--color-fill-1);
}

.calendar-cell:nth-child(7n) {
  border-right: none;
}

.calendar-cell.other-month {
  color: var(--color-text-4);
  background: var(--color-fill-1);
}

.calendar-cell.today {
  background: var(--color-primary-light-1);
}

.calendar-cell.selected {
  background: var(--color-primary-light-2);
}

.date-number {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.interviews-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.interview-item {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
  transition: opacity 0.2s;
}

.interview-item:hover {
  opacity: 0.8;
}

.interview-technical {
  background: var(--color-purple-light-1);
  color: var(--color-purple-6);
}

.interview-hr {
  background: var(--color-cyan-light-1);
  color: var(--color-cyan-6);
}

.interview-phone {
  background: var(--color-blue-light-1);
  color: var(--color-blue-6);
}

.interview-video {
  background: var(--color-green-light-1);
  color: var(--color-green-6);
}

.interview-onsite {
  background: var(--color-orange-light-1);
  color: var(--color-orange-6);
}

.interview-final {
  background: var(--color-red-light-1);
  color: var(--color-red-6);
}

.interview-time {
  font-weight: 500;
}

.interview-title {
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 周视图 */
.week-view {
  min-height: 600px;
}

.week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  background: var(--color-fill-1);
  border-bottom: 1px solid var(--color-border-2);
}

.time-column {
  padding: 12px 8px;
  border-right: 1px solid var(--color-border-2);
}

.day-column {
  padding: 12px 8px;
  text-align: center;
  border-right: 1px solid var(--color-border-2);
}

.day-column:last-child {
  border-right: none;
}

.day-column.today {
  background: var(--color-primary-light-1);
}

.day-label {
  font-size: 12px;
  color: var(--color-text-3);
}

.date-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-top: 2px;
}

.week-body {
  overflow-y: auto;
  max-height: 600px;
}

.time-slots {
  display: flex;
  flex-direction: column;
}

.time-slot {
  display: grid;
  grid-template-columns: 80px 1fr;
  min-height: 60px;
  border-bottom: 1px solid var(--color-border-2);
}

.time-label {
  padding: 8px;
  font-size: 12px;
  color: var(--color-text-3);
  border-right: 1px solid var(--color-border-2);
  display: flex;
  align-items: flex-start;
}

.hour-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.hour-cell {
  border-right: 1px solid var(--color-border-2);
  padding: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hour-cell:hover {
  background: var(--color-fill-1);
}

.hour-cell:last-child {
  border-right: none;
}

.hour-interview {
  padding: 4px 6px;
  border-radius: 4px;
  margin-bottom: 2px;
  font-size: 12px;
  cursor: pointer;
}

/* 日视图 */
.day-view {
  min-height: 600px;
}

.day-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border-2);
  background: var(--color-fill-1);
}

.day-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text-1);
}

.day-timeline {
  overflow-y: auto;
  max-height: 600px;
}

.timeline-hour {
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid var(--color-border-2);
}

.hour-label {
  width: 80px;
  padding: 8px;
  font-size: 12px;
  color: var(--color-text-3);
  border-right: 1px solid var(--color-border-2);
  flex-shrink: 0;
}

.hour-content {
  flex: 1;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hour-content:hover {
  background: var(--color-fill-1);
}

.timeline-interview {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.timeline-interview:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.company-name {
  font-size: 16px;
  font-weight: 500;
}

.interview-details {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--color-text-3);
}

.interview-details > span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .nav-controls {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .current-period {
    font-size: 16px;
  }
  
  .calendar-cell {
    min-height: 80px;
    padding: 4px;
  }
  
  .time-slot {
    grid-template-columns: 60px 1fr;
    min-height: 50px;
  }
  
  .hour-label {
    width: 60px;
  }
}
</style>