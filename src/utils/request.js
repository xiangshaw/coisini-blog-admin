// 定制请求的实例

// 导入axios  npm install axios
import axios from 'axios';
import {ElMessage} from "element-plus";
// 定义一个变量,记录公共的前缀  baseURL
const baseURL = '/coisiniBlogApi';
const instance = axios.create({baseURL})


// 添加响应拦截器
instance.interceptors.response.use(
    result => {
        // 判断状态码
        if (result.data.code === 200) {
            return result.data;
        }
        // 状态码不是200
        ElMessage.error(result.data.message?result.data.message:'请求失败')
        // 异步状态转化成失败的状态
        return Promise.reject(result.data);
    },
    err => {
        ElMessage.error(err.message);
        // 异步的状态转化成失败的状态
        return Promise.reject(err);
    }
)

export default instance;