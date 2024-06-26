import router from "@/router/index";

// 白名单路由
export const whiteList = ['/login']
// 是否存在路由
let hasRoutes = false

/**
 * @description 路由守卫 https://router.vuejs.org/guide/advanced/navigation-guards.html
 * next(); 放行 ，未放行 走 router.beforeEach()
 */
router.beforeEach(async (to, from, next) => {
next()
})

// 全局后置钩子
router.afterEach((to, from) => {
    // console.log('全局后置钩子')
})