<template>
  <div class="welcome flex flex-col justify-center items-center h-screen bg-gray-100 text-center text-gray-800">
    <h1 class="text-4xl mb-5 text-orange-500">欢迎使用同学管理系统</h1>
    <button @click="goToClassmates" class="px-5 py-2 text-lg text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300">
      访问同学列表
    </button>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  methods: {
    goToClassmates() {
      this.$router.push('/classmates');
    }
  }
};
</script>

<style scoped>
/* 不再需要任何样式，所有样式都已通过 Tailwind CSS 类处理 */
</style>
