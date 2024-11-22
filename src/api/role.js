/**
 * 角色管理相关的API请求函数
 */
import request from '@/utils/request'
import {API_ROLE_ADD, API_ROLE_BATCH_DELETE, API_ROLE_DELETE, API_ROLE_LIST, API_ROLE_UPDATE} from "@/components/api";

/**
 * 获取角色列表
 */
export const getRoleList = (roleSearchObj) => {
    return request({
        url: API_ROLE_LIST,
        method: 'get',
        params: roleSearchObj
    })
}

/**
 * 修改角色
 */
export const updateRole = (role) => {
    return request({
        url: API_ROLE_UPDATE,
        method: 'put',
        data: role
    })
}

/**
 * 删除角色
 */
export const deleteRole = (id) => {
    return request({
        url: API_ROLE_DELETE + '/' + id,
        method: 'delete'
    })
}

/**
 * 新增角色
 */
export const addRole = (role) => {
    return request({
        url: API_ROLE_ADD,
        method: 'post',
        data: role
    })
}

/**
 * 批量删除角色
 */
export const batchDeleteRole = (ids) => {
    return request({
        url: API_ROLE_BATCH_DELETE,
        method: 'delete',
        data: ids
    })
}
