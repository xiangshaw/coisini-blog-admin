import './assets/main.scss'

import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/dist/locale/zh-cn'
import 'element-plus/dist/index.css'
import router from "@/router";
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
const persist = createPersistedState()
pinia.use(persist)

// 动态路由权限
import '@/router/permission'

app
    .use(pinia)
    .use(ElementPlus, {locale})
    .use(router)
    .mount('#app')