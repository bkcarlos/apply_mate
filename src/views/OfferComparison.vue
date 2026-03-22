<template>
  <div class="offer-comparison">
    <div class="page-header">
      <h2 class="page-title">Offer 对比</h2>
      <el-button type="primary" :icon="Plus" @click="openAddDialog">添加 Offer</el-button>
    </div>

    <!-- Offer 卡片列表 -->
    <div class="offer-cards-wrap">
      <div class="offer-cards">
        <div
          v-for="offer in offers"
          :key="offer.id"
          class="offer-card"
          :style="{ borderTopColor: getColor(offer.id) }"
        >
          <div class="offer-card-header">
            <div class="offer-color-dot" :style="{ background: getColor(offer.id) }" />
            <div class="offer-info">
              <div class="company-name">
                <span v-if="offer.city" class="city-tag">{{ offer.city }}</span>
                <span v-if="offer.city" class="city-sep"> · </span>
                {{ offer.companyName }}
              </div>
              <div class="position">{{ offer.position }}</div>
              <div class="level">{{ offer.level || '\u00a0' }}</div>
            </div>
            <div class="offer-actions">
              <el-button :icon="Edit" circle size="small" @click="openEditDialog(offer)" />
              <el-button :icon="Delete" circle size="small" type="danger" @click="removeOffer(offer.id)" />
            </div>
          </div>
          <div class="offer-card-stats">
            <div class="stat">
              <span class="stat-value">{{ offer.baseMonthlySalary }}k</span>
              <span class="stat-label">月基础薪</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ offer.totalAnnual }}k</span>
              <span class="stat-label">年总包</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ offer.bonusMonths > 0 ? offer.bonusMonths : '—' }}</span>
              <span class="stat-label">年终(月)</span>
            </div>
          </div>
          <el-tag v-if="offer.deadline" size="small" type="warning" class="deadline-tag">
            截止 {{ offer.deadline }}
          </el-tag>
        </div>

        <div class="offer-card add-card" @click="openAddDialog">
          <el-icon :size="32"><Plus /></el-icon>
          <span>添加 Offer</span>
        </div>
      </div>
    </div>

    <template v-if="offers.length >= 1">
      <!-- 薪资各项独立对比 -->
      <section class="chart-section">
        <div class="section-header">
          <h3>薪资结构对比</h3>
        </div>
        <div class="salary-breakdown-grid">
          <div class="breakdown-card">
            <div class="breakdown-title">月基础薪 <span class="breakdown-unit">k/月</span></div>
            <div ref="baseChartRef" class="chart-mini" :style="{ height: miniChartHeight }" />
          </div>
          <div class="breakdown-card">
            <div class="breakdown-title">年终奖 <span class="breakdown-unit">月数</span></div>
            <div ref="bonusChartRef" class="chart-mini" :style="{ height: miniChartHeight }" />
          </div>
          <div class="breakdown-card">
            <div class="breakdown-title">股权/期权 <span class="breakdown-unit">k/年</span></div>
            <div ref="stockChartRef" class="chart-mini" :style="{ height: miniChartHeight }" />
          </div>
        </div>
      </section>

      <!-- 年总包对比 -->
      <section class="chart-section">
        <div class="section-header">
          <h3>年总包对比</h3>
        </div>
        <div class="salary-breakdown-grid salary-breakdown-grid--single">
          <div class="breakdown-card">
            <div class="breakdown-title">年总包 <span class="breakdown-unit">含基础薪、年终奖、股权（k/年）</span></div>
            <div ref="totalChartRef" class="chart-mini" :style="{ height: miniChartHeight }" />
          </div>
        </div>
      </section>

      <!-- 工作条件对比 -->
      <section class="chart-section">
        <div class="section-header">
          <h3>工作条件对比</h3>
        </div>
        <div class="conditions-table-wrap">
          <table class="conditions-table">
            <thead>
              <tr>
                <th class="label-col">维度</th>
                <th v-for="offer in offers" :key="offer.id">
                  <span class="th-dot" :style="{ background: getColor(offer.id) }" />
                  {{ offer.companyName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="label-col">城市</td>
                <td v-for="offer in offers" :key="offer.id">{{ offer.city || '—' }}</td>
              </tr>
              <tr>
                <td class="label-col">远程</td>
                <td v-for="offer in offers" :key="offer.id">
                  <el-tag :type="remoteTagType(offer.remote)" size="small">{{ remoteLabel(offer.remote) }}</el-tag>
                </td>
              </tr>
              <tr>
                <td class="label-col">工作时间</td>
                <td v-for="offer in offers" :key="offer.id">{{ offer.workHours || '—' }}</td>
              </tr>
              <tr>
                <td class="label-col">试用期</td>
                <td v-for="offer in offers" :key="offer.id">
                  {{ offer.probationMonths ? `${offer.probationMonths}个月` : '—' }}
                  <span v-if="offer.probationRatio < 1" class="text-muted">
                    ({{ Math.round(offer.probationRatio * 100) }}%)
                  </span>
                </td>
              </tr>
              <tr>
                <td class="label-col">公积金基数</td>
                <td v-for="offer in offers" :key="offer.id">
                  <el-tag :type="scoreTagType(offer.insuranceScore)" size="small">
                    {{ scoreLabel(offer.insuranceScore) }}
                  </el-tag>
                </td>
              </tr>
              <tr>
                <td class="label-col">年假</td>
                <td v-for="offer in offers" :key="offer.id">
                  {{ offer.annualLeaveDays ? `${offer.annualLeaveDays}天` : '—' }}
                </td>
              </tr>
              <tr>
                <td class="label-col">公司阶段</td>
                <td v-for="offer in offers" :key="offer.id">{{ offer.companyStage || '—' }}</td>
              </tr>
              <tr>
                <td class="label-col">入职时间</td>
                <td v-for="offer in offers" :key="offer.id">{{ offer.startDate || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 福利雷达图 -->
      <section class="chart-section">
        <div class="section-header">
          <h3>福利维度雷达</h3>
          <span class="section-desc">1–5分</span>
        </div>
        <div ref="benefitChartRef" class="chart-container" />
      </section>

      <!-- 综合评分雷达 -->
      <section class="chart-section">
        <div class="section-header">
          <h3>综合评分雷达</h3>
          <span class="section-desc">主观打分 1–5分</span>
        </div>
        <div ref="overallChartRef" class="chart-container" />
      </section>
    </template>

    <el-empty v-else description="添加至少 1 个 Offer 开始对比" class="empty-state" />

    <!-- 添加/编辑 Dialog -->
    <el-dialog v-model="dialogVisible" :title="editingOffer ? '编辑 Offer' : '添加 Offer'" width="600px" :close-on-click-modal="false">
      <el-form :model="form" label-width="110px" class="offer-form">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="公司">
              <el-input v-model="form.companyName" placeholder="公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-input v-model="form.position" placeholder="岗位名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="级别">
              <el-input v-model="form.level" placeholder="如 P7 / L5" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市">
              <el-input v-model="form.city" placeholder="工作城市" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">薪资结构</el-divider>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="月基础薪(k)">
              <el-input-number v-model="form.baseMonthlySalary" :min="0" :precision="1" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年终奖(月)">
              <el-input-number v-model="form.bonusMonths" :min="0" :precision="1" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="股票/期权(k/年)">
              <el-input-number v-model="form.stockAnnual" :min="0" :precision="1" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年总包(k)">
              <el-input-number v-model="form.totalAnnual" :min="0" :precision="1" style="width:100%" />
              <div class="form-hint">留空则自动计算</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">工作条件</el-divider>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="远程">
              <el-select v-model="form.remote" style="width:100%">
                <el-option label="不支持" value="no" />
                <el-option label="混合办公" value="hybrid" />
                <el-option label="全远程" value="full" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作时间">
              <el-select v-model="form.workHours" style="width:100%">
                <el-option label="弹性" value="弹性" />
                <el-option label="955" value="955" />
                <el-option label="965" value="965" />
                <el-option label="996" value="996" />
                <el-option label="大小周" value="大小周" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="试用期(月)">
              <el-input-number v-model="form.probationMonths" :min="0" :max="12" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试用期薪资">
              <el-slider v-model="form.probationRatioPct" :min="50" :max="100" :step="5" show-input input-size="small" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">福利待遇</el-divider>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="公积金基数">
              <el-rate v-model="form.insuranceScore" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商业医保">
              <el-rate v-model="form.medicalScore" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="年假(天)">
              <el-input-number v-model="form.annualLeaveDays" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补贴">
              <el-rate v-model="form.subsidyScore" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">综合评分</el-divider>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="薪资满意度">
              <el-rate v-model="form.salaryScore" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发展空间">
              <el-rate v-model="form.growthScore" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="工作强度">
              <el-rate v-model="form.worklifeScore" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团队/文化">
              <el-rate v-model="form.cultureScore" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">其他</el-divider>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="公司阶段">
              <el-select v-model="form.companyStage" style="width:100%">
                <el-option label="早期创业" value="早期创业" />
                <el-option label="成长期" value="成长期" />
                <el-option label="Pre-IPO" value="Pre-IPO" />
                <el-option label="上市公司" value="上市公司" />
                <el-option label="大厂" value="大厂" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止日期">
              <el-date-picker v-model="form.deadline" type="date" value-format="YYYY-MM-DD" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="入职时间">
              <el-input v-model="form.startDate" placeholder="如 2025-05-01" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveOffer">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useInterviewStore } from '@/stores/interview'
import { useCompanyStore } from '@/stores/company'

const interviewStore = useInterviewStore()
const companyStore = useCompanyStore()

// ─── 颜色 ────────────────────────────────────────────────────────────
const COLORS = ['#FF6B35', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444']
const getColor = (id: string) => COLORS[offers.value.findIndex(o => o.id === id) % COLORS.length]

// ─── 数据模型 ─────────────────────────────────────────────────────────
interface OfferItem {
  id: string
  processId?: string   // 关联的 InterviewProcess.id，自动导入时填写
  companyName: string
  position: string
  level: string
  city: string
  baseMonthlySalary: number
  bonusMonths: number
  stockAnnual: number
  totalAnnual: number
  remote: 'no' | 'hybrid' | 'full'
  workHours: string
  probationMonths: number
  probationRatioPct: number
  insuranceScore: number
  medicalScore: number
  annualLeaveDays: number
  subsidyScore: number
  salaryScore: number
  growthScore: number
  worklifeScore: number
  cultureScore: number
  companyStage: string
  deadline: string
  startDate: string
  note: string
}

const STORAGE_KEY = 'offer-comparison-data'

const loadOffers = (): OfferItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveOffers = (items: OfferItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const offers = ref<OfferItem[]>(loadOffers())

// ─── Dialog ───────────────────────────────────────────────────────────
const dialogVisible = ref(false)
const editingOffer = ref<OfferItem | null>(null)

const defaultForm = (): OfferItem => ({
  id: Date.now().toString(),
  companyName: '',
  position: '',
  level: '',
  city: '',
  baseMonthlySalary: 0,
  bonusMonths: 0,
  stockAnnual: 0,
  totalAnnual: 0,
  remote: 'no',
  workHours: '弹性',
  probationMonths: 3,
  probationRatioPct: 100,
  insuranceScore: 3,
  medicalScore: 3,
  annualLeaveDays: 10,
  subsidyScore: 3,
  salaryScore: 3,
  growthScore: 3,
  worklifeScore: 3,
  cultureScore: 3,
  companyStage: '',
  deadline: '',
  startDate: '',
  note: '',
})

const form = ref<OfferItem>(defaultForm())

const openAddDialog = () => {
  editingOffer.value = null
  form.value = defaultForm()
  dialogVisible.value = true
}

const openEditDialog = (offer: OfferItem) => {
  editingOffer.value = offer
  form.value = { ...offer }
  dialogVisible.value = true
}

const computedTotal = (f: OfferItem) => {
  if (f.totalAnnual > 0) return f.totalAnnual
  return Math.round((f.baseMonthlySalary * 12 + f.baseMonthlySalary * f.bonusMonths + f.stockAnnual) * 10) / 10
}

const saveOffer = () => {
  const item = { ...form.value }
  item.totalAnnual = computedTotal(item)

  if (editingOffer.value) {
    const idx = offers.value.findIndex(o => o.id === item.id)
    if (idx !== -1) offers.value[idx] = item
  } else {
    offers.value.push(item)
  }

  saveOffers(offers.value)
  dialogVisible.value = false
}

const removeOffer = (id: string) => {
  offers.value = offers.value.filter(o => o.id !== id)
  saveOffers(offers.value)
}

// ─── 辅助标签 ──────────────────────────────────────────────────────────
const remoteLabel = (v: string) => ({ no: '不支持', hybrid: '混合', full: '全远程' }[v] || v)
const miniChartHeight = computed(() => `${Math.max(60, offers.value.length * 36)}px`)

const remoteTagType = (v: string) =>({ no: 'info', hybrid: 'warning', full: 'success' }[v] || 'info') as any
const scoreLabel = (v: number) => ['', '较差', '一般', '良好', '优秀', '极佳'][v] || '—'
const scoreTagType = (v: number): any => v >= 4 ? 'success' : v >= 3 ? 'warning' : 'danger'

// ─── 图表 ─────────────────────────────────────────────────────────────
const baseChartRef  = ref<HTMLElement>()
const bonusChartRef = ref<HTMLElement>()
const stockChartRef = ref<HTMLElement>()
const totalChartRef = ref<HTMLElement>()
const benefitChartRef = ref<HTMLElement>()
const overallChartRef = ref<HTMLElement>()

let baseChart:    echarts.ECharts | null = null
let bonusChart:   echarts.ECharts | null = null
let stockChart:   echarts.ECharts | null = null
let totalChart:   echarts.ECharts | null = null
let benefitChart: echarts.ECharts | null = null
let overallChart: echarts.ECharts | null = null

const initCharts = async () => {
  await nextTick()
  if (offers.value.length === 0) return

  // 销毁旧实例
  baseChart?.dispose()
  bonusChart?.dispose()
  stockChart?.dispose()
  totalChart?.dispose()
  benefitChart?.dispose()
  overallChart?.dispose()

  const names = offers.value.map(o => o.companyName || o.position)
  const colors = offers.value.map(o => getColor(o.id))

  // 迷你横向柱状图公共配置生成
  const miniBarOption = (data: number[], unit: string, fmt?: (v: number) => string) => ({
    tooltip: {
      trigger: 'axis',
      formatter: (p: any) => `${p[0].name}<br/>${p[0].marker}${fmt ? fmt(p[0].value) : p[0].value + unit}`
    },
    grid: { left: 8, right: 40, top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: { type: 'category', data: names, axisLabel: { fontSize: 11, width: 60, overflow: 'truncate' } },
    series: [{
      type: 'bar',
      data: data.map((v, i) => ({ value: v, itemStyle: { color: COLORS[i % COLORS.length] } })),
      label: { show: true, position: 'right', fontSize: 11, formatter: (p: any) => fmt ? fmt(p.value) : `${p.value}${unit}` },
      barMaxWidth: 18,
    }],
  })

  // 1a. 月基础薪
  if (baseChartRef.value) {
    baseChart = echarts.init(baseChartRef.value)
    baseChart.setOption(miniBarOption(
      offers.value.map(o => o.baseMonthlySalary), 'k'
    ))
  }

  // 1b. 年终奖
  if (bonusChartRef.value) {
    bonusChart = echarts.init(bonusChartRef.value)
    bonusChart.setOption(miniBarOption(
      offers.value.map(o => o.bonusMonths), '个月',
      v => v > 0 ? `${v}个月` : '无'
    ))
  }

  // 1c. 股权/期权
  if (stockChartRef.value) {
    stockChart = echarts.init(stockChartRef.value)
    stockChart.setOption(miniBarOption(
      offers.value.map(o => o.stockAnnual), 'k',
      v => v > 0 ? `${v}k` : '无'
    ))
  }

  // 迷你图宽高在首次渲染时可能为 0，用 rAF 补一次 resize
  requestAnimationFrame(() => {
    baseChart?.resize()
    bonusChart?.resize()
    stockChart?.resize()
  })

  // 2. 年总包（与薪资结构同顺序）
  if (totalChartRef.value) {
    totalChart = echarts.init(totalChartRef.value)
    totalChart.setOption(miniBarOption(
      offers.value.map(o => o.totalAnnual), 'k'
    ))
  }

  requestAnimationFrame(() => { totalChart?.resize() })

  // 3. 福利雷达图
  if (benefitChartRef.value) {
    benefitChart = echarts.init(benefitChartRef.value)
    benefitChart.setOption({
      legend: { data: names, bottom: 0 },
      radar: {
        indicator: [
          { name: '公积金基数', max: 5 },
          { name: '商业医保', max: 5 },
          { name: '年假天数', max: 5 },
          { name: '补贴', max: 5 },
          { name: '医疗健康', max: 5 },
        ],
        radius: '60%',
      },
      series: [{
        type: 'radar',
        data: offers.value.map((o, i) => ({
          name: names[i],
          value: [
            o.insuranceScore,
            o.medicalScore,
            Math.min(5, Math.round(o.annualLeaveDays / 5)),
            o.subsidyScore,
            Math.round((o.insuranceScore + o.medicalScore) / 2),
          ],
          lineStyle: { color: colors[i] },
          areaStyle: { color: colors[i], opacity: 0.15 },
          itemStyle: { color: colors[i] },
        })),
      }],
    })
  }

  // 4. 综合评分雷达图
  if (overallChartRef.value) {
    overallChart = echarts.init(overallChartRef.value)
    overallChart.setOption({
      legend: { data: names, bottom: 0 },
      radar: {
        indicator: [
          { name: '薪资满意度', max: 5 },
          { name: '发展空间', max: 5 },
          { name: '工作强度', max: 5 },
          { name: '福利', max: 5 },
          { name: '团队文化', max: 5 },
        ],
        radius: '60%',
      },
      series: [{
        type: 'radar',
        data: offers.value.map((o, i) => ({
          name: names[i],
          value: [o.salaryScore, o.growthScore, o.worklifeScore, Math.round((o.insuranceScore + o.medicalScore + o.subsidyScore) / 3), o.cultureScore],
          lineStyle: { color: colors[i] },
          areaStyle: { color: colors[i], opacity: 0.15 },
          itemStyle: { color: colors[i] },
        })),
      }],
    })
  }
}

const handleResize = () => {
  baseChart?.resize()
  bonusChart?.resize()
  stockChart?.resize()
  totalChart?.resize()
  benefitChart?.resize()
  overallChart?.resize()
}

watch(() => offers.value, () => initCharts(), { deep: true })

const importFromStore = async () => {
  await interviewStore.loadInterviews()
  await companyStore.loadCompanies()

  const existingProcessIds = new Set(offers.value.map(o => o.processId).filter(Boolean))
  const offerProcesses = interviewStore.interviews.filter(p => p.status === '已发Offer')

  const newItems: OfferItem[] = []
  for (const process of offerProcesses) {
    if (existingProcessIds.has(process.id)) continue
    const company = companyStore.getCompanyById(process.companyId)
    const s = process.offeredSalary
    newItems.push({
      id: `imported-${process.id}`,
      processId: process.id,
      companyName: company?.name ?? '未知公司',
      position: process.position,
      level: '',
      city: process.city,
      baseMonthlySalary: s?.base ?? process.expectedSalary?.min ?? 0,
      bonusMonths: s?.bonus ?? 0,
      stockAnnual: 0,
      totalAnnual: s?.total ?? 0,
      remote: 'no',
      workHours: '弹性',
      probationMonths: 3,
      probationRatioPct: 100,
      insuranceScore: 3,
      medicalScore: 3,
      annualLeaveDays: 10,
      subsidyScore: 3,
      salaryScore: 3,
      growthScore: 3,
      worklifeScore: 3,
      cultureScore: 3,
      companyStage: company?.type ?? '',
      deadline: '',
      startDate: '',
      note: process.remarks ?? '',
    })
  }

  if (newItems.length > 0) {
    offers.value = [...offers.value, ...newItems]
    saveOffers(offers.value)
  }
}

onMounted(async () => {
  await importFromStore()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  baseChart?.dispose()
  bonusChart?.dispose()
  stockChart?.dispose()
  totalChart?.dispose()
  benefitChart?.dispose()
  overallChart?.dispose()
})
</script>

<style lang="scss" scoped>
.offer-comparison {
  padding: $spacing-lg;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-md;
    padding-bottom: calc(60px + #{$spacing-md});
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.page-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  margin: 0;
}

// Offer 卡片
.offer-cards-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-xs;
}

.offer-cards {
  display: flex;
  gap: $spacing-md;
  min-width: max-content;
}

.offer-card {
  width: 220px;
  flex-shrink: 0;
  border: 1px solid $border-light;
  border-top: 3px solid $primary-orange;
  border-radius: $border-radius-lg;
  padding: $spacing-md;
  background: $color-white;
  box-shadow: $shadow-light;

  &.add-card {
    border-top-color: $border-light;
    border-style: dashed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    color: #909399;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $primary-orange;
      color: $primary-orange;
    }
  }
}

.offer-card-header {
  display: flex;
  align-items: flex-start;
  gap: $spacing-xs;
  margin-bottom: $spacing-sm;
}

.offer-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.offer-info {
  flex: 1;
  min-width: 0;

  .company-name {
    font-weight: $font-weight-medium;
    font-size: $font-size-sm;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .city-tag {
      color: $color-text-secondary;
      font-weight: $font-weight-normal;
    }

    .city-sep {
      color: $color-text-secondary;
      opacity: 0.5;
    }
  }

  .position {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    margin-top: 2px;
  }

  .level {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    opacity: 0.7;
    margin-top: 1px;
    line-height: 1.4;
  }
}

.offer-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.offer-card-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-xs;

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .stat-value {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $primary-orange;
    }

    .stat-label {
      font-size: 10px;
      color: $color-text-secondary;
    }
  }
}

.deadline-tag {
  margin-top: $spacing-xs;
}

// 图表区块
.chart-section {
  background: $color-white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-light;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;

  h3 {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    margin: 0;
  }

  .section-desc {
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }
}

.chart-container {
  height: 320px;

  &--short {
    height: 200px;
  }
}

.salary-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;

  &--single {
    grid-template-columns: 1fr;
  }

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
  }
}

.breakdown-card {
  background: $bg-light;
  border-radius: $border-radius-md;
  padding: $spacing-sm $spacing-md;

  .breakdown-title {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    margin-bottom: $spacing-xs;

    .breakdown-unit {
      font-size: $font-size-xs;
      color: $color-text-secondary;
      font-weight: $font-weight-normal;
      margin-left: 4px;
    }
  }
}

.chart-mini {
  height: 32px; // 每条 offer 32px，由 echarts 自动适配
  min-height: 60px;
}

// 工作条件表格
.conditions-table-wrap {
  overflow-x: auto;
}

.conditions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $font-size-sm;

  th, td {
    padding: 10px 16px;
    text-align: left;
    border-bottom: 1px solid $border-light;
    white-space: nowrap;
  }

  th {
    background: $bg-light;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    font-size: $font-size-xs;
  }

  td.label-col, th.label-col {
    color: $color-text-secondary;
    font-size: $font-size-xs;
    width: 100px;
  }

  tr:last-child td {
    border-bottom: none;
  }
}

.th-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

.text-muted {
  color: $color-text-secondary;
  font-size: $font-size-xs;
}

.form-hint {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  margin-top: 2px;
}

.empty-state {
  padding: 80px 0;
}

.offer-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px;
}
</style>
