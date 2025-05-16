<template>
  <div v-if="showIntro" class="screen" :class="{ 'fade-out': fadeOut }">
    <div class="image-wrapper">
      <img class="image" :src="introLogo" alt="인트로 로고" />
    </div>
  </div>
</template>

<script>
import introLogo from "@/assets/메인페이지 로고1.png"; 

export default {
  data() {
    return {
      showIntro: true,
      fadeOut: false,
      introLogo, 
    };
  },
  mounted() {
    setTimeout(() => {
      this.fadeOut = true;
      setTimeout(() => {
        this.showIntro = false;
        this.$router.push("/mainpage");
      }, 1000);
    }, 2000);
  },
};
</script>

<style scoped>
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  transition: opacity 1s ease-in-out;
  opacity: 1;
}

.fade-out {
  opacity: 0;
}

.image-wrapper {
  width: 30vw; 
  max-width: 530px;
  height: auto;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
