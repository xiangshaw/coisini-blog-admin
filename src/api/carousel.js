// 导入请求工具
import request from '@/utils/request'

// 获取轮播图分页列表
export const getCarouselList = (carouselSearchObj) => {
    return request({
        url: `/api/v1/carousel/list`,
        method: 'get',
        params: carouselSearchObj
    })
}

// 添加轮播图
export const addCarousel = (carousel) => {
    return request({
        url: `/api/v1/carousel/add`,
        method: 'post',
        data: carousel
    })
}

// 删除轮播图
export const removeById = (id) => {
    return request({
        url: `/api/v1/carousel/remove/${id}`,
        method: 'delete'
    })
}

// 更新轮播图
export const updateByCarousel = (carousel) => {
    return request({
        url: `/api/v1/carousel/update`,
        method: 'put',
        data: carousel
    })
}

// 批量删除轮播图
export const batchRemoveCarousel = (ids) => {
    return request({
        url: `/api/v1/carousel/batchRemove`,
        method: 'delete',
        data: ids
    })
}