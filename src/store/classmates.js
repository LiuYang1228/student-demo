// classmates.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useClassmatesStore = defineStore('classmates', () => {
  const list = ref([
    { id: 220812022, userName: '刘淑文', hobbies:'唱歌' , age: 18 },
    { id: 220812008, userName: '蔡欣怡', hobbies:'唱歌' , age: 18 },
    { id: 220812030, userName: '龙依', hobbies:'跳舞' , age: 18 },
    { id: 220812001, userName: '文俊辉', hobbies:'朗诵' , age: 28 },
    { id: 220812002, userName: '权顺荣', hobbies:'跳舞' , age: 16 },
    { id: 220812003, userName: '全圆佑', hobbies:'唱歌' , age: 20 },
    { id: 220812004, userName: '李知勋', hobbies:'足球' , age: 26 },
    { id: 220812005, userName: '徐明浩', hobbies:'篮球' , age: 23 },
  ]);

  const addClassmate = (classmate) => {
    list.value.push(classmate);
    refreshIndexes(); // 添加同学后刷新序号
  };

  const editClassmate = (index, updatedClassmate) => {
    list.value.splice(index, 1, updatedClassmate);
    refreshIndexes(); // 编辑同学后刷新序号
  };

  const deleteClassmate = (index) => {
    list.value.splice(index, 1);
    refreshIndexes(); // 删除同学后刷新序号
  };

  // 刷新序号
  const refreshIndexes = () => {
    list.value.forEach((item, index) => {
      item.index = index + 1;
    });
  };

  refreshIndexes(); // 初始化加载时刷新序号

  return { list, addClassmate, editClassmate, deleteClassmate };
});
