/*
菜单管理相关的API请求函数
*/
import request from '@/utils/request'
import {
    API_MENU_ADD,
    API_MENU_DELETE,
    API_MENU_LIST,
    API_MENU_ROLE_ASSIGN,
    API_MENU_ROLE_LIST,
    API_MENU_UPDATE, API_MENU_UPDATE_STATUS
} from "@/components/api";

/**
 * 获取权限(菜单/功能)列表
 */
export const findNodes = () => {
    return request({
        url: API_MENU_LIST,
        method: 'get'
    })
}

/**
 * 添加菜单
 */
export const saveMenu = (menu) => {
    return request({
        url: API_MENU_ADD,
        method: 'post',
        data: menu
    })
}

/**
 * 修改菜单
 */
export const updateById = (menu) => {
    return request({
        url: API_MENU_UPDATE,
        method: 'put',
        data: menu
    })
}

/**
 * 删除菜单
 */
export const removeById = (id) => {
    return request({
        url: API_MENU_DELETE + '/' + id,
        method: 'delete'
    })
}

/**
 * 查看某个角色的权限列表
 */
export const toAssign = (roleId) => {
    return request({
        url: API_MENU_ROLE_LIST + '/' + roleId,
        method: 'get'
    })
}

/**
 *  给某个角色授权
 */
export const doAssign = (assginMenuVo) => {
    return request({
        url: API_MENU_ROLE_ASSIGN,
        method: 'post',
        data: assginMenuVo
    })
}

/**
 * 更新菜单状态
 */
export const updateStatus = (id, status) => {
    return request({
        url: API_MENU_UPDATE_STATUS + '/' + id + '/' + status,
        method: 'get'
    })
}