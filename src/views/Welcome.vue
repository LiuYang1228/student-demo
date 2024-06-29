<template>
    <div class="welcome">
      <h1>欢迎使用同学管理系统</h1>
      <button @click="goToClassmates">访问同学列表</button>
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
  .welcome {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    text-align: center;
    color: #333;
  }
  
  .welcome h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #ff8738;
  }
  
  .welcome button {
    padding: 10px 20px;
    font-size: 1.2rem;
    color: #fff;
    background-color: #ff8738;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .welcome button:hover {
    background-color: #e76a24; 
  }
  
  .welcome button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 135, 56, 0.5);
  }
  </style>
  