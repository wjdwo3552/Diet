<template>
    <div class="my-profile-container">
      <div class="profile-header">
        <h1>내 정보</h1>
        <p class="subtitle">개인정보와 식단 목표를 관리하세요</p>
      </div>
  
      <div class="profile-card">
        <!-- 프로필 섹션 -->
        <div class="profile-section">
          <h2>프로필 정보</h2>
          
          <!-- 닉네임 -->
          <div class="form-group">
            <label for="nickname">닉네임</label>
            <div class="input-with-button">
              <input 
                type="text" 
                id="nickname" 
                v-model="userProfile.nickname" 
                :disabled="isLoading"
              >
              <button 
                @click="updateNickname" 
                :disabled="isLoading || !isNicknameChanged" 
                class="btn btn-primary"
              >
                수정
              </button>
            </div>
          </div>
          
          <!-- 이메일 주소 -->
          <div class="form-group">
            <label for="email">이메일 주소</label>
            <input 
              type="email" 
              id="email" 
              v-model="userProfile.email" 
              disabled
            >
            <span class="info-text">이메일은 수정할 수 없습니다</span>
          </div>

          <!-- 나이/성별 -->
          <div class="form-row">
            <div class="form-group half">
              <label for="age">나이</label>
              <input 
                type="number" 
                id="age" 
                v-model="userProfile.age" 
                :disabled="isLoading"
                min="0"
              >
            </div>
            <div class="form-group half">
              <label for="gender">성별</label>
              <select 
                id="gender" 
                v-model="userProfile.gender" 
                :disabled="isLoading"
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label for="height">키 (cm)</label>
              <input 
                type="number" 
                id="height" 
                v-model="userProfile.height" 
                :disabled="isLoading"
                min="0"
              >
            </div>
            <div class="form-group half">
              <label for="weight">몸무게 (kg)</label>
              <input 
                type="number" 
                id="weight" 
                v-model="userProfile.weight" 
                :disabled="isLoading"
                min="0"
              >
            </div>
          </div>

          <div class="password-change-new">
            <h3>비밀번호 변경</h3>
            <div class="password-inputs">
              <div class="form-group">
                <input 
                  type="password" 
                  v-model="passwordForm.currentPassword" 
                  placeholder="현재 비밀번호"
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <input 
                  type="password" 
                  v-model="passwordForm.newPassword" 
                  placeholder="새 비밀번호"
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <input 
                  type="password" 
                  v-model="passwordForm.confirmPassword" 
                  placeholder="새 비밀번호 확인"
                  :disabled="isLoading"
                >
              </div>
            </div>
            <button 
              @click="updatePassword" 
              class="btn btn-secondary"
              :disabled="isLoading || !isPasswordFormValid"
            >
              비밀번호 변경
            </button>
          </div>

          <!-- 나의 식단 프리셋 (비밀번호 변경 바로 아래) -->
          <div class="meal-preset-box">
            <h3 class="meal-preset-title">나의 식단 프리셋</h3>
            <div class="meal-preset-card">
              <div v-for="(preset, idx) in mealPresets" :key="idx" v-show="selectedPresetIdx === idx">
                <div class="meal-preset-tab selected">내 식단 {{ idx + 1 }}</div>
                <div class="meal-preset-desc" v-if="preset.desc">{{ preset.desc }}</div>
                <div v-else class="meal-preset-desc empty">식단 프리셋을 추가 해주세요.</div>
              </div>
              <div class="meal-preset-add-row">
                <input type="text" v-model="newPresetDesc" placeholder="식단 검색..." class="meal-preset-input" />
                <button class="meal-preset-add-btn" @click="addPreset">추가</button>
              </div>
              <div class="meal-preset-tabs">
                <button v-for="(preset, idx) in mealPresets" :key="'tab-' + idx" :class="['meal-preset-tab', selectedPresetIdx === idx ? 'selected' : '']" @click="selectPreset(idx)">
                  내 식단 {{ idx + 1 }}
                </button>
                <button class="meal-preset-create-btn" @click="createPreset" :disabled="mealPresets.length >= 4">프리셋 생성</button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 목표 및 설정 섹션 -->
        <div class="profile-section">
          <h2>식단 목표 및 설정</h2>
          
          <!-- 사용자 목표 -->
          <div class="form-group">
            <label for="goal">나의 목표</label>
            <select 
              id="goal" 
              v-model="userProfile.goal" 
              :disabled="isLoading"
            >
              <option value="weight-loss">체중 감량</option>
              <option value="muscle-gain">근육 증량</option>
              <option value="maintenance">체중 유지</option>
              <option value="health">건강한 식습관</option>
            </select>
          </div>
          

          
          <!-- 나의 식습관 -->
          <div class="form-group">
            <label class="diet-habit-title">건강 식이제한</label>
            <div class="checkbox-group">
              <div v-for="(diet, index) in dietOptions.health" :key="'health-' + index" class="checkbox-item">
                <input type="checkbox" :id="'health-' + index" :value="diet.value" v-model="userProfile.preferredDiets">
                <label :for="'health-' + index">{{ diet.label }}</label>
              </div>
            </div>
            <div class="diet-habit-title">종교/윤리 식이제한</div>
            <div class="checkbox-group">
              <div v-for="(diet, index) in dietOptions.religion" :key="'religion-' + index" class="checkbox-item">
                <input type="checkbox" :id="'religion-' + index" :value="diet.value" v-model="userProfile.preferredDiets">
                <label :for="'religion-' + index">{{ diet.label }}</label>
              </div>
            </div>
            <div class="diet-habit-title">다이어트 식이 제한</div>
            <div class="checkbox-group">
              <div v-for="(diet, index) in dietOptions.diet" :key="'diet-' + index" class="checkbox-item">
                <input type="checkbox" :id="'diet-' + index" :value="diet.value" v-model="userProfile.preferredDiets">
                <label :for="'diet-' + index">{{ diet.label }}</label>
              </div>
            </div>
          </div>
          
          <!-- 알레르기 음식 -->
          <div class="form-group">
            <label for="allergies">알레르기 음식</label>
            <div class="tags-input">
              <div class="tags-list">
                <span v-for="(allergy, index) in userProfile.allergies" :key="index" class="tag">
                  {{ allergy }}
                  <button 
                    @click="removeAllergy(index)" 
                    class="tag-remove" 
                    :disabled="isLoading"
                  >×</button>
                </span>
              </div>
              <div class="tag-input-container">
                <input 
                  type="text" 
                  v-model="newAllergy" 
                  placeholder="알레르기 음식 추가..." 
                  @keyup.enter="addAllergy"
                  :disabled="isLoading"
                >
                <button 
                  @click="addAllergy" 
                  class="btn btn-small" 
                  :disabled="isLoading || !newAllergy"
                >추가</button>
              </div>
            </div>
          </div>
          
          <!-- 원하는 칼로리 -->
          <div class="form-group">
            <label for="calories">목표 일일 칼로리 (kcal)</label>
            <input 
              type="number" 
              id="calories" 
              v-model="userProfile.targetCalories" 
              :disabled="isLoading"
              min="0"
            >
            <div class="calories-recommendation">
              <p>귀하의 체중/키/목표에 따른 권장 칼로리: <strong>{{ recommendedCalories }} kcal</strong></p>
            </div>
          </div>

          <!-- 목표 몸무게 -->
          <div class="form-group" v-if="showTargetWeight">
            <label for="targetWeight">목표 몸무게 (kg)</label>
            <input 
              type="number" 
              id="targetWeight" 
              v-model="userProfile.targetWeight" 
              :disabled="isLoading"
              min="0"
            >
            <div class="weight-difference" v-if="userProfile.targetWeight">
              <p v-if="weightDifference === 0">목표 몸무게 달성중!</p>
              <p v-else-if="weightDifference > 0">현재 몸무게 대비 <strong>{{ weightDifference }}kg</strong> 감량 필요</p>
              <p v-else>현재 몸무게 대비 <strong>{{ Math.abs(weightDifference) }}kg</strong> 증가 필요</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 저장 버튼 -->
      <div class="save-section">
        <button 
          @click="saveProfile" 
          class="btn btn-large btn-primary" 
          :disabled="isLoading"
        >
          <span v-if="isLoading">저장 중...</span>
          <span v-else>변경사항 저장</span>
        </button>
        <div v-if="saveMessage" :class="['save-message', saveMessageType]">
          {{ saveMessage }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'MyProfile',
    data() {
      return {
        passwordForm: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        originalNickname: '',
        isLoading: false,
        saveMessage: '',
        saveMessageType: 'success',
        newAllergy: '',
        dietOptions: {
          health: [
            { label: '저염식', value: '저염식' },
            { label: '저당식', value: '저당식' },
            { label: '저지방식', value: '저지방식' },
            { label: '과민성 대장 증후군', value: '과민성 대장 증후군' },
            { label: '고단백식', value: '고단백식' },
            { label: '콜레스테롤 제한식', value: '콜레스테롤 제한식' },
            { label: '소화불량', value: '소화불량' }
          ],
          religion: [
            { label: '채식주의', value: '채식주의' },
            { label: '비건', value: '비건' },
            { label: '할랄식', value: '할랄식' },
            { label: '코셔식', value: '코셔식' }
          ],
          diet: [
            { label: '저탄수화물식', value: '저탄수화물식' },
            { label: '저칼로리식', value: '저칼로리식' },
            { label: '키토제닉', value: '키토제닉' },
            { label: '간헐적단식', value: '간헐적단식' }
          ]
        },
        mealPresets: [
          { desc: '' },
          { desc: '' }
        ],
        selectedPresetIdx: 0,
        newPresetDesc: '',
        isPasswordFormVisible: false
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
          return {
            nickname: '',
            email: '',
            height: 0,
            weight: 0,
            age: 0,
            gender: '',
            goal: '',
            preferredSports: [],
            preferredDiets: [],
            allergies: [],
            targetCalories: 0,
            targetWeight: 0,
            mealPresets: []
          }
        }
        return this.$store.state.user.profile
      },
      isNicknameChanged() {
        return this.userProfile.nickname !== this.originalNickname;
      },
      isPasswordFormValid() {
        return (
          this.passwordForm.currentPassword &&
          this.passwordForm.newPassword &&
          this.passwordForm.confirmPassword &&
          this.passwordForm.newPassword === this.passwordForm.confirmPassword &&
          this.passwordForm.newPassword.length >= 8
        );
      },
      recommendedCalories() {
        // 기본적인 칼로리 계산 (BMR + 활동량)
        let bmr = 0;
        if (this.userProfile.height && this.userProfile.weight && this.userProfile.age) {
          // 해리스-베네딕트 공식
          if (this.userProfile.gender === 'male') {
            bmr = 10 * this.userProfile.weight + 6.25 * this.userProfile.height - 5 * this.userProfile.age + 5;
          } else {
            bmr = 10 * this.userProfile.weight + 6.25 * this.userProfile.height - 5 * this.userProfile.age - 161;
          }
          
          switch (this.userProfile.goal) {
            case 'weight-loss':
              bmr = Math.round(bmr * 0.85); // 감량 목표라면 15% 감소
              break;
            case 'muscle-gain':
              bmr = Math.round(bmr * 1.15); // 증량 목표라면 15% 증가
              break;
            default:
              bmr = Math.round(bmr); // 유지는 그대로
          }
        }
        return bmr;
      },
      showTargetWeight() {
        return ['weight-loss', 'maintenance'].includes(this.userProfile.goal);
      },
      weightDifference() {
        if (!this.userProfile.targetWeight) return 0;
        return Math.round((this.userProfile.weight - this.userProfile.targetWeight) * 10) / 10;
      }
    },
    created() {
      this.fetchUserProfile();
    },
    methods: {
      ...mapMutations(['updateUserProfile']),
      fetchUserProfile() {
        this.isLoading = true;
        if (this.userProfile && this.userProfile.nickname) {
          this.originalNickname = this.userProfile.nickname;
        }
        this.isLoading = false;
      },
      updateNickname() {
        if (!this.userProfile.nickname.trim()) {
          this.showMessage('닉네임은 비워둘 수 없습니다.', 'error');
          return;
        }
        
        this.isLoading = true;
        this.updateUserProfile({ nickname: this.userProfile.nickname });
        this.originalNickname = this.userProfile.nickname;
        this.isLoading = false;
        this.showMessage('닉네임이 성공적으로 변경되었습니다.', 'success');
      },
      addAllergy() {
        if (!this.newAllergy.trim()) return;
        if (!this.userProfile.allergies.includes(this.newAllergy.trim())) {
          const updatedAllergies = [...this.userProfile.allergies, this.newAllergy.trim()];
          this.updateUserProfile({ allergies: updatedAllergies });
        }
        this.newAllergy = '';
      },
      removeAllergy(index) {
        const updatedAllergies = [...this.userProfile.allergies];
        updatedAllergies.splice(index, 1);
        this.updateUserProfile({ allergies: updatedAllergies });
      },
      saveProfile() {
        if (this.userProfile.height <= 0 || 
            this.userProfile.weight <= 0 || 
            this.userProfile.age <= 0 || 
            this.userProfile.targetCalories <= 0 || 
            (this.userProfile.targetWeight && this.userProfile.targetWeight <= 0)) {
          this.showMessage('모든 수치는 0보다 커야 합니다.', 'error');
          return;
        }

        this.isLoading = true;
        const profileData = {
          ...this.userProfile,
          mealPresets: this.mealPresets
        }
        this.updateUserProfile(profileData);
        setTimeout(() => {
          this.isLoading = false;
          this.showMessage('프로필이 성공적으로 저장되었습니다.', 'success');
        }, 800);
      },
      updatePassword() {
        if (!this.isPasswordFormValid) {
          this.showMessage('비밀번호 형식이 올바르지 않습니다.', 'error');
          return;
        }

        this.isLoading = true;
        setTimeout(() => {
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
          this.isLoading = false;
          this.showMessage('비밀번호가 성공적으로 변경되었습니다.', 'success');
        }, 800);
      },
      togglePasswordForm() {
        this.isPasswordFormVisible = !this.isPasswordFormVisible;
        if (!this.isPasswordFormVisible) {
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        }
      },
      showMessage(message, type = 'success') {
        this.saveMessage = message;
        this.saveMessageType = type;
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      },
      addPreset() {
        const value = this.newPresetDesc.trim();
        if (!value) return;
        const idx = this.selectedPresetIdx;
        if (this.mealPresets[idx].desc) {
          if (!this.mealPresets[idx].desc.trim().endsWith(',')) {
            this.mealPresets[idx].desc += ', ';
          }
          this.mealPresets[idx].desc += value;
        } else {
          this.mealPresets[idx].desc = value;
        }
        this.newPresetDesc = '';
      },
      removePreset(idx) {
        if (this.mealPresets.length <= 1) {
          this.showMessage('최소 1개의 프리셋은 남겨두어야 합니다.', 'error');
          return;
        }
        this.mealPresets.splice(idx, 1);
        if (this.selectedPresetIdx >= this.mealPresets.length) {
          this.selectedPresetIdx = 0;
        }
      },
      selectPreset(idx) {
        this.selectedPresetIdx = idx;
      },
      createPreset() {
        if (this.mealPresets.length >= 4) {
          this.showMessage('프리셋은 최대 4개까지 생성할 수 있습니다.', 'error');
          return;
        }
        this.mealPresets.push({ desc: '' });
        this.selectedPresetIdx = this.mealPresets.length - 1;
      }
    }
  }
  </script>
  
  <style scoped>
  .my-profile-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .profile-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .profile-header h1 {
    font-size: 28px;
    margin-bottom: 5px;
    color: #333;
  }
  
  .subtitle {
    color: #666;
    font-size: 16px;
  }
  
  .profile-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 768px) {
    .profile-card {
      flex-direction: row;
    }
  }
  
  .profile-section {
    flex: 1;
    padding: 25px;
    border-bottom: 1px solid #eee;
  }
  
  @media (min-width: 768px) {
    .profile-section {
      border-bottom: none;
      border-right: 1px solid #eee;
    }
    
    .profile-section:last-child {
      border-right: none;
    }
  }
  @media (prefers-color-scheme: light) {
    button {
        background-color: #74cd64;
    }
  }
  
  .profile-section h2 {
    font-size: 20px;
    margin-bottom: 20px;
    color: #444;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .form-group.half {
    flex: 1;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
    text-align: left;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  
  input:disabled {
    background-color: #f7f7f7;
    cursor: not-allowed;
  }
  
  .input-with-button {
    display: flex;
    gap: 10px;
  }
  
  .input-with-button input {
    flex: 1;
  }
  
  .info-text {
    display: block;
    margin-top: 5px;
    font-size: 13px;
    color: #666;
  }
  
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: #74cd64;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #43a047;
  }
  
  .btn-small {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .btn-large {
    padding: 12px 24px;
    font-size: 16px;
  }
  
  .btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .tags-input {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px;
    background-color: #f8f8f8;
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;
    gap: 8px;
  }
  
  .tag {
    background-color: #4CAF50;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    font-size: 14px;
    transition: background 0.2s;
  }
  .tag:hover {
    background-color: #388e3c;
  }
  
  .tag-remove {
    background: none;
    border: none;
    color: white;
    margin-left: 5px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2px;
  }
  
  .tag-input-container {
    display: flex;
    gap: 8px;
  }
  
  .tag-input-container input {
    flex: 1;
    padding: 8px;
    border: 1.5px solid #ddd;
    border-radius: 6px;
    background: #fff;
    font-size: 16px;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .tag-input-container input:focus {
    outline: none;
    border-color: #74cd64;
    box-shadow: 0 0 0 2px rgba(116, 205, 100, 0.12);
  }
  
  .calories-recommendation {
    margin-top: 10px;
    background-color: #e8f5e9;
    padding: 10px;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .weight-difference {
    margin-top: 10px;
    background-color: #e3f2fd;
    padding: 10px;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .save-section {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .save-message {
    margin-top: 15px;
    padding: 10px 15px;
    border-radius: 6px;
    text-align: center;
  }
  
  .save-message.success {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .save-message.error {
    background-color: #ffebee;
    color: #c62828;
  }
  
  .checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: #f8f8f8;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .checkbox-item input[type="checkbox"] {
    width: auto;
    margin: 0;
  }

  .checkbox-item label {
    margin: 0;
    cursor: pointer;
  }

  .password-change-new {
    margin-top: 20px;
    padding: 10px;
    border-radius: 8px;
    max-width: 600px;
    margin-right: 120px;
  }

  .password-change-new h3 {
    margin-bottom: 15px;
    font-size: 18px;
    color: #333;
    text-align: left;
  }

  .password-inputs {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .password-inputs .form-group {
    margin-bottom: 10px;
  }

  .password-inputs input {
    width: calc(135%);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .btn-secondary {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 80%;
    display: block;
    margin-top: 20px;
    margin-left: 70px;
  }

  .btn-secondary:hover {
    background-color: #0056b3;
  }

  .btn-secondary:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  /* 식단 프리셋 스타일 */
  .meal-preset-box {
    margin-top: 32px;
    margin-bottom: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .meal-preset-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 14px;
    color: #333;
    letter-spacing: -1px;
  }
  .meal-preset-card {
    background: #fff6fa;
    border: 1.5px solid #f7c6d4;
    border-radius: 16px;
    padding: 22px 20px 16px 20px;
    margin-bottom: 12px;
    box-shadow: 0 4px 16px rgba(255, 78, 124, 0.07);
    width: 100%;
    max-width: 420px;
    min-width: 240px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }
  .meal-preset-tab {
    display: inline-block;
    background: #f8a6b6;
    color: #fff;
    font-weight: 600;
    border-radius: 8px;
    padding: 7px 20px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    transition: background 0.2s, color 0.2s;
    min-width: 90px;
    text-align: center;
  }
  .meal-preset-tab.selected {
    background: #ff4e7c;
    color: #fff;
    box-shadow: 0 2px 8px rgba(255, 78, 124, 0.10);
  }
  .meal-preset-create-btn {
    background: #ff4e7c;
    color: #fff;
    font-weight: 600;
    border-radius: 8px;
    padding: 7px 20px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    margin-left: 10px;
    min-width: 110px;
    transition: background 0.2s;
  }
  .meal-preset-create-btn:hover {
    background: #d81b60;
  }
  .meal-preset-desc {
    margin: 22px 0 16px 0;
    color: #444;
    font-size: 16px;
    font-weight: 500;
    white-space: normal;
    background: #fff;
    border-radius: 8px;
    padding: 16px 18px;
    box-shadow: 0 1px 4px rgba(116, 205, 100, 0.04);
    border: 1px solid #f3e6e9;
  }
  .meal-preset-desc.empty {
    color: #bbb;
    font-style: italic;
    background: #f9f9f9;
  }
  .meal-preset-add-row {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    align-items: center;
  }
  .meal-preset-input {
    flex: 1;
    padding: 10px 14px;
    border: 1.5px solid #ddd;
    border-radius: 7px;
    background: #fff;
    font-size: 15px;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .meal-preset-input:focus {
    outline: none;
    border-color: #74cd64;
    box-shadow: 0 0 0 2px rgba(116, 205, 100, 0.10);
  }
  .meal-preset-add-btn {
    background: #74cd64;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 10px 22px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    min-width: 70px;
  }
  .meal-preset-add-btn:hover {
    background: #43a047;
  }
  .meal-preset-tabs {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    overflow-x: visible;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    box-sizing: border-box;
    padding-bottom: 2px;
  }
  .meal-preset-tab, .meal-preset-create-btn {
    min-width: 100px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 18px;
    font-size: 15px;
    border-radius: 8px;
    margin: 0;
    box-sizing: border-box;
  }
  .meal-preset-tab {
    margin-right: 0;
  }
  .meal-preset-create-btn {
    margin-left: 0;
  }
  @media (max-width: 600px) {
    .meal-preset-card {
      padding: 14px 6px 10px 6px;
      min-width: 0;
      max-width: 100%;
      width: 100%;
    }
    .meal-preset-title {
      font-size: 17px;
    }
    .meal-preset-tab, .meal-preset-create-btn {
      font-size: 13px;
      padding: 6px 10px;
      min-width: 60px;
    }
    .meal-preset-add-btn {
      font-size: 13px;
      padding: 8px 10px;
      min-width: 50px;
    }
    .meal-preset-input {
      font-size: 13px;
      padding: 7px 8px;
    }
    .meal-preset-desc {
      font-size: 14px;
      padding: 10px 8px;
    }
  }
  .diet-habit-title {
    font-weight: 600;
    margin-bottom: 6px;
    color: #444;
    text-align: left;
  }
  </style>