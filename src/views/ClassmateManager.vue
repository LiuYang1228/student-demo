<template>
  <div class="app">
    <h1>同学管理系统</h1>
    <ClassmateForm @add-classmate="addClassmate" />
    <ClassmateList
      :classmates="classmates"
      @edit-classmate="editClassmate"
      @delete-classmate="deleteClassmate"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import ClassmateList from '../components/ClassmateList.vue';

export default {
  name: 'App',
  components: {
    ClassmateList,
  },
  setup() {
    const classmates = ref([
      { xuhao: 1, name: '崔胜澈', studentId: '1001', age: 29 },
      { xuhao: 2, name: '尹净汉', studentId: '1002', age: 29 },
      { xuhao: 3, name: '洪知秀', studentId: '1003', age: 28 },
    ]);

    const addClassmate = (classmate) => {
      classmates.value.unshift(classmate);
    };

    const editClassmate = (index, updatedClassmate) => {
      classmates.value.splice(index, 1); 
      classmates.value.unshift(updatedClassmate); 
    };

    const deleteClassmate = (index) => {
      classmates.value.splice(index, 1);
    };

    return { classmates, addClassmate, editClassmate, deleteClassmate };
  },
};
</script>

<style>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

button:active {
  background-color: #3e8e41;
  transform: scale(1);
}
</style>
