/**
 * 登录日志管理相关的API请求函数
 */
import request from '@/utils/request'

/**
 * 获取登录日志列表
 */
export const getLoginLogList = (loginLogSearchObj) => {
    return request({
        url: "/api/v1/loginLog/list",
        method: 'get',
        params: loginLogSearchObj
    })
}

/**
 * 删除登录日志
 */
export const deleteLoginLog = (id) => {
    return request({
        url: "/api/v1/loginLog/remove/" + id,
        method: 'delete'
    })
}

/**
 * 批量删除登录日志
 */
export const batchDeleteLoginLog = (ids) => {
    return request({
        url: "/api/v1/loginLog/batchRemove",
        method: 'delete',
        data: ids
    })
}

/**
 * 根据id查询登录日志
 */
export const getLoginLogById = (id) => {
    return request({
        url: "/api/v1/loginLog/get/" + id,
        method: 'get'
    })
}
