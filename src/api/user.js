// 导入请求工具
import request from '@/utils/request'

// 获取验证码接口函数
export const getCodeService = (phone) => {
    return request({
        url: '/api/v1/auth/captcha',
        method: 'get',
    })
}

// 注册接口函数
export const userRegisterService = (registerData) => {
    return request({
        url: '/api/v1/auth/register',
        method: 'post',
        data: registerData
    })
}

// 登录接口函数
export const userLoginService = (loginData) => {
    return request({
        url: '/api/v1/auth/authenticate',
        method: 'post',
        data: loginData
    })
}