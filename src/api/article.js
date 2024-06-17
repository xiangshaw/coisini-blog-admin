// 导入请求工具类
import request from '@/utils/request.js'
// 获取token状态
import {useTokenStore} from '@/stores/token.js'
// 文章分类列表查询
export const articleCategoryListService = (categorySearchObj) => {
    return request({
        url: '/api/v1/category/list',
        // 添加请求头（pinia中获取响应式变量不需要.value）
        headers: {'Authorization': useTokenStore().token},
        method: 'get',
        params: categorySearchObj
    })
}