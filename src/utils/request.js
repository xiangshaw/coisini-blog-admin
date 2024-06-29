// 定制请求的实例

// 导入axios  npm install axios
import axios from 'axios';
import {ElMessage} from "element-plus";
// 定义一个变量,记录公共的前缀  baseURL
const baseURL = '/coisiniBlogApi';
const instance = axios.create({baseURL})

import {useTokenStore} from "@/stores/token";
import router from "@/router";
// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        // 获取token
        const tokenStore = useTokenStore();
        // 判断请求是否添加token
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    result => {
        // 判断状态码
        if (result.data.code === 200) {
            return result.data;
        } else {
            // 状态码不是200
            ElMessage.error(result.data.message ? result.data.message : '请求失败')
            // 异步状态转化成失败的状态
            return Promise.reject(result.data);
        }
    },
    err => {
        // 未登录响应状态码401，未认证状态401，给出对应的提示，并跳转到登录页（?检查 err.response 是否存在，防止空值错误）
        if (err.response?.code === 401) {
            ElMessage.error('登录已失效，请先登录');
            // 获取token状态
            const tokenStore = useTokenStore();
            // 清除token
            tokenStore.removeToken();
            // 跳转到登录页
            router.push('/login')
        } else {
            // 判断 err.response 是否存在，以避免访问 undefined 的属性
            ElMessage.error(err.message || '请求失败');
        }
        // 异步的状态转化成失败的状态
        return Promise.reject(err);
    }
)

export default instance;