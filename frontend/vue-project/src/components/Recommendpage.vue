<template>
  <div class="main-wrapper"> <!-- 모든 내용을 하나의 부모 div로 감쌈 -->
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

    <!-- 식이제한 드롭다운 -->
    <div class="diet-restriction-wrapper">
      <label class="diet-label">식이제한</label>
      <select v-model="selectedRestriction" class="diet-select" @change="openRestrictionModal">
        <option disabled value="">식이제한 선택</option>
        <option value="allergy">알레르기 식이제한</option>
        <option value="health">건강 식이제한</option>
        <option value="religion">종교/윤리 식이제한</option>
        <option value="diet">다이어트 식이제한</option>
      </select>
    </div>

    <!-- 목표 식단 선택 -->
    <div class="goal-diet-restriction-wrapper">
      <label class="diet-label">목표 식단</label>
      <select v-model="selectedGoalDiet" class="diet-select" @change="handleGoalDietChange">
        <option disabled value="">목표 식단 선택</option>
        <option value="bulk">벌크업</option>
        <option value="diet">다이어트</option>
        <option value="maintain">체중 유지</option>
        <option value="health">건강 관리</option>
      </select>
    </div>

    <!-- 목표 식단 선택된 항목들 -->
    <div v-if="selectedGoalItems.length > 0" class="selected-goal-diet-items">
      <div v-for="(item, index) in selectedGoalItems" :key="index" class="goal-diet-item">
        {{ item }}
        <span class="remove-item" @click="removeGoalItem(index)">×</span>
      </div>
    </div>

    <!-- 식이제한 선택된 항목들 (체크박스 클릭 시 추가됨) -->
    <div v-if="selectedItems.length > 0" class="restriction-items-container">
      <div v-for="(item, index) in selectedItems" :key="index" class="restriction-item">
        {{ item }}
        <span class="remove-item" @click="removeItem(index)">×</span>
      </div>
    </div>

    <!-- 식이제한 체크박스 모달 -->
    <div v-if="isRestrictionModalOpen" class="modal-overlay" @click.self="closeRestrictionModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeRestrictionModal">×</button>
        <h2 class="modal-title">식이제한 선택</h2>

        <!-- 종교/윤리 식이제한은 하나만 선택 가능하게 체크박스에 처리 -->
        <div v-if="selectedRestriction === 'religion'" class="checkbox-group">
          <label v-for="item in restrictionOptions.religion" :key="item" class="checkbox-item">
            <input
              type="checkbox"
              :value="item"
              :checked="selectedReligionRestriction === item"
              @change="handleReligionCheckboxChange(item)"
            />
            {{ item }}
          </label>
        </div>

        <!-- 알레르기/건강/다이어트 식이제한 선택 (체크박스) -->
        <div v-else class="checkbox-group">
          <label v-for="item in currentRestrictionItems" :key="item" class="checkbox-item">
            <input type="checkbox" v-model="selectedItems" :value="item" />
            {{ item }}
          </label>
        </div>

        <button class="modal-confirm" @click="closeRestrictionModal">확인</button>
      </div>
    </div>

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
        @click="goToDietDetail(diet)"
      >
        <img :src="diet.image" alt="식단 이미지" class="diet-image" />
        <h3 class="diet-name">{{ diet.name }}</h3>
        <button class="add-button" @click.stop="showLoginRequiredModal">식단 추가</button>
      </div>
    </div>
  </div>
</template>


  
<script>
  import searchIcon from '@/assets/검색 아이콘.png';
  import mainLogo from '@/assets/메인페이지 로고1.png';


  export default {
    name: "Recommendpage",
    data() {
      return {
        isSortMenuOpen: false,
        selectedSort: '',
      currentSort: 'latest',
        isModalOpen: false,
        isRestrictionModalOpen: false,
        selectedGoalDiet: '',
        selectedGoalItems: [],
        goalDietOptions: {
          bulk: '벌크업',
          diet: '다이어트',
          maintain: '체중 유지',
          health: '건강 관리'
        },
        searchIcon,
        mainLogo,
        selectedRestriction: '',
        selectedItems: [],
        selectedReligionRestriction: '',  // 종교/윤리 식이제한 선택을 위한 변수
        restrictionOptions: {
          allergy: [
            '견과류', '계란', '우유', '대두류', '밀', '생선류',
            '조개류', '딸기', '감귤류', '고기류', '토마토',
            '샐러리', '살균제 및 방부제'
          ],
          health: [
            '저염식', '저당식', '저지방식', '소화불량',
            '고단백식', '콜레스테롤 제한식', '과민성 대장 증후군'
          ],
          religion: [
            '채식주의', '비건(Vegan)', '할랄식(Halal)', '코셔식(Kosher)'
          ],
          diet: [
            '저탄수화물식', '저칼로리식', '키토제닉(Keto diet)', '간헐적 단식'
          ]
        },

        diets: [
        { name: '닭가슴살 샐러드', image: 'https://via.placeholder.com/150' },
        { name: '현미밥과 고등어구이', image: 'https://via.placeholder.com/150' },
        { name: '두부 스테이크', image: 'https://via.placeholder.com/150' },
        { name: '불고기 덮밥', image: 'https://via.placeholder.com/150' },
        { name: '계란말이 도시락', image: 'https://via.placeholder.com/150' },
        { name: '참치김밥', image: 'https://via.placeholder.com/150' },
      ],

      };
    },
    computed: {
      sortLabel() {
        return this.selectedSort || '정렬 기준';
      },

      currentRestrictionItems() {
        return this.restrictionOptions[this.selectedRestriction] || [];
      },
      // 종교/윤리 식이제한 항목은 라디오 버튼을 사용하여 하나만 선택하도록
      religionRestrictionItems() {
        return this.restrictionOptions.religion;
      }
    },
    methods: {
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

      // 목표 식단 항목 추가
      handleGoalDietChange() {
        if (this.selectedGoalDiet) {
          // 이미 값이 있으면 기존 값을 삭제하고 새 값 추가
          this.selectedGoalItems = [this.goalDietOptions[this.selectedGoalDiet]];
        }
      },
      
      handleReligionCheckboxChange(item) {
        if (this.selectedReligionRestriction === item) {
          // 이미 선택된 항목을 다시 클릭한 경우: 해제
          this.selectedReligionRestriction = '';
          const index = this.selectedItems.indexOf(item);
          if (index !== -1) {
            this.selectedItems.splice(index, 1);
          }
        } else {
          // 새 항목 선택: 이전 선택 해제 후 새로운 것 추가
          if (this.selectedReligionRestriction) {
            const prevIndex = this.selectedItems.indexOf(this.selectedReligionRestriction);
            if (prevIndex !== -1) {
              this.selectedItems.splice(prevIndex, 1);
            }
          }
          this.selectedReligionRestriction = item;
          if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
          }
        }
      },


      // 목표 식단 항목 삭제
      removeGoalItem(index) {
        this.selectedGoalItems.splice(index, 1);
      },
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
      openRestrictionModal() {
        if (this.selectedRestriction) {
          this.isRestrictionModalOpen = true;
        }
      },
      closeRestrictionModal() {
        this.isRestrictionModalOpen = false;
      },
      removeItem(index) {
        this.selectedItems.splice(index, 1);
      },
      goToDietDetail(diet) {
        // diet 객체를 query params로 전달 (선택적으로 diet.id나 diet.name을 사용할 수 있음)
        this.$router.push({ name: 'Recommenddetailpage', query: { id: diet.name, image: diet.image } });
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
      left: 158px;
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

    .diet-restriction-wrapper {
      position: absolute;
      top: 125px; /* 필요 시 조정 */
      left: 300px;
      font-family: "Esamanru-Light", sans-serif;
      font-size: 18px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }

      .diet-label {
        font-weight: bold;
        white-space: nowrap;
        }

      .diet-select {
        width: 250px;
        padding: 8px;
        font-size: 16px;
        border: 2px solid #000;
        border-radius: 10px;
        background-color: #fff;
        }

        .checkbox-group {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        max-width: 600px;
        }

        .checkbox-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 16px;
        }

        .selected-restriction-items {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
            position: absolute;
            top: 160px;
            left: 290px;
            width: 400px;
            }

            .restriction-item {
              background-color: #f0f0f0;
              padding: 8px 16px;
              border-radius: 20px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              max-width: 200px; /* 최대 너비 설정 */
            }
            
            .restriction-items-container {
              position: relative;
              margin-top: 20px;
              display: flex;
              flex-wrap: wrap; /* 줄바꿈 설정 */
              gap: 10px; /* 아이템 간격 설정 */
              width:450px;
              top:-50px;
              left:290px;
            }

            .remove-item {
            cursor: pointer;
            font-weight: bold;
            color: #ff0000;
            }
            .goal-diet-restriction-wrapper {
              position: absolute;
              top: 125px; /* 위치를 적절하게 수정 */
              left: 800px;
              font-family: "Esamanru-Light", sans-serif;
              font-size: 18px;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 10px;
            }

            .selected-goal-diet-items {
              display: flex;
              flex-wrap: wrap;
              margin-top: 10px;
              position: absolute;
              top: 160px;
              left: 790px;
              width: 110px;
            }

 .goal-diet-item {
  transform: translateY(0);
  background-color: #f0f0f0;
            padding: 8px 16px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
}

  .remove-item {
    cursor: pointer;
    font-weight: bold;
    color: #ff0000;
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
  text-align: center;
}

.sort-option:hover {
  background-color: #f0f0f0;
}

</style>
  
