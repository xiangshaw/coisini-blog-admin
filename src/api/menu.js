/*
菜单管理相关的API请求函数
*/
import request from '@/utils/request'

/**
 * 获取权限(菜单/功能)列表
 */
export const findNodes = () => {
    return request({
        url: "/api/v1/menu/findNodes",
        method: 'get'
    })
}

/**
 * 添加菜单
 */
export const saveMenu = (menu) => {
    return request({
        url: "/api/v1/menu/save",
        method: 'post',
        data: menu
    })
}

/**
 * 修改菜单
 */
export const updateById = (menu) => {
    return request({
        url: "/api/v1/menu/update",
        method: 'put',
        data: menu
    })
}

/**
 * 删除菜单
 */
export const removeById = (id) => {
    return request({
        url: `/api/v1/menu/remove/${id}`,
        method: 'delete'
    })
}

/**
 * 查看某个角色的权限列表
 */
export const toAssign = (roleId) => {
    return request({
        url: `/api/v1/menu/toAssign/${roleId}`,
        method: 'get'
    })
}

/**
 *  给某个角色授权
 */
export const doAssign = (assginMenuVo) => {
    return request({
        url: `/api/v1/menu/doAssign`,
        method: 'post',
        data: assginMenuVo
    })
}

/**
 * 更新菜单状态
 */
export const updateStatus = (id, status) => {
    return request({
        url: `/api/v1/menu/updateStatus/${id}/${status}`,
        method: 'get'
    })
}