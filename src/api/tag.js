// 导入请求工具类
import request from '@/utils/request.js'

// 标签列表查询
export const tagListService = (tagSearchObj) => {
    return request({
        url: '/api/v1/tag/list',
        method: 'get',
        params: tagSearchObj
    })
}

// 发布文章获取标签列表
export const getTagAllService = () => {
    return request({
        url: '/api/v1/tag/allTag',
        method: 'get'
    })
}

// 新增标签
export const tagAddService = (tagModel) => {
    return request({
        url: '/api/v1/tag/add',
        method: 'post',
        data: tagModel
    })
}

// 修改标签
export const tagUpdateService = (tagModel) => {
    return request({
        url: '/api/v1/tag/update',
        method: 'put',
        data: tagModel
    })
}

// 删除标签
export const tagDeleteService = (id) => {
    return request({
        url: '/api/v1/tag/delete',
        method: 'delete',
        params: {
            id
        }
    })
}

// 批量删除标签
export const tagBatchDeleteService = (ids) => {
    return request({
        url: '/api/v1/tag/deleteByIds',
        method: 'delete',
        data: ids
    })
}