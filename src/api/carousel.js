// 导入请求工具
import request from '@/utils/request'
import {
    API_CAROUSEL_ADD,
    API_CAROUSEL_BATCH_DELETE,
    API_CAROUSEL_DELETE,
    API_CAROUSEL_LIST,
    API_CAROUSEL_UPDATE
} from "@/components/api";

// 获取轮播图分页列表
export const getCarouselList = (carouselSearchObj) => {
    return request({
        url: API_CAROUSEL_LIST,
        method: 'get',
        params: carouselSearchObj
    })
}

// 添加轮播图
export const addCarousel = (carousel) => {
    return request({
        url: API_CAROUSEL_ADD,
        method: 'post',
        data: carousel
    })
}

// 删除轮播图
export const removeById = (id) => {
    return request({
        url: API_CAROUSEL_DELETE + '/' + id,
        method: 'delete'
    })
}

// 更新轮播图
export const updateByCarousel = (carousel) => {
    return request({
        url: API_CAROUSEL_UPDATE,
        method: 'put',
        data: carousel
    })
}

// 批量删除轮播图
export const batchRemoveCarousel = (ids) => {
    return request({
        url: API_CAROUSEL_BATCH_DELETE,
        method: 'delete',
        data: ids
    })
}