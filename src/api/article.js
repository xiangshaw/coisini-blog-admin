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