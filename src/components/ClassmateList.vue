<template>
  <div class="list-comp p-6">
    <h1 class="text-center text-2xl font-bold mb-4">同学列表</h1>
    <div class="tool-bar flex justify-end mb-4">
      <button class="add-btn bg-gray-700 text-white py-2 px-4 rounded" @click="openAddModal">新增</button>
    </div>
    
    <ul class="space-y-6">
      <li class="flex justify-start items-center h-16 bg-gray-700 text-white px-6">
        <span class="No w-1/5">序号</span>
        <span class="study-code w-1/5">学号</span>
        <span class="name w-1/5">姓名</span>
        <span class="age w-1/5">年龄</span>
        <div class="operation flex-grow flex justify-around">
          操作
        </div>
      </li>
      <li v-for="(item, index) in classmates.list" :key="item.id" class="flex justify-start items-center h-16 border-b border-gray-400 px-6">
        <span class="No w-1/5">{{ index + 1 }}</span>
        <span class="study-code w-1/5">{{ item.id }}</span>
        <span class="name w-1/5">{{ item.userName }}</span>
        <span class="age w-1/5">{{ item.age }}</span>
        <div class="operation flex-grow flex justify-around space-x-2">
          <button class="bg-blue-500 text-white py-2 px-2 rounded flex items-center justify-center space-x-1" @click="deleteUser(index)">
            <span>删</span>
            <span>除</span>
          </button>

          <button class="bg-yellow-500 text-white py-2 px-4 rounded flex items-center justify-center space-x-1" @click="openEditModal(index)">
            <span>编</span>
            <span>辑</span>
          </button>

          <button class="bg-green-500 text-white py-2 px-4 rounded flex items-center justify-center space-x-1" @click="getYourName(item.id)">
            <span>问</span>
            <span>名</span>
            <span>字</span>
          </button>

        </div>
      </li>
    </ul>
    <div class="pop-blank fixed inset-0 bg-white border border-gray-700 rounded-lg p-6 flex flex-col items-center max-w-lg mx-auto my-16" v-if="showFlag">
      <h3 class="text-lg font-semibold mb-4">{{ isEdit ? '编辑同学' : '新增同学' }}</h3>
      <div class="blank-body flex-grow flex flex-col w-full">
        <div class="blank-item flex flex-col mb-4">
          <span>学号：</span>
          <input type="text" v-model="studyNum" @input="validateStudyNum" class="h-9 px-2 text-lg border border-gray-300 rounded">
          <p v-if="errors.studyNum" class="error text-red-500 text-sm">{{ errors.studyNum }}</p>
        </div>
        <div class="blank-item flex flex-col mb-4">
          <span>姓名：</span>
          <input type="text" v-model="name" @input="validateName" class="h-9 px-2 text-lg border border-gray-300 rounded">
          <p v-if="errors.name" class="error text-red-500 text-sm">{{ errors.name }}</p>
        </div>
        <div class="blank-item flex flex-col mb-4">
          <span>年龄：</span>
          <input type="text" v-model="year" @input="validateYear" class="h-9 px-2 text-lg border border-gray-300 rounded">
          <p v-if="errors.year" class="error text-red-500 text-sm">{{ errors.year }}</p>
        </div>
      </div>
      <div class="footer flex justify-end w-full">
        <button class="bg-blue-500 text-white py-2 px-4 rounded mr-2" @click="submitFn">确定</button>
        <button class="bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded" @click="showFlag=false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useClassmatesStore } from '../store/classmates';

const classmates = useClassmatesStore();

const showFlag = ref(false);
const isEdit = ref(false);
const currentIndex = ref(null);
const studyNum = ref('');
const name = ref('');
const year = ref('');
const errors = reactive({
  studyNum: '',
  name: '',
  year: ''
});

const openAddModal = () => {
  isEdit.value = false;
  studyNum.value = '';
  name.value = '';
  year.value = '';
  resetErrors();
  showFlag.value = true;
};

const openEditModal = (index) => {
  isEdit.value = true;
  currentIndex.value = index;
  const item = classmates.list[index];
  studyNum.value = item.id;
  name.value = item.userName;
  year.value = item.age;
  resetErrors();
  showFlag.value = true;
};

const deleteUser = (index) => {
  classmates.deleteClassmate(index);
};

const validateStudyNum = () => {
  if (!studyNum.value) {
    errors.studyNum = '学号不能为空';
  } else if (!/^\d+$/.test(studyNum.value)) {
    errors.studyNum = '学号只能是数字';
  } else if (classmates.list.some((item, idx) => item.id === parseInt(studyNum.value) && (idx !== currentIndex.value))) {
    errors.studyNum = '学号已存在';
  } else {
    errors.studyNum = '';
  }
};

const validateName = () => {
  if (!name.value) {
    errors.name = '姓名不能为空';
  } else if (/^\d+$/.test(name.value)) {
    errors.name = '姓名不能是数字';
  } else {
    errors.name = '';
  }
};

const validateYear = () => {
  if (!year.value) {
    errors.year = '年龄不能为空';
  } else if (!/^\d+$/.test(year.value) || year.value <= 0) {
    errors.year = '年龄必须是大于0的数字';
  } else {
    errors.year = '';
  }
};

const validateInputs = () => {
  validateStudyNum();
  validateName();
  validateYear();
  return !errors.studyNum && !errors.name && !errors.year;
};

const resetErrors = () => {
  errors.studyNum = '';
  errors.name = '';
  errors.year = '';
};

const checkAndAppendName = (name, id) => {
  let newName = name;
  let count = 1;
  while (classmates.list.some(item => item.userName === newName && item.id !== id)) {
    newName = `${name}${count}`;
    count++;
  }
  return newName;
};

const submitFn = () => {
  if (validateInputs()) {
    const student = {
      id: parseInt(studyNum.value),
      userName: checkAndAppendName(name.value, isEdit.value ? classmates.list[currentIndex.value].id : null),
      age: parseInt(year.value)
    };

    if (isEdit.value) {
      classmates.editClassmate(currentIndex.value, student);
      const editedStudent = classmates.list.splice(currentIndex.value, 1)[0];
      classmates.list.unshift(editedStudent);
    } else {
      classmates.addClassmate(student);
      const addedStudent = classmates.list.pop();
      classmates.list.push(addedStudent);
    }
    showFlag.value = false;
    studyNum.value = '';
    name.value = '';
    year.value = '';
  }
};

const getYourName = (id) => {
  const student = classmates.list.find(item => item.id === id);
  alert(student.userName);
};
</script>

<style scoped>
.error {
  @apply text-red-500 text-sm;
}
</style>
