// 导入请求工具类
import request from '@/utils/request.js'
import {
    API_ARTICLE_ADD,
    API_ARTICLE_CATEGORY,
    API_ARTICLE_CATEGORY_ADD, API_ARTICLE_CATEGORY_BATCH_DELETE, API_ARTICLE_CATEGORY_DELETE,
    API_ARTICLE_CATEGORY_LIST,
    API_ARTICLE_CATEGORY_UPDATE, API_ARTICLE_DELETE, API_ARTICLE_LIST, API_ARTICLE_UPDATE
} from "@/components/api";

// 文章分类列表查询
export const articleCategoryListService = (categorySearchObj) => {
    return request({
        url: API_ARTICLE_CATEGORY_LIST,
        method: 'get',
        params: categorySearchObj
    })
}

// 获取文章分类
export const articleCategoryGetService = () => {
    return request({
        url: API_ARTICLE_CATEGORY,
        method: 'get',
    })
}

// 新增文章分类
export const articleCategoryAddService = (categoryModel) => {
    return request({
        url: API_ARTICLE_CATEGORY_ADD,
        method: 'post',
        data: categoryModel
    })
}

// 修改文章分类
export const articleCategoryUpdateService = (categoryModel) => {
    return request({
        url: API_ARTICLE_CATEGORY_UPDATE,
        method: 'put',
        data: categoryModel
    })
}

// 删除文章分类
export const articleCategoryDeleteService = (id) => {
    return request({
        url: API_ARTICLE_CATEGORY_DELETE,
        method: 'delete',
        params: {
            id
        }
    })
}

// 批量删除文章分类
export const articleCategoryBatchDeleteService = (ids) => {
    return request({
        url: API_ARTICLE_CATEGORY_BATCH_DELETE,
        method: 'delete',
        data: ids
    })
}

// 文章列表查询
export const articleListService = (articleSearchObj) => {
    return request({
        url: API_ARTICLE_LIST,
        method: 'get',
        params: articleSearchObj
    })
}

// 添加文章
export const articleAddService = (articleModel) => {
    return request({
        url: API_ARTICLE_ADD,
        method: 'post',
        data: articleModel
    })
    //return request.post('/api/v1/article/add', articleModel)
}

// 修改文章
export const articleUpdateService = (articleModel) => {
    return request({
        url: API_ARTICLE_UPDATE,
        method: 'put',
        data: articleModel
    })
}

// 删除文章
export const articleDeleteService = (articleId) => {
    return request({
        url: API_ARTICLE_DELETE,
        method: 'delete',
        params: {
            articleId
        }
    })
}