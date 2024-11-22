/**
 * 登录日志管理相关的API请求函数
 */
import request from '@/utils/request'
import {
    API_LOGIN_LOG_BATCH_DELETE,
    API_LOGIN_LOG_DELETE,
    API_LOGIN_LOG_GET_BY_ID,
    API_LOGIN_LOG_LIST
} from "@/components/api";

/**
 * 获取登录日志列表
 */
export const getLoginLogList = (loginLogSearchObj) => {
    return request({
        url: API_LOGIN_LOG_LIST,
        method: 'get',
        params: loginLogSearchObj
    })
}

/**
 * 删除登录日志
 */
export const deleteLoginLog = (id) => {
    return request({
        url: API_LOGIN_LOG_DELETE + '/' + id,
        method: 'delete'
    })
}

/**
 * 批量删除登录日志
 */
export const batchDeleteLoginLog = (ids) => {
    return request({
        url: API_LOGIN_LOG_BATCH_DELETE,
        method: 'delete',
        data: ids
    })
}

/**
 * 根据id查询登录日志
 */
export const getLoginLogById = (id) => {
    return request({
        url: API_LOGIN_LOG_GET_BY_ID + '/' + id,
        method: 'get'
    })
}
