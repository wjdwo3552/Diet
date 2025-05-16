<template>
  <div class="meal-diary-container">
    <!-- 날짜 선택 -->
    <div class="diary-header">
      <div class="date-navigation">
        <button class="nav-button prev" @click="previousDay">
          <i class="fas fa-chevron-left"></i>
          <span>이전 날짜</span>
        </button>
        <div class="date-selector">
          <div class="current-date" @click="showCalendar = !showCalendar">
            <i class="fas fa-calendar"></i>
            <span>{{ formatDate(selectedDate) }}</span>
          </div>
          <div v-if="showCalendar" class="calendar-modal">
            <DatePicker 
              v-model="selectedDate" 
              @update:model-value="onDateSelect"
              :max-date="new Date()"
              color="green"
              is-expanded
              trim-weeks
              locale="ko-KR"
              :masks="{
                title: 'YYYY년 M월',
                weekdays: 'WW'
              }"
            />
          </div>
        </div>
        <button class="nav-button next" @click="nextDay" :disabled="isToday" :class="{ disabled: isToday }">
          <span>다음 날짜</span>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 영양 요약 -->
    <div class="nutrition-summary">
      <h2>오늘의 영양 섭취</h2>
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-title">총 칼로리</div>
          <div class="card-value">{{ totalCalories }} / {{ userProfile?.targetCalories }} kcal</div>
          <div class="calorie-difference" :class="{ 'exceeded': calorieDifference > 0 }">
            {{ calorieDifference > 0 ? '+' : '' }}{{ Math.abs(calorieDifference) }} kcal
            <span class="difference-label">{{ calorieDifference > 0 ? '초과' : '부족' }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: calorieProgress + '%' }" :class="{ 'exceeded': calorieProgress > 100 }"></div>
          </div>
        </div>
        <div class="nutrition-chart">
          <canvas ref="nutritionChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 식사 탭 -->
    <div class="meal-tabs">
      <button v-for="meal in meals" :key="meal.id" :class="['meal-tab', { active: selectedMeal === meal.id }]" @click="selectedMeal = meal.id">
        {{ meal.name }}
      </button>
      <button class="meal-tab my-diet-btn" @click="showPresetModal = true">
        <i class="fas fa-plus"></i> 나의 식단 추가
      </button>
    </div>

    <!-- 식사 기록 -->
    <div class="meal-section">
      <div class="food-search">
        <div class="search-input">
          <input type="text" v-model.trim="searchQuery" @input="onInput" placeholder="음식 검색...">
          <div v-if="searchResults.length" class="search-results">
            <div v-for="food in searchResults" :key="food.id" class="food-item" @click="selectFood(food)">
              <div class="food-name">{{ food.name }}</div>
              <div class="food-calories">{{ food.calories }}kcal</div>
            </div>
          </div>
        </div>
      </div>

      <div class="added-foods">
        <div v-for="food in getMealFoods" :key="food.id" class="added-food-item">
          <div class="food-info">
            <div class="food-name">{{ food.name }}</div>
            <div class="food-nutrition">
              <span>{{ food.calories }}kcal</span>
              <span>탄수화물 {{ food.carbs }}g</span>
              <span>단백질 {{ food.protein }}g</span>
              <span>지방 {{ food.fat }}g</span>
            </div>
          </div>
          <button class="btn-remove" @click="removeFood(food)">×</button>
        </div>
      </div>

      <div class="meal-memo">
        <textarea v-model="mealMemos[selectedMeal]" placeholder="식사에 대한 메모를 작성하세요..."></textarea>
      </div>
    </div>

    <!-- 나의 식단 프리셋 모달 -->
    <div v-if="showPresetModal" class="preset-modal-overlay" @click="showPresetModal = false">
      <div class="preset-modal" @click.stop>
        <div class="preset-modal-header">
          <h3>나의 식단 프리셋</h3>
          <button class="close-btn" @click="showPresetModal = false">×</button>
        </div>
        <div class="preset-modal-content">
          <div v-if="userProfile?.mealPresets && userProfile.mealPresets.length > 0">
            <div v-for="(preset, idx) in userProfile.mealPresets" :key="idx" class="preset-item" @click="addPresetToMeal(preset)">
              <div class="preset-name">내 식단 {{ idx + 1 }}</div>
              <div class="preset-desc">{{ preset.desc || '내용 없음' }}</div>
            </div>
          </div>
          <div v-else class="no-presets">
            저장된 식단 프리셋이 없습니다.<br>
            내 정보 페이지에서 식단 프리셋을 추가해주세요.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
import { matchesChoseong } from '../utils/koreanUtils';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

export default {
  name: 'MealDiary',
  components: {
    DatePicker
  },
  data() {
    return {
      selectedDate: new Date(),
      showCalendar: false,
      selectedMeal: 'breakfast',
      searchQuery: '',
      searchResults: [],
      meals: [
        { id: 'breakfast', name: '아침' },
        { id: 'lunch', name: '점심' },
        { id: 'dinner', name: '저녁' },
        { id: 'snack', name: '간식' }
      ],
      mealFoods: { breakfast: [], lunch: [], dinner: [], snack: [] },
      mealMemos: { breakfast: '', lunch: '', dinner: '', snack: '' },
      nutritionChart: null,
      foodDatabase: [
        { id: 1, name: '김치찌개', calories: 300, carbs: 30, protein: 15, fat: 10 },
        { id: 2, name: '된장찌개', calories: 250, carbs: 25, protein: 12, fat: 8 },
        { id: 3, name: '비빔밥', calories: 450, carbs: 45, protein: 20, fat: 15 },
        { id: 4, name: '삼겹살', calories: 500, carbs: 0, protein: 35, fat: 40 },
        { id: 5, name: '닭갈비', calories: 400, carbs: 20, protein: 30, fat: 25 },
        { id: 6, name: '순대국', calories: 350, carbs: 15, protein: 25, fat: 20 },
        { id: 7, name: '떡볶이', calories: 300, carbs: 35, protein: 10, fat: 12 },
        { id: 8, name: '라면', calories: 450, carbs: 50, protein: 15, fat: 20 },
        { id: 9, name: '갈비탕', calories: 380, carbs: 10, protein: 30, fat: 25 },
        { id: 10, name: '갈비찜', calories: 420, carbs: 15, protein: 35, fat: 28 }
      ],
      showPresetModal: false
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
    formattedDate() {
      return this.selectedDate.toISOString().split('T')[0];
    },
    isToday() {
      const today = new Date();
      return this.selectedDate.toDateString() === today.toDateString();
    },
    totalCalories() {
      return Object.values(this.mealFoods).flat().reduce((sum, food) => sum + food.calories, 0);
    },
    calorieProgress() {
      if (!this.userProfile || !this.userProfile.targetCalories) return 0;
      return Math.min((this.totalCalories / this.userProfile.targetCalories) * 100, 100);
    },
    calorieDifference() {
      if (!this.userProfile || !this.userProfile.targetCalories) return 0;
      return this.totalCalories - this.userProfile.targetCalories;
    },
    getMealFoods() {
      return this.mealFoods[this.selectedMeal] || [];
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    },
    onDateSelect(date) {
      this.showCalendar = false;
      this.loadDayData();
    },
    previousDay() {
      this.selectedDate.setDate(this.selectedDate.getDate() - 1);
      this.selectedDate = new Date(this.selectedDate);
      this.loadDayData();
    },
    nextDay() {
      if (this.isToday) return;
      this.selectedDate.setDate(this.selectedDate.getDate() + 1);
      this.selectedDate = new Date(this.selectedDate);
      this.loadDayData();
    },
    async loadDayData() {
      try {
        const data = await this.$store.dispatch('loadMealDiary', this.formattedDate);
        if (!data || !data.mealFoods) {
          this.mealFoods = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
          };
          this.mealMemos = {
            breakfast: '',
            lunch: '',
            dinner: '',
            snack: ''
          };
        } else {
          this.mealFoods = JSON.parse(JSON.stringify(data.mealFoods));
          this.mealMemos = { ...data.mealMemos };
        }
        this.updateNutritionChart();
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      }
    },
    async saveDayData() {
      await this.$store.dispatch('saveMealDiary', {
        date: this.formattedDate,
        mealFoods: this.mealFoods,
        mealMemos: this.mealMemos
      });
    },
    onInput() {
      this.searchResults = this.searchQuery
        ? this.foodDatabase.filter(food => matchesChoseong(food.name, this.searchQuery)).slice(0, 5)
        : [];
    },
    selectFood(food) {
      this.mealFoods[this.selectedMeal].push(food);
      this.searchQuery = '';
      this.searchResults = [];
      this.updateNutritionChart();
      this.saveDayData();
    },
    removeFood(food) {
      const idx = this.mealFoods[this.selectedMeal].indexOf(food);
      if (idx > -1) this.mealFoods[this.selectedMeal].splice(idx, 1);
      this.updateNutritionChart();
      this.saveDayData();
    },
    updateNutritionChart() {
      try {
        if (this.nutritionChart) {
          this.nutritionChart.destroy();
        }
        
        if (!this.$refs.nutritionChart) {
          console.warn('차트 요소를 찾을 수 없습니다.');
          return;
        }
        
        const allFoods = Object.values(this.mealFoods).flat();
        const [carbs, protein, fat] = [
          allFoods.reduce((s, f) => s + (f?.carbs || 0), 0),
          allFoods.reduce((s, f) => s + (f?.protein || 0), 0),
          allFoods.reduce((s, f) => s + (f?.fat || 0), 0)
        ];
        
        this.nutritionChart = new Chart(this.$refs.nutritionChart, {
          type: 'doughnut',
          data: {
            labels: ['탄수화물', '단백질', '지방'],
            datasets: [{
              data: [carbs, protein, fat],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      } catch (error) {
        console.error('차트 업데이트 오류:', error);
      }
    },
    addPresetToMeal(preset) {
      if (!preset || !preset.desc) return;
      
      // 프리셋에서 식품 이름 추출
      const foodNames = preset.desc.split(',').map(name => name.trim()).filter(name => name);
      
      // 식품 데이터베이스에서 일치하는 음식 찾기
      const foods = [];
      foodNames.forEach(name => {
        const food = this.foodDatabase.find(f => f.name === name);
        if (food) {
          foods.push({...food});
        }
      });
      
      // 현재 선택된 식사에 음식 추가
      if (foods.length > 0) {
        this.mealFoods[this.selectedMeal] = [...this.mealFoods[this.selectedMeal], ...foods];
        this.updateNutritionChart();
        this.saveDayData();
      }
      
      // 모달 닫기
      this.showPresetModal = false;
    }
  },
  watch: {
    'mealMemos': {
      handler() {
        this.saveDayData();
      },
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('fetchUserProfile').then(() => {
      this.$nextTick(() => {
        this.loadDayData();
      });
    });
  },
  beforeUnmount() {
    if (this.nutritionChart) {
      this.nutritionChart.destroy();
    }
  }
}
</script>


<style scoped>
.meal-diary-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.diary-header {
  margin-bottom: 20px;
  position: relative;
}

.date-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
}

.date-selector {
  background: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.current-date {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 0;
}

.current-date i {
  color: #4CAF50;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #388E3C;
  transform: translateY(-1px);
}

.nav-button.prev {
  padding-left: 20px;
}

.nav-button.next {
  padding-right: 20px;
}

.nav-button i {
  font-size: 14px;
}

.nav-button.disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.nav-button.disabled:hover {
  background: #ccc;
  transform: none;
}

.calendar-modal {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  margin-top: 10px;
  width: 340px;
  padding: 10px;
  overflow: hidden;
}

/* v-calendar 커스텀 스타일 */
:deep(.vc-container) {
  --vc-font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  --vc-rounded-lg: 12px;
  --vc-accent-600: #4CAF50;
  --vc-accent-500: #4CAF50;
  --vc-accent-400: #66BB6A;
  border: none;
  width: 100%;
}

:deep(.vc-header) {
  padding: 0px 10px 10px 10px;
}

:deep(.vc-weeks) {
  padding: 0 0 8px 0;
}

:deep(.vc-day) {
  padding: 5px 0;
  min-height: 38px;
}

:deep(.vc-day-content) {
  font-weight: 500;
  height: 32px;
  width: 32px;
  font-size: 14px;
  margin: 0 auto;
}

:deep(.vc-title) {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  padding: 0 8px;
}

:deep(.vc-weekday) {
  font-weight: 600;
  color: #666;
  font-size: 13px;
  padding: 5px 0;
  width: 36px;
}

:deep(.vc-weeks) {
  width: 100%;
}

:deep(.vc-week) {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

:deep(.vc-day-content:hover) {
  background-color: #e8f5e9;
  color: #2e7d32;
}

:deep(.vc-highlight-content-solid) {
  background-color: #4CAF50;
}

:deep(.vc-nav-title) {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

:deep(.vc-nav-arrow) {
  color: #4CAF50;
}

.nutrition-summary {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 15px;
}

.summary-card {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.calorie-difference {
  font-size: 16px;
  font-weight: 500;
  margin: 8px 0;
  padding: 4px 12px;
  border-radius: 16px;
  background-color: #e8f5e9;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.calorie-difference.exceeded {
  background-color: #ffebee;
  color: #c62828;
}

.difference-label {
  font-size: 14px;
  opacity: 0.8;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.progress.exceeded {
  background: #ff4444;
}

.nutrition-chart {
  height: 200px;
}

.meal-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meal-tab {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: #f1f3f5;
  cursor: pointer;
  transition: all 0.2s;
}

.meal-tab.active {
  background: #4CAF50;
  color: white;
}

.meal-tab.my-diet-btn {
  margin-left: auto;
  background: #ff6b6b;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.meal-tab.my-diet-btn:hover {
  background: #fa5252;
  transform: translateY(-1px);
}

.food-search {
  margin-bottom: 20px;
}

.search-input {
  position: relative;
}

.search-input input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.food-item {
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.food-item:hover {
  background: #f8f9fa;
}

.food-item .food-name {
  font-weight: 500;
  color: #333;
}

.food-item .food-calories {
  color: #666;
  font-size: 14px;
}

.added-foods {
  margin-bottom: 20px;
}

.added-food-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 28px 32px 24px 32px;
  margin-bottom: 18px;
  position: relative;
  min-height: 80px;
}

.food-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.food-name {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  color: #222;
}

.food-nutrition {
  font-size: 16px;
  color: #444;
  display: flex;
  gap: 18px;
  justify-content: center;
  align-items: center;
}

.btn-remove {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff4e7c;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(255,78,124,0.08);
}
.btn-remove:hover {
  background: #d81b60;
}

.meal-memo {
  margin-top: 20px;
}

.meal-memo textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
}

.preset-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.preset-modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
}

.preset-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.preset-modal-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.preset-modal-content {
  max-height: 300px;
  overflow-y: auto;
}

.preset-item {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.preset-item:hover {
  background-color: #f8f9fa;
}

.preset-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.preset-desc {
  font-size: 14px;
  color: #666;
}

.no-presets {
  text-align: center;
  color: #666;
}
</style> 