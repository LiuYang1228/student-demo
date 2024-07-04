<template>
  <div id="app">
    <h1>Babylon.js 示例</h1>
    <div style="height: 100vh;">
      <canvas ref="canvasRef" style="width: 100%; height: 600px;"></canvas>
      <canvas ref="ageChartRef" style="width: 600px; height: 600px;"></canvas>
      <div ref="ageChartRef" style="position: absolute; left: 0; top: 0; width: 260px; height: 260px;background-color: rgba(255, 255, 255, 0.5);"></div>
      <div ref="pieChartRef" class="pie-chart-container"></div>
      <div ref="interestsChartRef" class="inter-chart-container"></div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref ,watch } from 'vue';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import * as echarts from 'echarts';
import { useClassmatesStore } from '../store/classmates';

const canvasRef = ref(null);
const ageChartRef = ref(null);
const pieChartRef=ref(null);
const classmates = useClassmatesStore();
const interestsChartRef=ref(null);
const hobbies = ['篮球', '足球', '游泳', '音乐', '旅行', '阅读', '唱歌', '跳舞'];

let engine, scene;

const initEngine = async () => {
  if (canvasRef.value) {
    engine = new BABYLON.Engine(canvasRef.value, true);
    scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      0,
      0,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.value);
    camera.position = new BABYLON.Vector3(0, 6, -6);

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0), // 光源位置在模型上方
      scene
    );
    light.intensity = 1.5; // 增加光源强度

    // 开始渲染
    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });

    // 加载模型
    BABYLON.SceneLoader.ImportMesh("", "/model/", "library_draco.glb", scene, function (meshes) {
      // 加载成功后的处理逻辑
      console.log("模型加载成功:", meshes);
    }, null, function (scene, message, exception) {
      // 加载失败时的错误处理
      console.error("模型加载失败:", message);
      if (exception) {
        console.error(exception);
      }
    });
  }
};

const renderAgeChart = () => {
  if (ageChartRef.value) {
    const ageChart = echarts.init(ageChartRef.value);

    
    const xAxisData = classmates.list.map(student => student.userName);
    const seriesData = classmates.list.map(student => student.age);

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 10 ,
            color: '#333'// 设置 x 轴标签字体大小
            }
        },
        yAxis: {
            type: 'value',
            name: '年龄',
            axisLine: {
            show: true // 显示纵轴线
            },
            axisTick: {
            show: true // 显示刻度
            },
            splitLine: {
            show: true // 显示分隔线
            },
            axisLabel: {
            fontSize: 8 // 设置 y 轴标签字体大小
            }
        },
        series: [{
            data: seriesData,
            type: 'bar',
            barWidth: '20%', // 柱形图宽度
            itemStyle: {
            color: '#1890ff', // 柱形图颜色
            emphasis: {
                color: '#2db7f5' // 高亮时的颜色
            }
            },
            label: {
            show: true,
            position: 'top' // 标签显示在柱形图顶部
            }
        }]
    };


    ageChart.setOption(option);
  }
};
const fenderAgeChart = () => {
  const pieChart = echarts.init(pieChartRef.value);

  // 获取最新的三个同学的年龄数据
  const latestClassmates = classmates.list.slice(-3);

  const chartData = latestClassmates.map(student => ({
    name: `${student.userName} (${student.age}岁)`,
    value: student.age,
  }));

  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '年龄分布',
        type: 'pie',
        radius: '50%',
        radius: ['50%', '70%'],
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        itemStyle: {
          color: (params) => {
            const colorList = ['#ff7f50', '#87cefa', '#da70d6'];
            return colorList[params.dataIndex];
          },
        },
      },
    ],
  };

  pieChart.setOption(option);
};


const renderInterestsChart = () => {
 
  const interestsChart = echarts.init(interestsChartRef.value);

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
        radius: '50%',
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


// 组件挂载后初始化引擎和 ECharts 图表
onMounted(() => {
  initEngine();
  renderAgeChart();
  fenderAgeChart();
  renderInterestsChart();
});

watch(() => classmates.list, () => {
  fenderAgeChart();
}, { deep: true });
</script>

  
<style scoped>
  .pie-chart-container {
    position: absolute;
    bottom: 70px;
    width: 300px;
    height:300px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .inter-chart-container {
    position: absolute;
    bottom: 100px;
    left: 640px;
    width: 300px;
    height: 300px;
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
  