import router from "@/router";
// 导入 nprogress模块（进度条）
import NProgress from 'nprogress';
// 进度条样式
import 'nprogress/nprogress.css';
// 获取用户信息
import {userInfoService} from "@/api/user";
// 存储用户信息
import {useUserInfoStore} from "@/stores/userInfo"
// 获取token
import {useTokenStore} from "@/stores/token";
// 右上角螺旋加载提示
NProgress.configure({showSpinner: true});
// 白名单路由
export const whiteList = ['/login']
// 是否存在路由
let hasRoutes = false

/**
 * @description 路由守卫 https://router.vuejs.org/guide/advanced/navigation-guards.html
 * next(); 放行 ，未放行 走 router.beforeEach()
 */
router.beforeEach(async (to, from, next) => {
    // 开启进度条
    NProgress.start()
    // 获取token
    const tokenStore = useTokenStore();
    const userInfoStore = useUserInfoStore();
    // 白名单路由放行
    if (whiteList.includes(to.path)) {
        next();
    } else {
        const token = tokenStore.getToken();
        if (token) {
            if (!hasRoutes) {
                try {
                    // 获取用户信息
                    const result = await userInfoService();
                    // 获取菜单权限
                    const userMenuList = result.data.userMenuList;
                    // 动态添加路由

                    // 存储用户信息
                    userInfoStore.setInfo(result.data);
                    userInfoStore.setUserButton(result.data.userButtonList);
                    hasRoutes = true;
                    // 跳转路由 （replace: true 避免重复导航）
                    next({...to, replace: true});
                } catch (e) {
                    console.log("获取用户信息失败", e);
                    // 跳转登录页
                    next('/login');
                }
            } else {
                next();
            }
        } else {
            next('/login');
        }
    }
})


// 全局后置钩子
router.afterEach((to, from) => {
    // 关闭进度条
    NProgress.done()
})
