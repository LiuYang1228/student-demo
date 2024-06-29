<template>
  <div class="app max-w-3xl mx-auto p-5 font-sans">
    <h1 class="text-3xl font-bold mb-5">同学管理系统</h1>
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

<style scoped>
/* 不再需要任何样式，因为所有样式都已通过 Tailwind CSS 类处理 */
</style>
