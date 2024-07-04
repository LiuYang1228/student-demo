import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia';
import router from './router';
import "./input.css";

const app = createApp(App);
const pinia = createPinia();

createApp(App).use(router).use(pinia).use(Antd).mount('#app');
