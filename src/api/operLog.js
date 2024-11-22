/**
 * 操作日志管理相关的API请求函数
 */
import request from '@/utils/request'
import {
    API_OPER_LOG_BATCH_DELETE,
    API_OPER_LOG_DELETE,
    API_OPER_LOG_GET_BY_ID,
    API_OPER_LOG_LIST
} from "@/components/api";

/**
 * 获取操作日志列表
 */
export const getOperLogList = (operLogSearchObj) => {
    return request({
        url: API_OPER_LOG_LIST,
        method: 'get',
        params: operLogSearchObj
    })
}

/**
 * 删除操作日志
 */
export const deleteOperLog = (id) => {
    return request({
        url: API_OPER_LOG_DELETE + '/' + id,
        method: 'delete'
    })
}

/**
 * 批量删除操作日志
 */
export const batchDeleteOperLog = (ids) => {
    return request({
        url: API_OPER_LOG_BATCH_DELETE,
        method: 'delete',
        data: ids
    })
}

/**
 * 根据id查询操作日志
 */
export const getOperLogById = (id) => {
    return request({
        url: API_OPER_LOG_GET_BY_ID + '/' + id,
        method: 'get'
    })
}
