import {defineStore} from "pinia";
import {ref} from 'vue';

/*
    defineStore参数描述：
        第一个参数：给状态起名，具有唯一性
        第二个参数：函数内部可以定义该状态中所有内容

    defineStore返回值描述：
        返回的是一个函数，将来可以调用该函数，得到第二个参数中返回的内容
*/
export const useTokenStore
    = defineStore('token', () => {
    // 1.定义响应式变量token
    const token = ref('')
    const customToken = 'Coisini '

    // 2.定义修改token值的方法
    const setToken = (newToken) => {
        // 检查 newToken 是否以 "Coisini " 开头，如果没有，则添加前缀
        if (!newToken.startsWith(customToken)) {
            newToken = customToken + newToken;
        }
        token.value = newToken
    }

    // 3.定义获取token值的方法
    const getToken = () => {
        if (token.value.startsWith(customToken)) {
            return token.value.substring(customToken.length)
        }
        return token.value
    }

    // 4.定义移除token值的方法
    const removeToken = () => {
        token.value = ''
    }
    return {
        token,
        setToken,
        getToken,
        removeToken
    }
}, {
    // token持久化配置
    persist: true,
})