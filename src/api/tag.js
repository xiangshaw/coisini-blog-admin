// 导入请求工具类
import request from '@/utils/request.js'
import {
    API_ALL_TAG,
    API_TAG_ADD,
    API_TAG_BATCH_DELETE,
    API_TAG_DELETE,
    API_TAG_LIST,
    API_TAG_UPDATE
} from "@/components/api";

// 标签列表查询
export const tagListService = (tagSearchObj) => {
    return request({
        url: API_TAG_LIST,
        method: 'get',
        params: tagSearchObj
    })
}

// 发布文章获取标签列表
export const getTagAllService = () => {
    return request({
        url: API_ALL_TAG,
        method: 'get'
    })
}

// 新增标签
export const tagAddService = (tagModel) => {
    return request({
        url: API_TAG_ADD,
        method: 'post',
        data: tagModel
    })
}

// 修改标签
export const tagUpdateService = (tagModel) => {
    return request({
        url: API_TAG_UPDATE,
        method: 'put',
        data: tagModel
    })
}

// 删除标签
export const tagDeleteService = (id) => {
    return request({
        url: API_TAG_DELETE,
        method: 'delete',
        params: {
            id
        }
    })
}

// 批量删除标签
export const tagBatchDeleteService = (ids) => {
    return request({
        url: API_TAG_BATCH_DELETE,
        method: 'delete',
        data: ids
    })
}