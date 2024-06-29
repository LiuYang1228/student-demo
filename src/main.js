import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import "./input.css";

const app = createApp(App);
const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app');
