<template>
  <div class="div-wrapper">
    <div class="div">
      <!-- 메인 페이지 로고 -->
      <img class="image" :src="mainLogo" alt="메인 로고" />

      <!-- 내 정보 링크 -->
      <div class="text-wrapper">
        <router-link to="/mypage" class="login-link" translate="no">내 정보</router-link>
      </div>

      <div class="logout-wrapper">
        <button @click="handleLogout" class="logout-button" aria-label="로그아웃" title="로그아웃">
          <img :src="logoutIcon" alt="로그아웃 아이콘" class="logout-icon" />
        </button>
      </div>

      <!-- 검색창 -->
      <div class="view" @click="focusSearchInput">
        <div class="overlap-group">
          <div class="search-input-container">
            <img class="img" :src="searchIcon" alt="검색 아이콘" />
            <input ref="searchInput" class="search-input" type="text" translate="no" placeholder="검색어를 입력하세요" />
          </div>
        </div>
      </div>
    </div>

    <!-- 네비게이션 바 -->
    <div class="navbar">
      <div class="text-wrapper-3" translate="no">식단 추천</div>
      <div class="text-wrapper-4" translate="no">식단 일기</div>
      <div class="text-wrapper-5" translate="no">영양 진단기</div>
    </div>

    <!-- 메인 문구 -->
    <p class="p" translate="no">JUST EAT IT과 함께 스마트한 식단관리를 시작하세요</p>
  </div>

  <!-- 목표 칼로리 달성률 Progress Bar -->
  <div class="progress-bar-wrapper">
    <div class="progress-bar-title">justeatit님의 오늘 목표 칼로리 달성률</div>
    <div class="progress-bar-background">
      <div :style="{ width: progressBarWidth }" class="progress-bar"></div>
    </div>
    <div class="progress-bar-info">
      <span>현재: {{ currentCalories }}kcal</span>
      <span>목표: {{ userGoal.calories }}kcal</span>
    </div>
  </div>

  <div class="today-meal-section">
    <h2 class="section-title" translate="no">
      <img :src="recommendIcon" alt="식단 추천 아이콘" class="recommend_icon">
      오늘은 이 식단 어때요?
    </h2>
    <div class="carousel-wrapper">
      <button class="slide-button left" @click="scrollLeft" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">‹</button>
      <div class="carousel" ref="carousel">
        <div class="card" v-for="(meal, index) in visibleMeals" :key="index" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
          <img :src="meal.image" alt="식단 이미지" class="card-image" />
          <div class="card-content">
            <h3 class="meal-title" translate="no">{{ meal.title }}</h3>
            <p class="meal-desc" translate="no">{{ meal.description }}</p>
          </div>
        </div>
      </div>
      <button class="slide-button right" @click="scrollRight" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">›</button>
    </div>
  </div>
</template>

<script>
import mainLogo from '@/assets/메인페이지 로고1.png';
import searchIcon from '@/assets/검색 아이콘.png';
import logoutIcon from "@/assets/logout-icon.png";
import recommendIcon from '@/assets/mealrecommend.png';

import meal1 from '@/assets/meal1.jpg';
import meal2 from '@/assets/meal2.jpg';
import meal3 from '@/assets/meal3.jpg';
import meal4 from '@/assets/meal4.jpg';
import meal5 from '@/assets/meal5.jpg';
import meal6 from '@/assets/meal6.jpg';
import meal7 from '@/assets/meal7.jpg';
import meal8 from '@/assets/meal8.jpg';
import meal9 from '@/assets/meal9.jpg';
import meal10 from '@/assets/meal10.jpg';
import meal11 from '@/assets/meal11.jpg';
import meal12 from '@/assets/meal12.jpg';
import meal13 from '@/assets/meal13.jpg';
import meal14 from '@/assets/meal14.jpg';
import meal15 from '@/assets/meal15.jpg';

export default {
  name: "mainPage_after_login",
  data() {
    return {
      mainLogo,
      searchIcon,
      logoutIcon,
      meals: [
        { title: "고단백질 식단", description: "튼튼한 하루, 단백질로 시작!", image: meal1 },
        { title: "저염식 식단", description: "소금을 줄이고 삶을 더하다", image: meal2 },
        { title: "비건 식단", description: "자연을 담은 한 그릇", image: meal3 },
        { title: "저당식 식단", description: "당 줄이고 활력 더하기!", image: meal4 },
        { title: "할랄 식단", description: "안심하고 즐기는 할랄 한끼", image: meal5 },
        { title: "다이어트 식단", description: "슬림한 몸매를 위한 최적의 식단!", image: meal6 },
        { title: "벌크업 식단", description: "벌크업을 위한 고단백 식사", image: meal7 },
        { title: "저지방식 식단", description: "기름기 없이, 부담 없이", image: meal8 },
        { title: "간헐적 단식 식단", description: "텀은 길게, 한 끼는 꽉 차게", image: meal9 },
        { title: "키토제닉 식단", description: "키토 한 끼, 뇌도 몸도 가볍게", image: meal10 },
        { title: "콜레스테롤 제한 식단", description: "착한 식단이 좋은 혈관을 만든다", image: meal11 },
        { title: "속 편한 식단", description: "과민성 대장 증후군을 위한 식단", image: meal12 },
        { title: "소화불량 맞춤 식단", description: "소화를 돕는 부드러운 선택", image: meal13 },
        { title: "채식주의 식단", description: "자연에서 온 한끼, 나를 위한 선택", image: meal14 },
        { title: "코셔식 식단", description: "율법을 담은 건강한 식단", image: meal15 }
      ],
      visibleMeals: [],
      userGoal: { calories: 2000 }, // 사용자 목표 칼로리 (예시)
      currentCalories: 1200, // 현재 섭취한 칼로리 (예시)
      autoSlideInterval: null,
      recommendIcon
    };
  },
  computed: {
    progressBarWidth() {
      return `${(this.currentCalories / this.userGoal.calories) * 100}%`;
    },
  },
  mounted() {
    this.visibleMeals = this.getRandomMeals(8);
    this.startAutoSlide();

    this.$nextTick(() => {
      const carousel = this.$refs.carousel;
      if (carousel) {
        const cards = carousel.querySelectorAll('.card');
        const buttons = carousel.querySelectorAll('.slide-button');
        [...cards, ...buttons].forEach(el => {
          el.addEventListener('mouseenter', this.stopAutoSlide);
          el.addEventListener('mouseleave', this.resumeAutoSlide);
        });
      }
    });
  },
  beforeUnmount() {
    clearInterval(this.autoSlideInterval);  // 자동 슬라이드 정지
    const carousel = this.$refs.carousel;
    if (carousel) {
      const cards = carousel.querySelectorAll('.card');
      const buttons = carousel.querySelectorAll('.slide-button');
      [...cards, ...buttons].forEach(el => {
        el.removeEventListener('mouseenter', this.stopAutoSlide);
        el.removeEventListener('mouseleave', this.resumeAutoSlide);
      });
    }
  },
  methods: {
    focusSearchInput() {
      this.$refs.searchInput.focus(); // 검색창 클릭 시 input에 포커스
    },
    handleLogout() {
      // 필요시 localStorage.clear() 또는 토큰 삭제 등 추가 가능
      this.$router.push('/mainpage'); // Mainpage.vue로 이동
    },
    getRandomMeals(count) {
      const shuffled = this.meals.slice().sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);  // 슬라이드 멈추기
      this.autoSlideInterval = null;
    },
    startAutoSlide() {
      if (!this.autoSlideInterval) {
        this.autoSlideInterval = setInterval(() => {
          this.scrollRight();  // 3초마다 오른쪽으로 슬라이드
        }, 3000);
      }
    },
    resumeAutoSlide() {
      if (!this.autoSlideInterval) {
        this.startAutoSlide();  // 자동 슬라이드를 재개
      }
    },
    scrollLeft() {
      const carousel = this.$refs.carousel;
      const cardWidth = 250;
      if (carousel.scrollLeft <= 0) {
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    },
    scrollRight() {
      const carousel = this.$refs.carousel;
      const cardWidth = 250;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - 10) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    },
  },
};
</script>



<style scoped>
/* TTF 폰트 적용 */
@font-face {
  font-family: "Esamanru-Bold";
  src: url("@/assets/font/esamanru Bold.ttf") format("truetype");
  font-weight: bold;
}

@font-face {
  font-family: "Esamanru-Light";
  src: url("@/assets/font/esamanru Light.ttf") format("truetype");
  font-weight: 300;
}

@font-face {
  font-family: "Esamanru-Medium";
  src: url("@/assets/font/esamanru Medium.ttf") format("truetype");
  font-weight: 500;
}

.div-wrapper {
  width: 100%;
  min-width: 1200px;
  max-width: 1440px;
  margin: 0 auto;
  height: 100vh;
  position: relative;
  background-color: #ffffff;
}

.div {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #ffffff;
}

/* 이미지 로고 */
.image {
  position: absolute;
  width: 400px;
  height: 400px;
  top: 220px;
  left: 1000px;
  object-fit: cover;
}

/* 로그인 버튼 고정 위치 */
.text-wrapper {
  position: absolute;
  top: 25px;
  left: 1320px;
  font-size: 25px;
  font-family: "Esamanru-Light", sans-serif;
  font-weight: 300;
  white-space: nowrap;
  overflow: visible;
}

.login-link {
  text-decoration: none;
  color: inherit;
}

/* 검색창 고정 */
.view {
  position: absolute;
  width: 500px;
  height: 50px;
  top: 15px;
  left: 750px;
}

.overlap-group {
  position: relative;
  width: 500px;
  height: 45px;
  background-color: #ffffff80;
  border-radius: 20px;
  border: 3px solid #000000;
}

.img {
  position: absolute;
  width: 20px;
  height: 25px;
  top: 7px;
  left: 11px;
}

.search-input {
  width: 100%;
  height: 41px;
  padding-left: 40px;
  font-family: "Esamanru-Light", sans-serif;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: transparent;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input:focus {
  border-bottom: none;
}

/* 네비게이션 바 고정 */
.navbar {
  position: absolute;
  top: 25px;
  left: 150px;
  display: flex;
  gap: 50px;
  font-family: "Esamanru-Light", sans-serif;
  font-weight: 300;
  font-size: 30px;
}

.navbar > div {
  cursor: pointer;
}

/* 네비게이션 각 항목 위치 보정 */
.text-wrapper-3,
.text-wrapper-4,
.text-wrapper-5 {
  position: static;
  font-family: "Esamanru-Light", sans-serif;
  font-weight: 300;
  font-size: 25px;
}

.text-wrapper-3 { left: 0; }
.text-wrapper-4 { left: 176px; }
.text-wrapper-5 { left: 352px; }

.p {
  position: absolute;
  top: 150px;
  left: 30px;
  font-family: "Esamanru-Bold", sans-serif;
  font-weight: 700;
  font-size: 35px;
}

/* 로그아웃 버튼 스타일 */
.logout-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.logout-button:hover {
  text-decoration: underline;
}

.logout-wrapper {
  position: absolute;
  margin-top: 25px;
  margin-left: 1430px;
}

.logout-icon {
  width: 25px;
  height: 25px;
}

.today-meal-section {
  position: absolute;
  top: 600px;
  left: 50px;
  width: 1400px;  /* 기존 900px에서 더 넓게 변경 */
  padding-bottom: 50px;
}

.section-title {
  font-family: "Esamanru-Light", sans-serif;
  font-size: 26px;
  font-weight: 550;
  margin-bottom: 12px;
  margin-left: 50px;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 10px 0px;
  scroll-behavior: smooth;
  width: 100%; 

  /* 슬라이드바 제거 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.card {
  min-width: 200px;  /* 기존 230px에서 조금 줄여서 더 많은 카드가 보이도록 */
  height: 280px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(60, 60, 60, 0.3);
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid #3b3b3b;
  border-radius: 10px;
}

.card:hover {
  transform: scale(1.07);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  border-color: #26FF00; 
}

.card:first-child {
  margin-left: 20px;
}

.card-image {
  width: 196px;
  height: 150px;
  object-fit: cover;
  border-radius: 15px;
}

.card-content {
  margin-top: 10px;
  text-align: center;
}

.meal-title {
  font-family: "Esamanru-Light", sans-serif;
  font-size: 18px;
  margin-bottom: 5px;
}

.meal-desc {
  font-family: "Esamanru-Light", sans-serif;
  font-size: 14px;
  margin-top: 30px;
}

.slide-button {
  background-color: #9bfd96;
  border: none;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  width: 50px;
  height: 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.slide-button:hover {
  transform: scale(1.15);
  background-color: #26FF00;
}

.slide-button.left {
  margin-right: 10px;
}

.slide-button.right {
  margin-left: 10px;
  border: none;
}

.recommend_icon {
  width: 35px;     /* 원하는 너비 */
  height: 35px;    /* 원하는 높이 */
  vertical-align: middle; /* 텍스트와 수직 정렬 */
}

/* Progress Bar 스타일 */
.progress-bar-wrapper {
  position: absolute;
  top: 300px;  /* 원하는 위치로 올리기 위해 top 값 조정 */
  left: 150px;    /* 왼쪽 정렬 */
  right: 0;   /* 오른쪽 정렬 */
  z-index: 10; /* 다른 요소보다 앞에 오도록 설정 (필요에 따라 조정) */
  width: 700px;
}

.progress-bar-title {
  font-family: "Esamanru-Light", sans-serif;
  font-size: 24px;
  margin-bottom: 10px;
}

.progress-bar-background {
  width: 100%;
  height: 20px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #26FF00;
  transition: width 0.5s ease;
}

.progress-bar-info {
  display: flex;
  justify-content: space-between;
  font-family: "Esamanru-Light", sans-serif;
  font-size: 16px;
  margin-top: 5px;
}
</style>
