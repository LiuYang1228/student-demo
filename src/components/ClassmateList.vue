<template>
  <div class="list-comp">
    <h1>同学列表</h1>
    <div class="tool-bar">
      <button class="add-btn" type="primary" @click="openAddModal">新增</button>
    </div>
    
    <ul>
      <li>
        <span class="No">序号</span>
        <span class="study-code">学号</span>
        <span class="name">姓名</span>
        <span class="age">年龄</span>
        <div class="operation">操作</div>
      </li>
      <li v-for="(item, index) in classmates.list" :key="item.id">
        <span class="No">{{ index + 1 }}</span>
        <span class="study-code">{{ item.id }}</span>
        <span class="name">{{ item.userName }}</span>
        <span class="age">{{ item.age }}</span>
        <div class="operation">
          <button @click="deleteUser(index)">删除</button>
          <button @click="openEditModal(index)">编辑</button>
          <button @click="getYourName(item.id)">问名字</button>
        </div>
      </li>
    </ul>
    <div class="pop-blank" v-if="showFlag">
      <h3>{{ isEdit ? '编辑同学' : '新增同学' }}</h3>
      <div class="blank-body">
        <div class="blank-item">
          <span>学号：</span>
          <input type="text" v-model="studyNum" @input="validateStudyNum">
          <p v-if="errors.studyNum" class="error">{{ errors.studyNum }}</p>
        </div>
        <div class="blank-item">
          <span>姓名：</span>
          <input type="text" v-model="name" @input="validateName">
          <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>
        <div class="blank-item">
          <span>年龄：</span>
          <input type="text" v-model="year" @input="validateYear">
          <p v-if="errors.year" class="error">{{ errors.year }}</p>
        </div>
      </div>
      <div class="footer">
        <button type="primary" @click="submitFn">确定</button>
        <button type="primary" @click="showFlag=false">取消</button>
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
      // 将编辑的同学移动到列表的第一位
      const editedStudent = classmates.list.splice(currentIndex.value, 1)[0];
      classmates.list.unshift(editedStudent);
    } else {
      classmates.addClassmate(student);
      // 将新增的同学移动到列表的最后一位
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

<style lang="less" scoped>
.list-comp {
  text-align: left;
}
h1 {
  text-align: center;
}
.tool-bar {
  display: flex;
  justify-content: flex-end;
  .add-btn {
    margin-right: 24px;
    background-color: dimgray;
    color: aliceblue;
    width: 90px;
  }
}
ul {
  text-align: center;
  padding-left: 24px;
  padding-right: 24px;
}
.pop-blank {
  position: absolute;
  background-color: #ffffff;
  border-radius: 8px;
  left: 50%;
  top: 50%;
  width: 400px; /* 修改宽度 */
  height: auto;
  transform: translate(-50%, -50%);
  padding: 24px;
  border: 1px solid dimgray;
  display: flex;
  flex-direction: column;
  h3 {
    text-align: center;
  }
  .blank-body {
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    .blank-item {
      height: auto;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
      span {
        margin-bottom: 8px;
        width: 100%;
      }
      input {
        height: 36px;
        width: 100%;
        font-size: 16px;
        box-sizing: border-box; /* 确保输入框宽度包含内边距和边框 */
      }
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    button {
      background-color: blue;
      color: white;
      height: 36px; /* 确保按钮高度一致 */
    }
    &>button:nth-child(1) {
      margin-right: 12px;
      background-color: white;
      color: blue;
      border: 1px solid blue;
    }
  }
}
li {
  list-style: none;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 24px;
  height: 64px;
  border-bottom: 1px solid dimgray;
  &:nth-child(1) {
    color: aliceblue;
    background-color: dimgray;
    align-items: center;
  }
  .No {
    width: 18%;
  }
  .study-code {
    width: 18%;
  }
  .name {
    width: 18%;
  }
  .age {
    width: 18%;
  }
  .operation {
    flex-grow: 1;
    display: flex;
    justify-content: space-around;
    &>button {
      background-color: lavender;
      color: slateblue;
      width: 90px;
    }
  }
}
.error {
  color: red;
  font-size: 12px;
}
</style>
