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

// 获取用户信息接口函数
export const userInfoService = () => {
    return request({
        url: '/api/v1/user/info',
        method: 'get',
    })
}

// 修改用户信息接口函数
export const userInfoUpdateService = (updateData) => {
    return request({
        url: '/api/v1/user/update',
        method: 'put',
        data: updateData
    })
}

// 用户修改头像接口函数
export const userAvatarUpdateService = (avatar) => {
    return request({
        url: '/api/v1/user/avatar',
        method: 'patch',
        data: avatar
    })
}

// 用户修改密码接口函数
export const userPasswordUpdateService = (password) => {
    return request({
        url: '/api/v1/user/password',
        method: 'patch',
        data: password
    })
}