<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      showHeader: true, // Mặc định hiển thị header
    };
  },
  watch: {
    '$route'(to, from) {
      // Kiểm tra nếu router view là trang Login thì ẩn header
      if (to.name === 'Login' || to.name === 'Register') {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    }
  }
};
</script>

<template>
  <div id="app">
    <AppHeader v-if="showHeader" />
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
#app {
  background-color: #F0EBE3;
}
</style>
