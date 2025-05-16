<template>
  <div class="main-wrapper">
    <div class="div-wrapper">
      <!-- 메인 페이지 로고 -->
      <img class="image" :src="mainLogo" alt="메인 로고" />
      <!-- 로그인 링크 -->
      <div class="text-wrapper">
        <router-link to="/login" class="login-link" translate="no">로그인</router-link>
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

      <!-- 네비게이션 바 -->
      <div class="navbar">
        <div class="text-wrapper-3" translate="no">식단 추천</div>
        <div class="text-wrapper-4" translate="no" @click="showLoginRequiredModal">식단 일기</div>
        <div class="text-wrapper-5" translate="no" @click="showLoginRequiredModal">영양 진단기</div>
      </div>

      <!-- 로그인 필요 모달 -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">×</button>
          <h2 class="modal-title">로그인이 필요합니다</h2>
          <p class="modal-body" translate="no">확인 버튼을 누르면 로그인페이지로 이동합니다.</p>
          <button class="modal-confirm" @click="goToLogin">확인</button>
        </div>
      </div>
    </div>

    <!-- 왼쪽: 식단 사진 -->
    <div class="diet-image">
      <img :src="dietImage" alt="Diet Image" />
    </div>

    <!-- 추천 문구 및 엄지 아이콘 -->
    <div class="recommend-text">
      <img class="thumb-icon" src="@/assets/추천 문구 아이콘.png" alt="엄지모양 아이콘" />
      <p class="recommend-message">이런 분께 추천해요!</p>
    </div>

    <!-- 문구들을 세로로 나열 -->
    <ul class="recommend-list">
      <li v-for="(text, index) in recommendationText" :key="index">· {{ text }}</li>
    </ul>

    <!-- 탄단지 그래프 아이콘과 문구 추가 -->
    <div class="graph-info" @click="showGraphModal">
      <img class="graph-icon" src="@/assets/그래프 아이콘.png" alt="그래프 아이콘" />
      <p class="graph-message">이 식단의 탄단지 그래프</p>
    </div>

    <!-- 오른쪽: 식단 이름, 칼로리 -->
    <div class="diet-info">
      <h1>{{ dietName }}</h1>
      <p class="calories">총 칼로리: {{ totalCalories }} kcal (1인분 기준)</p>
    </div>

    <!-- 식단 상세 정보 표 -->
    <table class="diet-table">
      <thead>
        <tr>
          <th>재료</th>
          <th>양</th>
          <th>칼로리(kcal)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ingredient, index) in ingredients" :key="index">
          <td>{{ ingredient.name }}</td>
          <td>{{ ingredient.amount }}</td>
          <td>{{ ingredient.calories }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 원형 그래프 모달 -->
    <div v-if="isGraphModalOpen" class="graphmodal-overlay" @click.self="closeGraphModal">
      <div class="graphmodal-content">
        <button class="graphmodal-close" @click="closeGraphModal">×</button>
        <h2 class="graphmodal-title">{{ dietName }} 탄단지 그래프</h2>
      </div>
    </div>

    <button class="add-button" @click.stop="showLoginRequiredModal">식단 추가</button>

  </div>
</template>



<script>
  import searchIcon from '@/assets/검색 아이콘.png';
  import mainLogo from '@/assets/메인페이지 로고1.png';
  import dietImage from '@/assets/meal14.jpg'; // 로컬 이미지 파일을 임의로 임포트

  export default {
    name: "Recommenddetailpage",
    data() {
      return {
        searchIcon,
        mainLogo,
        isModalOpen: false,
        isGraphModalOpen: false, // 원형 그래프 모달 상태
        selectedDiet: null,
        dietName: this.$route.query.id,        // 식단 이름
        dietImage: this.$route.query.image,    // 식단 이미지
        totalCalories: '',  // API에서 가져올 총 칼로리
        ingredients: [],    // 재료 목록 (API에서 가져옴)
        dietImage, // 임의 이미지
        recommendationText: [
          "다이어트를 시작한 직장인",
          "고단백 저지방 식사를 찾는 헬스인",
          "저녁을 가볍고 든든하게 먹고 싶은 분"
        ],  // 문구 리스트 (나중에 문구만 지우기)
      }
    },
    methods: {
      focusSearchInput() {
        this.$refs.searchInput.focus();
      },
      showLoginRequiredModal() {
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
      },
      goToLogin() {
        console.log("로그인으로 이동");
        this.isModalOpen = false;
        this.$router.push('/login');
      },
      
      // API에서 식단 세부 정보 가져오기
      fetchDietDetails() {
        const dietId = this.dietName;

        // 예시: 식단 API를 호출하여 식단 정보 가져오기
        fetch(`https://api.example.com/diet/${dietId}`)
          .then((response) => response.json())
          .then((data) => {
            this.totalCalories = data.totalCalories;   // 총 칼로리
            this.ingredients = data.ingredients;       // 재료 목록
          })
          .catch((error) => console.error(error));
      },

      // 추천 문구 가져오기
      fetchRecommendationText() {
        fetch('https://api.example.com/diet/recommendations')
          .then((response) => response.json())
          .then((data) => {
            this.recommendationText = data.recommendations;  // 백엔드에서 받은 문구를 state에 저장
          })
          .catch((error) => console.error('Error fetching recommendations:', error));
      },

      // 원형 그래프 모달 열기
      showGraphModal() {
        this.isGraphModalOpen = true;
      },

      // 원형 그래프 모달 닫기
      closeGraphModal() {
        this.isGraphModalOpen = false;
      },

      // 원형 그래프에서 각 부분의 색상
      getStrokeColor(type) {
        if (type === 'carb') return '#FFB300'; // 탄수화물 색상
        if (type === 'protein') return '#00C853'; // 단백질 색상
        return '#FF3D00'; // 지방 색상
      },

      // 원형 그래프에서 각 부분의 dasharray 값 계산
      getStrokeDashArray(percentage) {
        return `${percentage} 100`; // 원형 그래프의 진행률을 계산
      },
      // 원형 경로를 생성하는 함수
      getPathData(percentage) {
        const radius = 16; // 반지름
        const circumference = 2 * Math.PI * radius; // 원의 둘레
        const offset = (100 - percentage) / 100 * circumference; // 비율에 맞게 원을 자르기 위한 오프셋

        return `M18 2
                A16 16 0 1 1 18 34
                A16 16 0 0 1 18 2
                L18 2`;
      }
    },
    created() {
      console.log(this.dietName, this.dietImage);
      this.fetchDietDetails();
    },
    mounted() {
      this.fetchRecommendationText();  // 컴포넌트가 마운트되면 API 호출
    },
     computed: {
    carbPercentage() {
      return this.carb / (this.carb + this.protein + this.fat) * 100;
    },
    proteinPercentage() {
      return this.protein / (this.carb + this.protein + this.fat) * 100;
    },
    fatPercentage() {
      return this.fat / (this.carb + this.protein + this.fat) * 100;
    }
  }
  };
</script>


  
  <style scoped>
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
    
    .main-wrapper{
      height: 720px;
    }

    .div-wrapper {
      width: 100%;
      min-width: 1200px;
      max-width: 1440px;
      margin: 0 auto;
      height: 200px;
      position: relative;
      background-color: #ffffff;
    }
  
    .text-wrapper {
      position: absolute;
      top: 21px;
      left: 1312px;
      font-size: 30px;
      font-family: "Esamanru-Light", sans-serif;
      font-weight: 300;
      white-space: nowrap;
    }
  
    .login-link {
      text-decoration: none;
      color: inherit;
      font-size: 25px;
    }
  
    .view {
      position: absolute;
      width: 500px;
      height: 50px;
      top: 15px;
      left: 742px;
    }
  
    .overlap-group {
      position: relative;
      width: 500px;
      height: 45px;
      background-color: #ffffff80;
      border-radius: 20px;
      border: 3px solid #000000;
    }
    
    .image {
    position: absolute;
    width: 147px;
    height: 147px;
    top: 10px;
    left: -28px;
    object-fit: cover;
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
  
    .text-wrapper-3,
    .text-wrapper-4,
    .text-wrapper-5 {
      position: static;
      font-size: 25px;
      top: 25px;
    }
  
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
  
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 20px;
      width: 400px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      position: relative;
      font-family: "Esamanru-Light", sans-serif;
      animation: fadeIn 0.3s ease;
      text-align: center;
    }
  
    .modal-title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  
    .modal-body {
      font-size: 16px;
      white-space: nowrap;
    }
  
    .modal-close {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      border: none;
      background: none;
      cursor: pointer;
    }
  
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  
    .modal-confirm {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #26FF00;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    }
  
    .modal-confirm:hover {
      background-color: #26FF00;
    }

    .diet-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .diet-image {
      position: relative;
      width: 300px;  /* 부모 요소에 맞춰 크기 조정 */
      height: 250px;  /* 비율 유지 */
      left:250px;
      top:-20px;
    }

    .diet-image img {
      width: 300px; /* 적당한 크기로 설정 */
      height: 250px;
      border-radius: 8px;
      
      top:159px;
      left:100px;
    }

    .diet-info {
    position:absolute;
    align-items: center;
    gap: 20px; /* h1과 calories 사이 간격 조절 */
    top:220px;
    left: 600px;
  }

  .diet-info h1 {
    font-size: 24px;
    margin: 0; /* 기본 여백 제거 */
  }

  .diet-info .calories {
    font-size: 16px;
    color: #888;
    white-space: nowrap; /* 줄바꿈 방지 */
  }

    .diet-table {
      position: relative;
      left: 600px; /* 오른쪽으로 200px 이동 */
      top: -270px;
      /* 기존 스타일도 유지 */
      width: 800px;
      border-collapse: collapse;
      margin-top: 20px;
      
    }

    .diet-table th, .diet-table td {
      padding: 10px;
      text-align: center;
      border: 1px solid #ddd;
    }

    .diet-table th {
      background-color: #f4f4f4;
      position: sticky;   /* 헤더 고정 */
      top: 0;             /* 상단 고정 */
      z-index: 1;         /* 다른 테이블 내용 위로 배치 */
    }

    /* tbody의 각 행에 고정 너비 적용 */
    .diet-table tr {
      display: table;
      table-layout: fixed;
      width: 100%;
    }

    /* tbody에 스크롤 추가 */
    .diet-table tbody {
      display: block;
      height: 300px; /* 원하는 높이 설정 */
      overflow-y: auto; /* 세로 스크롤 */
    }
    
    .diet-table th:first-child {
      width: 400px; /* '재료' 열 너비를 더 넓게 설정 */
    }

    .diet-table th:last-child {
      width: 200px; /* '칼로리' 열 너비를 더 좁게 설정 */
    }

    .recommend-text {
      display: flex;  /* 수평 배치 */
      align-items: center;  /* 세로 정렬 */
      justify-content: center;  /* 가운데 정렬 */
      margin-top: 20px;
      width: 200px;
      position: relative;  /* 상대 위치 설정 */
      top: -20px;  
      left: 250px;  
    }

    .thumb-icon {
      width: 40px;  /* 아이콘 크기 */
      height: 40px;
      margin-right: 10px;  /* 아이콘과 문구 사이의 간격 */
    }

    .recommend-message {
      font-size: 18px;
      font-family: "Esamanru-Light";
      margin-top: 0;  /* 세로 여백 없애기 */
    }

    .recommend-list {
      list-style: none;
      padding-left: 0;
      margin-top: 10px;
      font-family: "Esamanru-Light";
      position:absolute;
      width: 500px;
      left:250px;
      top:495px;
    }

    .recommend-list li {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .graph-info {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer; /* 클릭 가능하도록 */
      position: absolute;
      top: 650px;
      left: 250px;
    }

    .graph-icon {
      width: 40px;
      height: 40px;
      margin-right: 10px; /* 아이콘과 문구 간격 */
    }

    .graph-message {
      font-size: 18px;
      font-family: "Esamanru-Light";
    }

    .graphmodal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
  
    .graphmodal-content {
      background: white;
      padding: 30px;
      border-radius: 20px;
      width: 800px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      position: relative;
      font-family: "Esamanru-Light", sans-serif;
      animation: fadeIn 0.3s ease;
      text-align: center;
    }
  
    .graphmodal-title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  
    .graphmodal-body {
      font-size: 16px;
      white-space: nowrap;
    }
  
    .graphmodal-close {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      border: none;
      background: none;
      cursor: pointer;
    }

    .add-button {
      padding: 8px 16px;
      background-color: #26FF00;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      position: absolute;
      top: 680px;
      right:130px;
    }

    .add-button:hover {
      background-color: #26FF00;
    }

</style>
