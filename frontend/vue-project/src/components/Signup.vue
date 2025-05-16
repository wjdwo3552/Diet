<template>
  <div class="signup-container">
    <div class="signup-box">
      <div class="logo-section">
        <img :src="logoImage" alt="Just Eat It Logo" class="logo" @click="goToMain">
      </div>
      <div class="form-section">
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-group">
            <input type="email" v-model="email" placeholder="이메일" required>
          </div>
          <div class="form-group">
            <input type="password" v-model="password" placeholder="비밀번호" required>
          </div>
          <div class="form-group">
            <input type="password" v-model="passwordConfirm" placeholder="비밀번호 확인" required>
          </div>
          <div class="form-group">
            <input type="text" v-model="nickname" placeholder="닉네임" required>
          </div>
          <div class="form-group gender-group">
            <label class="gender-label">성별</label>
            <div class="gender-options">
              <label class="gender-option">
                <input type="radio" v-model="gender" value="male" required>
                <span>남성</span>
              </label>
              <label class="gender-option">
                <input type="radio" v-model="gender" value="female" required>
                <span>여성</span>
              </label>
            </div>
          </div>
          <button type="submit" class="signup-button">회원가입</button>
          <div class="additional-links">
            <router-link to="/login" class="text-button">로그인 페이지로 이동</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import logoImage from '../assets/logo.png'

export default {
  name: 'Signup',
  data() {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      gender: '',
      logoImage
    }
  },
  methods: {
    handleSignup() {
      console.log('회원가입 시도:', {
        email: this.email,
        nickname: this.nickname,
        gender: this.gender
      })
    },
    goToMain() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
}

.signup-box {
  background-color: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-section {
  flex: 0.4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #eee;
  padding-right: 2rem;
}

.form-section {
  flex: 0.6;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 2rem;
}

.logo {
  width: 300px;
  height: auto;
  display: block;
  object-fit: contain;
  cursor: pointer;
}

.signup-form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  height: 55px;
}

.gender-group {
  margin-top: 0.8rem;
}

.gender-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 0.8rem;
}

.gender-options {
  display: flex;
  gap: 2.5rem;
  justify-content: flex-start;
  padding-left: 0;
}

.gender-option {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.gender-option:last-child {
  margin-left: 2rem;
}

.gender-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.gender-option span {
  font-size: 16px;
  color: #333;
}

.signup-button {
  width: 100%;
  height: 50px;
  background-color: #26FF00;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.signup-button:hover {
  background-color: #1fd800;
}

.additional-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  white-space: nowrap;
}

.text-button {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
  white-space: nowrap;
}

.text-button:hover {
  color: #000;
}

@media (max-width: 768px) {
  .signup-box {
    flex-direction: column;
    gap: 2rem;
    max-width: 400px;
    padding: 2rem;
  }

  .logo-section {
    flex: none;
    justify-content: center;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 2rem;
  }

  .form-section {
    flex: none;
    padding-left: 0;
    justify-content: center;
  }

  .logo {
    width: 240px;
    height: auto;
  }

  .signup-form {
    max-width: 100%;
  }

  .gender-options {
    gap: 1.5rem;
  }
}
</style> 