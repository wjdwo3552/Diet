import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Mainpage.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import ResetPassword from '../components/ResetPassword.vue'
import SearchResults from '../components/SearchResults.vue'
import routeMyinfo from '../components/routeMyinfo.vue'
import RouteMealDiary from '../components/routeMealDiary.vue'
import NutritionAnalyzer from '../components/routeNutritionAnalyzer.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults
  },
  {
    path: '/myinfo',
    name: 'Myinfo',
    component: routeMyinfo
  },
  {
    path: '/mealdiary',
    name: 'MealDiary',
    component: RouteMealDiary
  },
  {
    path: '/nutritionanalyzer',
    name: 'NutritionAnalyzer',
    component: NutritionAnalyzer
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('isAuthenticated')) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
