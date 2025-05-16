<template>
    <div class="search-results">
      <!-- 네비게이션 바 -->
      <nav class="navbar">
        <router-link to="/" class="logo-link">
          <img :src="logoCharacter" alt="Just Eat It 로고" class="nav-logo">
        </router-link>
        <div class="nav-links">
          <div class="nav-item">식단 추천</div>
          <div class="nav-item">식단 일기</div>
          <div class="nav-item">영양 진단기</div>
        </div>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="검색어를 입력하세요"
            class="search-input"
          >
          <img :src="searchIcon" alt="검색" class="search-icon" @click="handleSearch">
        </div>
        <router-link
        v-if="isLoggedIn"
        to="/mypage"
        class="login-btn"
       >내 정보</router-link>
       <router-link
        v-else
        to="/login"
        class="login-btn"
       >로그인</router-link>
    </nav>
  
      <div class="results-title">
        <span class="keyword">"{{ searchQuery }}"</span> 검색 결과
        <span class="sort">
          <img :src="searchIcon" alt="필터" class="filter-icon"> 인기순
        </span>
      </div>

      <div class="sub-info">※ 모든 영양 정보는 100g 기준입니다.</div>
  
    <div class="results-wrapper">
      <div class="results-grid">
        <div v-for="item in results" :key="item.name" class="result-card">
          <img :src="item.image" :alt="item.name" class="result-image">
          <div class="result-name">{{ item.name }}</div>
          <div class="result-nutrition">
            <div>칼로리: {{ item.kcal }}kcal</div>
            <div>지방: {{ item.fat }}g</div>
            <div>탄수화물: {{ item.carb }}g</div>
            <div>단백질: {{ item.protein }}g</div>
          </div>
          <button class="add-btn">식단 추가</button>
        </div>
      </div>
    </div>
  </div>
  </template>

  
  <script>
  import searchIcon from '../assets/searchIcon.png'
  import logoCharacter from '../assets/logo.png'
  
  export default {
    name: 'SearchResults',
    data() {
      return {
        searchIcon,
        logoCharacter,
        searchQuery: this.$route.query.q || '',
        isLoggedIn: false,
        results: [
          {
            name: '계란',
            image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/eggs-1238433_1280.jpg',
            kcal: 74,
            fat: 4.96,
            carb: 0.38,
            protein: 6.29
          },
          {
            name: '삶은 계란',
            image: 'https://cdn.pixabay.com/photo/2017/05/07/08/56/egg-2294952_1280.jpg',
            kcal: 77,
            fat: 5.28,
            carb: 0.56,
            protein: 6.26
          },
          {
            name: '계란 후라이',
            image: 'https://cdn.pixabay.com/photo/2017/03/17/08/55/fried-egg-2157119_1280.jpg',
            kcal: 89,
            fat: 6.79,
            carb: 0.43,
            protein: 6.24
          },
          {
            name: '계란말이',
            image: 'https://cdn.pixabay.com/photo/2017/07/16/10/43/egg-roll-2501962_1280.jpg',
            kcal: 134,
            fat: 8.96,
            carb: 2.61,
            protein: 10.18
          },
          {
            name: '간장계란밥',
            image: 'https://cdn.pixabay.com/photo/2020/05/25/18/36/egg-5221708_1280.jpg',
            kcal: 510,
            fat: 26.48,
            carb: 34.88,
            protein: 30.87
          },
          {
            name: '계란 샌드위치',
            image: 'https://cdn.pixabay.com/photo/2017/06/02/18/24/sandwich-2367027_1280.jpg',
            kcal: 398,
            fat: 26.47,
            carb: 26.77,
            protein: 12.56
          }
        ]
      }
    },
    methods: {
      handleSearch() {
        if (this.searchQuery.trim()) {
          this.$router.replace({ path: '/search', query: { q: this.searchQuery.trim() } })
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .search-results {
    width: 100%;
    min-height: 100vh;
    background: #fff;
    font-family: "Esamanru-Bold", sans-serif;
    
  }
  
  .navbar {
    width: 100%;
    max-width: 1200px;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    border-bottom: 1px solid #eee;
    margin: 0 auto;
    background-color: white;
  }
  
  .logo-link {
    text-decoration: none;
  }
  
  .nav-logo {
    width: 120px;
    height: auto;
    cursor: pointer;
  }
  
  .nav-links {
    display: flex;
    gap: 50px;
  }
  
  .nav-item {
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    padding: 5px 10px;
    transition: color 0.3s;
  }
  
  .nav-item:hover {
    color: #26FF00;
  }
  
  .search-container {
    position: relative;
    width: 300px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 40px 12px 15px;
    border: 2px solid #000;
    border-radius: 20px;
    font-size: 16px;
    font-family: "Esamanru-Bold", sans-serif;
  }
  
  .search-input::placeholder {
    font-family: "Esamanru-Bold", sans-serif;
    color: #999;
  }
  
  .search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .sub-info {
  max-width: 1200px;
  margin: -10px auto 30px auto; /* 제목과의 간격 조절 */
  font-size: 0.9rem;
  color: #666;
  text-align: left;
  padding-left: 5px;
  }
  
  .login-btn {
    padding: 10px 25px;
    background-color: #26FF00;
    color: white;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .login-btn:hover {
    background-color: #1fd800;
  }
  
  .results-title {
    max-width: 1200px;
    margin: 30px auto 20px auto;
    font-size: 2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .keyword {
    color: #000;
    font-weight: bold;
  }
  
  .sort {
    margin-left: auto;
    display: flex;
    align-items: center;
    font-size: 1.1rem;
  }
  
  .filter-icon {
    width: 22px;
    height: 22px;
    margin-right: 5px;
  }

  .results-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  }
  
  .results-grid {
    
    width: 1200px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  
  .result-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .result-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .result-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 15px 0 10px 0;
  }
  
  .result-nutrition {
    font-size: 1rem;
    color: #222;
    margin-bottom: 10px;
  }
  
  .add-btn {
    background: #26FF00;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 24px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
  }
  
  .add-btn:hover {
    background: #1fd800;
  }
  </style>