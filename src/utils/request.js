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
    (result) => {
        // 使用函数判断状态码
        if (handleResponseCode(result.data.code, result.data.message)) {
            return result.data;
        }
        // 异步状态转化成失败的状态
        return Promise.reject(result.data);
    },
    //  错误处理，直接传递处理函数
    handleError
)

export default instance;

// 响应状态码处理函数
function handleResponseCode(code, message) {
    switch (code) {
        // 操作状态
        case 200:
            // 成功
            return true;
        case 201:
        case 202:
        case 203:
        case 204:
        case 205:
        case 206:
        case 207:
        case 208:
        case 209:
        case 210:
        case 211:
        case 212:
        case 213:
            ElMessage.error(message || '操作失败');
            break;

        // 登录状态
        case 2:
        case 3:
            ElMessage.error('用户名或密码错误');
            break;
        case 4:
            ElMessage.success('登录成功');
            break;
        case 5:
            ElMessage.success('退出成功');
            break;
        case 6:
            ElMessage.error('登录失败');
            break;
        case 7:
            ElMessage.error('登录过期，请重新登录');
            handleLoginExpired();
            break;
        case 8:
            ElMessage.error('登录失效，请重新登录');
            handleLoginExpired();
            break;
        case 9:
            ElMessage.error('登录异常');
            break;

        // Token状态
        case 100:
        case 101:
        case 102:
        case 103:
        case 106:
        case 107:
            ElMessage.error('Token错误或无效');
            handleLoginExpired();
            break;

        // 权限状态
        case 2000:
            ElMessage.error('无权限操作');
            break;
        case 2001:
            ElMessage.error('需要管理员权限');
            break;
        case 2002:
            ElMessage.error('认证失败');
            break;

        // 访问限制
        case 429:
            ElMessage.error('访问过于频繁，请稍后再试');
            break;

        // 文件状态
        case 1001:
        case 1003:
        case 1005:
            ElMessage.error(message || '文件操作失败');
            break;
        case 1006:
            ElMessage.error('文件未找到');
            break;

        // 验证码状态
        case 504:
        case 505:
            ElMessage.error('验证码错误或过期');
            break;

        // 默认处理
        default:
            ElMessage.error(message || `未知错误，错误码：${code}`);
    }
    // 非200状态码时，返回false
    return false;
}

// 错误处理函数
function handleError(err) {
    const {status, data} = err.response || {};
    // 未登录响应状态码401，未认证状态401，给出对应的提示，并跳转到登录页（?检查 err.response 是否存在，防止空值错误）
    if (status === 401) {
        ElMessage.error(data?.message || '登录已失效');
        // 获取token状态
        const tokenStore = useTokenStore();
        // 清除token
        tokenStore.removeToken();
        // 跳转到登录页
        router.push('/login');
    } else if (status === 500) {
        ElMessage.error('当前无权限访问该接口');
    } else {
        ElMessage.error(data?.message || '请求失败');
    }
    // 异步的状态转化成失败的状态
    return Promise.reject(err);
}

// 登录过期处理函数
function handleLoginExpired() {
    const tokenStore = useTokenStore();
    tokenStore.removeToken();
    router.push('/login');
}