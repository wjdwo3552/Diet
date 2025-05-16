import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      profile: {
        nickname: '건강한식단러버',
        email: 'health@example.com',
        height: 172,
        weight: 68,
        age: 30,
        gender: 'male',
        goal: 'weight-loss',
        preferredSports: ['달리기', '요가'],
        preferredDiets: ['단백질 위주', '채소 위주'],
        allergies: [],
        targetCalories: 2200,
        targetWeight: 65,
        mealPresets: [

        ]
      }
    },
    mealDiary: {
      // 날짜별 식사 기록을 저장
      // 형식: { '2024-03-14': { mealFoods: {...}, mealMemos: {...} } }
    }
  },
  mutations: {
    updateUserProfile(state, profile) {
      state.user.profile = { ...state.user.profile, ...profile }
    },
    saveMealData(state, { date, mealFoods, mealMemos }) {
      state.mealDiary[date] = {
        mealFoods: JSON.parse(JSON.stringify(mealFoods)),
        mealMemos: { ...mealMemos }
      };
    },
    loadMealData(state, date) {
      if (!state.mealDiary[date]) {
        state.mealDiary[date] = {
          mealFoods: { breakfast: [], lunch: [], dinner: [], snack: [] },
          mealMemos: { breakfast: '', lunch: '', dinner: '', snack: '' }
        };
      }
      return state.mealDiary[date];
    }
  },
  actions: {
    updateProfile({ commit }, profile) {
      commit('updateUserProfile', profile)
    },
    saveMealDiary({ commit }, payload) {
      commit('saveMealData', payload);
    },
    loadMealDiary({ commit }, date) {
      return commit('loadMealData', date);
    }
  },
  getters: {
    userProfile: state => state.user.profile
  }
}) 