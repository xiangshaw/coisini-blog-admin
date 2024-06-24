/**
 * 角色管理相关的API请求函数
 */
import request from '@/utils/request'

/**
 * 获取角色列表
 */
export const getRoleList = (roleSearchObj) => {
    return request({
        url: '/api/v1/role/list',
        method: 'get',
        params: roleSearchObj
    })
}

/**
 * 修改角色
 */
export const updateRole = (role) => {
    return request({
        url: '/api/v1/role/update',
        method: 'put',
        data: role
    })
}

/**
 * 删除角色
 */
export const deleteRole = (id) => {
    return request({
        url: '/api/v1/role/remove/' + id,
        method: 'delete'
    })
}

/**
 * 新增角色
 */
export const addRole = (role) => {
    return request({
        url: '/api/v1/role/save',
        method: 'post',
        data: role
    })
}

/**
 * 批量删除角色
 */
export const batchDeleteRole = (ids) => {
    return request({
        url: '/api/v1/role/batchRemove',
        method: 'delete',
        data: ids
    })
}
