/**
 * 操作日志管理相关的API请求函数
 */
import request from '@/utils/request'

/**
 * 获取操作日志列表
 */
export const getOperLogList = (operLogSearchObj) => {
    return request({
        url: "/api/v1/operLog/list",
        method: 'get',
        params: operLogSearchObj
    })
}

/**
 * 删除操作日志
 */
export const deleteOperLog = (id) => {
    return request({
        url: "/api/v1/operLog/remove/" + id,
        method: 'delete'
    })
}

/**
 * 批量删除操作日志
 */
export const batchDeleteOperLog = (ids) => {
    return request({
        url: "/api/v1/operLog/batchRemove",
        method: 'delete',
        data: ids
    })
}

/**
 * 根据id查询操作日志
 */
export const getOperLogById = (id) => {
    return request({
        url: "/api/v1/operLog/get/" + id,
        method: 'get'
    })
}
