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

// 获取文章分类
export const articleCategoryGetService = () => {
    return request({
        url: '/api/v1/category/articleList',
        method: 'get',
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

// 文章列表查询
export const articleListService = (articleSearchObj) => {
    return request({
        url: '/api/v1/article/list',
        method: 'get',
        params: articleSearchObj
    })
}

// 添加文章
export const articleAddService = (articleModel) => {
    return request({
        url: '/api/v1/article/add',
        method: 'post',
        data: articleModel
    })
    //return request.post('/api/v1/article/add', articleModel)
}

// 修改文章
export const articleUpdateService = (articleModel) => {
    return request({
        url: '/api/v1/article/update',
        method: 'put',
        data: articleModel
    })
}

// 删除文章
export const articleDeleteService = (articleId) => {
    return request({
        url: '/api/v1/article/delete',
        method: 'delete',
        params: {
            articleId
        }
    })
}