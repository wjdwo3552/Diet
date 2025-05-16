<template>
  <div class="nutrition-analyzer">
    <div class="header">
      <h1>영양 진단기</h1>
      <p class="subtitle">당신의 영양 섭취 상태를 분석해드립니다</p>
    </div>
    
    <!-- 기간 선택 -->
    <div class="period-selector">
      <button 
        v-for="period in periods" 
        :key="period.value"
        :class="{ active: selectedPeriod === period.value }"
        @click="changePeriod(period.value)"
      >
        {{ period.label }}
      </button>
    </div>

    <div class="content-wrapper">
      <!-- 영양소 분석 차트 -->
      <div class="chart-section">
        <div class="chart-container">
          <h3>주요 영양소 분석</h3>
          <div class="chart-wrapper">
            <Bar
              v-if="chartData"
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>

      <!-- 분석 리포트 -->
      <div class="analysis-section">
        <div class="report-card deficiency">
          <h4>부족한 영양소</h4>
          <div class="nutrient-list">
            <div v-for="item in deficiencyList" :key="item.name" class="nutrient-item">
              <span class="nutrient-name">{{ item.name }}</span>
              <div class="progress-bar">
                <div class="progress" :style="{ width: item.difference + '%' }"></div>
              </div>
              <span class="difference">{{ item.difference }}% 부족</span>
            </div>
          </div>
        </div>

        <div class="report-card excess">
          <h4>과다 섭취 영양소</h4>
          <div class="nutrient-list">
            <div v-for="item in excessList" :key="item.name" class="nutrient-item">
              <span class="nutrient-name">{{ item.name }}</span>
              <div class="progress-bar">
                <div class="progress" :style="{ width: item.difference + '%' }"></div>
              </div>
              <span class="difference">{{ item.difference }}% 초과</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  name: 'NutritionAnalyzer',
  components: { Bar },
  data() {
    return {
      selectedPeriod: 'day',
      periods: [
        { label: '일간', value: 'day' },
        { label: '주간', value: 'week' },
        { label: '월간', value: 'month' }
      ],
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '섭취량 (%)'
            }
          }
        }
      },
      deficiencyList: [],
      excessList: []
    }
  },
  computed: {
    userProfile() {
      if (
        !this.$store ||
        !this.$store.state ||
        !this.$store.state.user ||
        !this.$store.state.user.profile
      ) {
        return null;
      }
      return this.$store.state.user.profile
    },
  },
  methods: {
    changePeriod(period) {
      this.selectedPeriod = period
      this.updateData()
    },
    updateData() {
      // 차트 데이터 업데이트
      this.chartData = {
        labels: ['단백질', '탄수화물', '지방', '비타민A', '비타민C', '칼슘', '철분'],
        datasets: [{
          data: [85, 120, 90, 70, 95, 80, 110],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }

      // 리포트 데이터 업데이트
      this.deficiencyList = [
        { name: '비타민A', difference: 30 },
        { name: '칼슘', difference: 20 }
      ]
      this.excessList = [
        { name: '탄수화물', difference: 20 },
        { name: '철분', difference: 10 }
      ]
    }
  },
  mounted() {
    this.$store.dispatch('fetchUserProfile').then(() => {
      this.updateData();
    });
  }
}
</script>

<style scoped>
.nutrition-analyzer {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.period-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.period-selector button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.period-selector button.active {
  background: #3498db;
  color: white;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.chart-container {
  height: 400px;
}

.chart-wrapper {
  height: 100%;
}

.analysis-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.report-card h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.nutrient-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nutrient-item {
  display: grid;
  grid-template-columns: 100px 1fr 80px;
  align-items: center;
  gap: 1rem;
}

.nutrient-name {
  font-weight: 500;
  color: #2c3e50;
}

.progress-bar {
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3498db;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.deficiency .progress {
  background: #e74c3c;
}

.excess .progress {
  background: #2ecc71;
}

.difference {
  font-size: 0.9rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .nutrient-item {
    grid-template-columns: 80px 1fr 70px;
  }
}
</style> 