// 导入请求工具
import request from '@/utils/request'
import {
    API_AUTH_CAPTCHA,
    API_AUTH_LOGIN,
    API_AUTH_REGISTER,
    API_AUTH_SMS, API_USER_ADD, API_USER_ASSIGN_ROLES,
    API_USER_AVATAR, API_USER_BATCH_DELETE,
    API_USER_BIND_PHONE,
    API_USER_CHECK_PHONE, API_USER_DELETE, API_USER_EDIT,
    API_USER_INFO,
    API_USER_LIST, API_USER_ROLES,
    API_USER_UPDATE,
    API_USER_UPDATE_PASSWORD,
    API_USER_UPDATE_STATUS
} from "@/components/api";

// 获取验证码接口函数
export const getCodeService = () => {
    return request({
        url: API_AUTH_CAPTCHA,
        method: 'get',
    })
}

// 注册接口函数
export const userRegisterService = (registerData) => {
    return request({
        url: API_AUTH_REGISTER,
        method: 'post',
        data: registerData
    })
}

// 登录接口函数
export const userLoginService = (loginData) => {
    return request({
        url: API_AUTH_LOGIN,
        method: 'post',
        data: loginData
    })
}

// 发送手机、邮箱验证码接口函数
export const sendSmsCodeService = (sendSmsData) => {
    const formData = new FormData();
    // 将 sendSmsData 的每个属性添加到 FormData
    Object.keys(sendSmsData).forEach(key => {
        formData.append(key, sendSmsData[key]);
    });
    return request({
        url: API_AUTH_SMS,
        method: 'post',
        data: formData,
        headers: {
            // 设置内容类型
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 绑定手机号接口函数
export const bindPhoneService = (bindPhoneData) => {
    return request({
        url: API_USER_BIND_PHONE,
        method: 'patch',
        data: bindPhoneData
    })
}

// 核查用户手机号
export const checkPhoneService = (phone) => {
    return request({
        url: API_USER_CHECK_PHONE + '/' + phone,
        method: 'get'
    })
}

// 获取用户信息接口函数
export const userInfoService = () => {
    return request({
        url: API_USER_INFO,
        method: 'get',
    })
}

// 修改用户信息接口函数
export const userInfoUpdateService = (updateData) => {
    return request({
        url: API_USER_UPDATE,
        method: 'put',
        data: updateData
    })
}

// 用户修改头像接口函数
export const userAvatarUpdateService = (avatar) => {
    return request({
        url: API_USER_AVATAR,
        method: 'patch',
        data: avatar
    })
}

// 用户修改密码接口函数
export const userPasswordUpdateService = (password) => {
    return request({
        url: API_USER_UPDATE_PASSWORD,
        method: 'patch',
        data: password
    })
}

// 获取用户分页列表
export const getUserList = (userSearchObj) => {
    return request({
        url: API_USER_LIST,
        method: 'get',
        params: userSearchObj
    })
}

// 修改用户状态
export const userStatusUpdateService = (userId, status) => {
    return request({
        url: API_USER_UPDATE_STATUS + '/' + userId + '/' + status,
        method: 'patch'
    })
}

// 删除用户
export const userDeleteService = (userId) => {
    return request({
        url: API_USER_DELETE + '/' + userId,
        method: 'delete'
    })
}

// 批量删除用户
export const userBatchDeleteService = (userIdList) => {
    return request({
        url: API_USER_BATCH_DELETE,
        method: 'delete',
        data: userIdList
    })
}

// 添加用户
export const userAddService = (userData) => {
    return request({
        url: API_USER_ADD,
        method: 'post',
        data: userData
    })
}

// 修改用户
export const userUpdatesService = (userData) => {
    return request({
        url: API_USER_EDIT,
        method: 'put',
        data: userData
    })
}

// 根据用户id查询用户已分配的角色
export const getUserRoleService = (userId) => {
    return request({
        url: API_USER_ROLES + '/' + userId,
        method: 'get'
    })
}

// 给用户分配角色
export const userAssignRoleService = (assignRoleVo) => {
    return request({
        url: API_USER_ASSIGN_ROLES,
        method: 'post',
        data: assignRoleVo
    })
}