// 导入请求工具
import request from '@/utils/request'

// 获取验证码接口函数
export const getCodeService = () => {
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

// 发送手机、邮箱验证码接口函数
export const sendSmsCodeService = (sendSmsData) => {
    const formData = new FormData();
    // 将 sendSmsData 的每个属性添加到 FormData
    Object.keys(sendSmsData).forEach(key => {
        formData.append(key, sendSmsData[key]);
    });
    return request({
        url: '/api/v1/auth/sendSms',
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
        url: '/api/v1/user/bindPhone',
        method: 'patch',
        data: bindPhoneData
    })
}

// 核查用户手机号
export const checkPhoneService = (phone) => {
    return request({
        url: '/api/v1/user/checkPhone/${phone}',
        method: 'get'
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

// 获取用户分页列表
export const getUserList = (userSearchObj) => {
    return request({
        url: `/api/v1/user/list`,
        method: 'get',
        params: userSearchObj
    })
}

// 修改用户状态
export const userStatusUpdateService = (userId, status) => {
    return request({
        url: `/api/v1/user/status/${userId}/${status}`,
        method: 'patch'
    })
}

// 删除用户
export const userDeleteService = (userId) => {
    return request({
        url: `/api/v1/user/remove/${userId}`,
        method: 'delete'
    })
}

// 批量删除用户
export const userBatchDeleteService = (userIdList) => {
    return request({
        url: `/api/v1/user/batchRemove`,
        method: 'delete',
        data: userIdList
    })
}

// 添加用户
export const userAddService = (userData) => {
    return request({
        url: `/api/v1/user/add`,
        method: 'post',
        data: userData
    })
}

// 修改用户
export const userUpdatesService = (userData) => {
    return request({
        url: `/api/v1/user/updates`,
        method: 'put',
        data: userData
    })
}

// 根据用户id查询用户已分配的角色
export const getUserRoleService = (userId) => {
    return request({
        url: `/api/v1/user/toAssign/${userId}`,
        method: 'get'
    })
}

// 给用户分配角色
export const userAssignRoleService = (assignRoleVo) => {
    return request({
        url: `/api/v1/user/doAssign`,
        method: 'post',
        data: assignRoleVo
    })
}