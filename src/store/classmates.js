import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useClassmatesStore = defineStore('classmates', () => {
  const list = ref([
    { id: 220812022, userName: '刘淑文', age: 18 },
    { id: 220812008, userName: '蔡欣怡', age: 18 },
    { id: 220812030, userName: '龙依', age: 18 }
  ]);

  const addClassmate = (classmate) => {
    list.value.push(classmate);
  };

  const editClassmate = (index, updatedClassmate) => {
    list.value.splice(index, 1, updatedClassmate);
  };

  const deleteClassmate = (index) => {
    list.value.splice(index, 1);
  };

  return { list, addClassmate, editClassmate, deleteClassmate };
});
