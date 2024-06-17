// 导入请求工具类
import request from '@/utils/request.js'

// 文章分类列表查询
export const articleCategoryListService = (categorySearchObj) => {
    return request({
        url: '/api/v1/category/list',
        method: 'get',
        params: categorySearchObj
    })
}

// 新增文章分类
export const articleCategoryAddService = (categoryModel) => {
    return request({
        url: '/api/v1/category/add',
        method: 'post',
        data: categoryModel
    })
}

// 修改文章分类
export const articleCategoryUpdateService = (categoryModel) => {
    return request({
        url: '/api/v1/category/update',
        method: 'put',
        data: categoryModel
    })
}

// 删除文章分类
export const articleCategoryDeleteService = (id) => {
    return request({
        url: '/api/v1/category/delete',
        method: 'delete',
        params: {
            id
        }
    })
}

// 批量删除文章分类
export const articleCategoryBatchDeleteService = (ids) => {
    return request({
        url: '/api/v1/category/deleteByIds',
        method: 'delete',
        data: ids
    })
}