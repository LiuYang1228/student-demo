<template>
  <div class="list-comp p-6">
    <h1 class="text-center text-2xl font-bold mb-4">同学列表</h1>
    <div class="tool-bar flex justify-end mb-4">
      <a-button type="primary" class="add-btn" @click="openAddModal">新增</a-button>
    </div>
    
    <!-- 学生列表表格 -->
    <a-table :columns="columns" :dataSource="classmates.list" rowKey="id" class="mb-4">
      <template #bodyCell="{ text, record, column, index }">
        <template v-if="column.key === 'actions'">
          <div class="operation flex justify-around space-x-2">
            <a-button type="primary" danger ghost @click="deleteUser(record.id)">
              <span>删除</span>
            </a-button>
            <template v-if="!record.editable">
              <a-button type="primary" ghost @click="startEdit(record)">
                <span>编辑</span>
              </a-button>
            </template>
            <template v-else>
              <a-button type="primary" @click="saveEdit(record)">
                <span>保存</span>
              </a-button>
              <a-button @click="cancelEdit(record)">
                <span>取消</span>
              </a-button>
            </template>
            <a-button type="dashed" @click="getYourName(record.id)">
              <span>问名字</span>
            </a-button>
          </div>
        </template>
        <template v-else>
          <template v-if="record.editable && column.key === 'userName'">
            <a-input v-model:value="record.tempUserName" />
          </template>
          <template v-else-if="record.editable && column.key === 'age'">
            <a-input-number v-model:value="record.tempAge" :min="1" :max="100" style="width: 100%" />
          </template>
          <template v-else-if="column.key === 'id'">
            <a-input v-if="!record.editable" :value="record.id" disabled />
            <a-input v-else v-model:value="record.id" />
          </template>
          <template v-else-if="column.key === 'hobbies'">
            <template v-if="record.editable">
              <a-select v-model:value="record.tempHobbies">
                <a-select-option v-for="hobby in hobbies" :key="hobby" :value="hobby">{{ hobby }}</a-select-option>
              </a-select>
            </template>
            <template v-else>
              <span>{{ renderHobbies(record) }}</span>
            </template>
          </template>
          <template v-else-if="column.key === 'index'">
            <span>{{ calculateIndex(index) }}</span>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </template>
    </a-table>

    <!-- 编辑/添加学生信息的模态框 -->
    <a-modal v-model:open="modalVisible" title="编辑同学信息" @ok="handleModalOk" @cancel="handleModalCancel">
      <a-form layout="vertical">
        <a-form-item label="学号" name="id" :rules="[{ required: true, message: '请输入学号' }]" :validateTrigger="['change']">
          <a-input v-model:value="formValues.id" />
        </a-form-item>
        <a-form-item label="姓名" name="userName" :rules="[{ required: true, message: '请输入姓名' }]" :validateTrigger="['change']">
          <a-input v-model:value="formValues.userName" />
        </a-form-item>
        <a-form-item label="年龄" name="age" :rules="[{ required: true, message: '请输入年龄' }]" :validateTrigger="['change']">
          <a-input-number v-model:value="formValues.age" :min="1" :max="100" style="width: 100%" />
        </a-form-item>
        <a-form-item label="兴趣爱好" name="hobbies" :rules="[{ required: true, message: '请输入兴趣爱好' }]" :validateTrigger="['change']">
          <a-select v-model:value="formValues.hobbies">
            <a-select-option v-for="hobby in hobbies" :key="hobby" :value="hobby">{{ hobby }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- ECharts 饼图容器 -->
    <div id="interestsChart" style="height: 400px;"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue';
import * as echarts from 'echarts';
import { useClassmatesStore } from '../store/classmates';

const classmates = useClassmatesStore();
const modalVisible = ref(false);
const formValues = reactive({
  userName: '',
  age: null,
  id: null,
  hobbies: '',
});

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '学号',
    dataIndex: 'id',
    key: 'id',
    customRender: ({ text, record }) => {
      return record.editable ? record.id : text;
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    customRender: ({ text, record }) => {
      return record.editable ? record.tempUserName : text;
    }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    customRender: ({ text, record }) => {
      return record.editable ? record.tempAge : text;
    }
  },
  {
    title: '兴趣爱好',
    dataIndex: 'hobbies',
    key: 'hobbies',
    customRender: ({ text, record }) => {
      return record.editable ? renderEditHobbies(record) : renderHobbies(record);
    }
  },
  {
    title: '操作',
    key: 'actions',
  }
];

const renderHobbies = (record) => {
  if (record && record.hobbies) {
    return  record.hobbies;
  } else {
    return '无'; // 可以返回一个默认值或者根据需要进行处理
  }
};

const renderEditHobbies = (record) => {
  const selectOptions = hobbies.map(hobby => {
    return h('a-select-option', {
      key: hobby,
      value: hobby,
    }, hobby);
  });

  return h('a-select', {
    'v-model:value': record.tempHobbies,
  }, selectOptions);
};

const startEdit = (record) => {
  record.tempUserName = record.userName;
  record.tempAge = record.age;
  record.tempHobbies = record.hobbies;
  record.editable = true;
};

const saveEdit = async (record) => {
  const confirmed = confirm('确认保存修改吗？');
  if (confirmed) {
    try {
      await saveToBackend(record);
      record.userName = record.tempUserName;
      record.age = record.tempAge;
      record.hobbies = record.tempHobbies;
      record.editable = false;

      // Update the chart after saving edit
      renderInterestsChart();
    } catch (error) {
      console.error('保存失败:', error);
    }
  }
};

const saveToBackend = async (record) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const cancelEdit = (record) => {
  record.editable = false;
};

const getYourName = (id) => {
  const student = classmates.list.find(item => item.id === id);
  alert(student.userName);
};

const openAddModal = () => {
  modalVisible.value = true;
  formValues.userName = '';
  formValues.age = null;
  formValues.id = null;
  formValues.hobbies = '';
};

const handleModalOk = () => {
  const isValid = validateForm();
  if (isValid) {
    const newStudent = {
      id: formValues.id,
      userName: formValues.userName,
      age: formValues.age,
      hobbies: formValues.hobbies,
      editable: false,
      tempUserName: '',
      tempAge: null,
      tempHobbies: '',
    };
    classmates.list.push(newStudent);
    modalVisible.value = false;

    // Update the chart after adding a new student
    renderInterestsChart();
  } else {
    console.error('表单校验失败');
  }
};

const validateForm = () => {
  return !!formValues.id && !!formValues.userName && !!formValues.age && formValues.hobbies.length > 0 && /^\d+$/.test(formValues.id);
};

const handleModalCancel = () => {
  modalVisible.value = false;
};

const deleteUser = async (id) => {
  const confirmed = confirm('确认删除该用户吗？');
  if (confirmed) {
    try {
      await deleteFromBackend(id);
      classmates.list = classmates.list.filter(item => item.id !== id);

      // Update the chart after deleting a student
      renderInterestsChart();
    } catch (error) {
      console.error('删除失败:', error);
    }
  }
};

const deleteFromBackend = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const calculateIndex = (index) => {
  return index + 1;
};

// 模拟的兴趣爱好列表
const hobbies = ['篮球', '足球', '游泳', '音乐', '旅行', '阅读','唱歌','跳舞','朗诵'];

//兴趣爱好饼图
const renderInterestsChart = () => {
  const interestsChart = echarts.init(document.getElementById('interestsChart'));
  const interestsData = hobbies.map(hobby => {
    return {
      name: hobby,
      value: classmates.list.filter(student => student.hobbies === hobby).length
    };
  });

  console.log(interestsData)
  const options = {
    title: {
      text: '同学兴趣爱好分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '兴趣爱好',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: interestsData
      }
    ]
  };
  interestsChart.setOption(options);
};


onMounted(() => {
  renderInterestsChart();
});

</script>

<style scoped>
/* 可选的样式代码 */
</style>
