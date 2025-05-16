<template>
  <div class="main-wrapper"> <!-- 루트 div로 모든 내용을 감쌈 -->
    <div class="div-wrapper">
      <!-- 메인 페이지 로고 -->
      <img class="image" :src="mainLogo" alt="메인 로고" />    
      
      <!-- 로그인 링크 -->
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

      <!-- 네비게이션 바 -->
      <div class="navbar">
        <div class="text-wrapper-3" translate="no">식단 추천</div>
        <div class="text-wrapper-4" translate="no" >식단 일기</div>
        <div class="text-wrapper-5" translate="no" >영양 진단기</div>
      </div>
    </div>

    <!-- 식단 리스트 -->
    <div class="diet-list-container">
      <!-- 정렬 버튼을 맨 위에 둠 -->
      <div class="sort-menu-wrapper">
        <button class="sort-button" @click="toggleSortMenu">
          ▼ {{ sortLabel }} 
        </button>
        <div v-if="isSortMenuOpen" class="sort-options">
          <div class="sort-option" @click="selectSort('최신순')">최신순</div>
          <div class="sort-option" @click="selectSort('인기순')">인기순</div>
          <div class="sort-option" @click="selectSort('조회순')">조회순</div>
        </div>
      </div>

      <!-- 식단 카드들 -->
      <div
        v-for="(diet, index) in diets"
        :key="index"
        class="diet-card"
        @click="goToDietDetail_after_login(diet)"
      >
        <img :src="diet.image" alt="식단 이미지" class="diet-image" />
        <h3 class="diet-name">{{ diet.name }}</h3>
        <button class="add-button" @click.stop="addDiet(diet)">식단 추가</button>
      </div>
    </div>

    <!-- 모달 창 -->
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">×</button>
        <div class="modal-title">알림</div>
        <div class="modal-body">오늘의 식단 일기에 추가되었습니다.</div>
        <button class="modal-confirm" @click="closeModal">확인</button>
      </div>
    </div>
  </div>
</template>


<script>
  import searchIcon from '@/assets/검색 아이콘.png';
  import logoutIcon from "@/assets/logout-icon.png";
  import mainLogo from '@/assets/메인페이지 로고1.png';

  export default {
    name: "Recommendpage_after_login",
    data() {
      return {
        isSortMenuOpen: false,
        isModalVisible: false,
        selectedSort: '',
      currentSort: 'latest',
        searchIcon,
        logoutIcon,
        mainLogo,
        diets: [
        { name: '닭가슴살 샐러드', image: 'https://via.placeholder.com/150' },
        { name: '현미밥과 고등어구이', image: 'https://via.placeholder.com/150' },
        { name: '두부 스테이크', image: 'https://via.placeholder.com/150' },
        { name: '불고기 덮밥', image: 'https://via.placeholder.com/150' },
        { name: '계란말이 도시락', image: 'https://via.placeholder.com/150' },
        { name: '참치김밥', image: 'https://via.placeholder.com/150' },
      ]
      }
    },
    computed: {
      sortLabel() {
        return this.selectedSort || '정렬 기준';
      },
    },
    methods: {
      showAddDietModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
      focusSearchInput() {
        this.$refs.searchInput.focus();
      },
      handleLogout() {
      // 필요시 localStorage.clear() 또는 토큰 삭제 등 추가 가능
      this.$router.push('/mainpage'); // Mainpage.vue로 이동
      },
      addDiet(diet) {
        this.showAddDietModal();
    },
    toggleSortMenu() {
        this.isSortMenuOpen = !this.isSortMenuOpen;
      },
      selectSort(option) {
        this.selectedSort = option;
        this.isSortMenuOpen = false;
      },
      setSort(type) {
        this.currentSort = type;
        this.isSortMenuOpen = false;
        console.log(`정렬 방식: ${type}`);
        // 실제 정렬 로직은 여기에 추가
      },
      goToDietDetail_after_login(diet) {
        // diet 객체를 query params로 전달 (선택적으로 diet.id나 diet.name을 사용할 수 있음)
        this.$router.push({ name: 'Recommenddetailpage_after_login', query: { id: diet.name } });
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
    left: 1320px;
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
    left: 750px;
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
  left: -20px;
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
    left: 158.5px;
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

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  .diet-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: space-between;
  position:relative;
  padding-top: 55px;
  padding-bottom:50px;
  /* 고정된 너비와 높이 설정 */
  width: 1200px; /* 원하는 고정된 너비 */
  height: 600px; /* 원하는 고정된 높이 */
  left:150px;
}

.diet-card {
  width: calc(33.333% - 20px);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.diet-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.diet-name {
  margin: 12px 0;
  font-size: 1.1em;
  font-weight: bold;
}

.add-button {
  padding: 8px 16px;
  background-color: #26FF00;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #26FF00;
}

.sort-menu-wrapper {
  position: absolute;
  top: 10px;
  right: 30px;
  z-index: 10;
}

.sort-button {
  background-color: #ffffff;
  border: 2px solid #000;
  padding: 8px 16px;
  font-size: 16px;
  font-family: "Esamanru-Light";
  cursor: pointer;
  border-radius: 10px;
}

.sort-options {
  position: absolute;
  right: 0;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  margin-top: 5px;
  width: 116.8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sort-option {
  padding: 10px;
  cursor: pointer;
  font-family: "Esamanru-Light";
  font-size: 16px;
  text-align: center; /* 글자를 가운데 정렬 */
}

.sort-option:hover {
  background-color: #f0f0f0;
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
</style>
