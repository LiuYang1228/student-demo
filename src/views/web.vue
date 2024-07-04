<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Li Cheng
 * @Date: 2024-06-24 09:52:27
 * @LastEditors: Li Cheng
 * @LastEditTime: 2024-06-24 15:50:17
-->
<template>
    <div>
      <!-- <h1>3D展示</h1> -->
      <canvas ref="canvasRef" class="canvas"></canvas>
      <div ref="ageChartRef" style="position: absolute; left: 0; top: 0; width: 300px; height: 300px;background-color: rgba(255, 255, 255, 0.5);"></div>
      <div ref="pieChartRef" class="pie-chart-container"></div>
      <div ref="interestsChartRef" class="inter-chart-container"></div>
      <div style="position: absolute; top: 20px; right: 20px;">
        <button @click="toggleLights(true)" style="background-color: green; color: white; padding: 8px 16px; border: none; cursor: pointer; margin-right: 10px;">开灯</button>
        <button @click="toggleLights(false)" style="background-color: red; color: white; padding: 8px 16px; border: none; cursor: pointer;">关灯</button>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted ,watch} from 'vue';
  import * as BABYLON from '@babylonjs/core';
  import "@babylonjs/loaders";
  import "@babylonjs/inspector";
  import navList from "../utils/navList";
  import * as echarts from 'echarts'; 
  import { useClassmatesStore } from '../store/classmates';

//const canvasRef = ref(null);
const ageChartRef = ref(null);
const pieChartRef=ref(null);
const classmates = useClassmatesStore();
const interestsChartRef=ref(null);
const hobbies = ['篮球', '足球', '游泳', '音乐', '旅行', '阅读', '唱歌', '跳舞'];

  let loopIndex = 0;
  const canvasRef = ref(null);
  const camera = ref(null);
  const activeKey = ref(0);
  const cacheName = reactive([]);
  
  const showModel = ({ position, target }) => {
    animateCamera("position", new BABYLON.Vector3(...position), camera.value);
    animateCamera("target", new BABYLON.Vector3(...target), camera.value);
  }
  
  // 视角切换过程中的过渡动画
  const animateCamera = (type, newPos, camera) => {
    const speed = 60;
    const frameCount = 240;
  
    const ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    BABYLON.Animation.CreateAndStartAnimation(
      "animation",
      camera,
      type,
      speed,
      frameCount,
      camera[type],
      newPos,
      0,
      ease
    );
  }
  
  // 聚焦到某一个物体或区域的视角
  const selectModel = (names, animation, scene) => {
    scene.meshes.forEach((mesh) => {
      if (cacheName.includes(mesh.name)) {
        mesh.material.albedoColor = scene.cacheMeshColor;
      }
      if (names.includes(mesh.name)) {
        scene.cacheMeshColor = mesh.material.albedoColor;
        cacheName.push(...names);
        mesh.material.albedoColor = new BABYLON.Color3(0, 221 / 255, 1);
        showModel(animation);
      }
    });
  }
  
  // 生成地面
  // 生成圆球
  // 生成书桌
  // 生成小圆桌
  // 初始化引擎：生成3D视图所需的场景、素材、相机，并调用相关函数添加对应的元素：书桌、小圆桌、外部模型导入...
  const initEngine = async () => {
    if (canvasRef.value) {
      const engine = new BABYLON.Engine(canvasRef.value, true);
      const scene = new BABYLON.Scene(engine);
      camera.value = new BABYLON.ArcRotateCamera(
        'camera',
        Math.PI / 10,
        Math.PI / 3,
        20,
        BABYLON.Vector3.Zero(),
        scene,
      )
  
      camera.value.attachControl(canvasRef.value)
      camera.value.lowerBetaLimit = 0;
      camera.value.upperBetaLimit = Math.PI / 2;
      camera.value.lowerRadiusLimit = 3;
      camera.value.upperRadiusLimit = 40;
      const light = new BABYLON.HemisphericLight(
        "HemisphericLight",
        new BABYLON.Vector3(0, 1, 0),
        this
      )
  
      light.intensity = 1
     
        light.specular = new BABYLON.Color3(1, 1, 0);
  
  
      BABYLON.SceneLoader.Append('/model/', 'library_draco.glb', scene, (meshes) => {
        console.log(meshes)
        showModel(animation)
      })
  
      
      engine.runRenderLoop(() => {
        scene.render();
      })
      scene.debugLayer.show({
        embedMode: true,
      });
  
      window.addEventListener('resize', () => {
        engine.resize();
      });
      //摄像头镜头跟随
      scene.onPointerObservable.add(pointerInfo => {
      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
        const pickResult = scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);
        if (pickResult.hit) {
          const targetPosition = pickResult.pickedPoint;
          animateCamera("position", targetPosition, camera.value);
        }
      }
    });
      autoPlay(scene);
    }
  }
  
  // 触发视角切换逻辑
  const autoPlay = (scene) => {
    const play = () => {
      if (loopIndex >= navList.length) loopIndex = 0;
      activeKey.value = loopIndex;
      const { names, animation } = navList[loopIndex];
      selectModel(names, animation, scene);
      loopIndex++;
    };
    let timer = setInterval(play, 5000);
  };
//年龄柱状图
  const renderAgeChart = () => {
  if (ageChartRef.value) {
    // div 元素 (ageChartRef) 上创建一个 ECharts 实例，并将该实例赋值给 ageChart 变量，以便后续使用该实例进行图表的配置和操作。
    const ageChart = echarts.init(ageChartRef.value);

    const xAxisData = classmates.list.map(student => student.userName);
    const seriesData = classmates.list.map(student => student.age);

    const option = {
        title: {
     text: '年龄分布图',
     left: 'center'
   },
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

//年龄
const fenderAgeChart = () => {
  const pieChart = echarts.init(pieChartRef.value);

  // 获取所有同学的年龄数据
  const chartData = classmates.list.map(student => ({
    name: `${student.userName} (${student.age}岁)`,
    value: student.age,
  }));

  const option = {
    title: {
     text: '年龄分布图',
     right: 'right',
   },
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
            const colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3','#FF3399','#ffa500','#00ced1'];
            return colorList[params.dataIndex % colorList.length]; // Use modulo to cycle colors
          },
        },
      },
    ],
  };
 pieChart.setOption(option);
 
};

//同学兴趣饼图
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
       radius: ['40%', '70%'],
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

const toggleLights = (on) => {
  if (camera.value && camera.value.getScene()) {
    camera.value.getScene().lights.forEach(light => {
      if (on) {
        // 增加光源强度，使模型变亮
        light.intensity = 3; // 可根据需要调整强度
      } else {
        // 减小光源强度，使模型变暗
        light.intensity =0.1; // 可根据需要调整强度
      }
    });
  }
}

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
  .canvas {
    /* position: absolute; */
    width: 100%;
    height: 90vh;
  }
  .pie-chart-container {
  position: absolute;
  bottom: 50px; /* Adjust as needed */
  /* left: 5px; */
  width: 300px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.5);
}
.inter-chart-container {
    position: absolute;
    bottom: 70px;
    left: 1230px;
    width: 300px;
    height: 300px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  </style>
  