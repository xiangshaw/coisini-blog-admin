import './assets/main.scss'

import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/router";
import {createPinia} from "pinia";

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app
    .use(pinia)
    .use(ElementPlus)
    .use(router)
    .mount('#app')