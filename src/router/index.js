/*
// 导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/layout/Layout.vue'

import dashboard from '@/views/dashboard/index.vue'
import category from '@/views/admin/category/index.vue'
import article from '@/views/admin/article/index.vue'
import UserInfoVue from '@/views/admin/user/UserInfo.vue'
import UserAvatarVUe from '@/views/admin/user/UserAvatar.vue'
import UserResetPasswordVue from '@/views/admin/user/UserResetPassword.vue'
import MenuVue from '@/views/admin/menu/index.vue'
import LoginLogVue from '@/views/admin/loginLog/index.vue'
import OperLogVue from '@/views/admin/operLog/index.vue'
import RoleVue from '@/views/admin/role/index.vue'
import UserVue from '@/views/admin/user/index.vue'

// 定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        component: LayoutVue,
        // 重定向
        redirect: '/dashboard/index',
        // 子路由
        children: [
            { path: '/dashboard/index', component: dashboard },
            { path: '/category/index', component: category },
            { path: '/article/index', component: article },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVUe },
            { path: '/user/resetPassword', component: UserResetPasswordVue },
            { path: '/menu/index', component: MenuVue },
            { path: '/log/loginLog/index', component: LoginLogVue },
            { path: '/log/operLog/index', component: OperLogVue },
            { path: '/role/index', component: RoleVue },
            { path: '/user/index', component: UserVue }

        ]
    }
]

// 创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router
*/

import { createRouter, createWebHistory } from 'vue-router';
import { useTokenStore } from "@/stores/token";
import { useUserInfoStore } from "@/stores/userInfo";
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/layout/Layout.vue';
import { userInfoService } from "@/api/user";

// 初始化静态路由
const staticRoutes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        component: LayoutVue,
        redirect: '/dashboard/index',
        children: [
            {
                path: '/dashboard/index',
                component: () => import('@/views/dashboard/index.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes
});

// 批量导入视图组件
const viewModules = import.meta.glob('/src/views/**/*.vue');

// 动态加载视图组件
function loadView(viewPath) {
    // 如果 component 为 'Layout'，则跳过路径检查
    if (viewPath === 'Layout') {
        // 这里返回的就是你的主布局组件
        return LayoutVue;
    }
    // 获取相对于 src/views 的路径
    const fullPath = `/src/views/${viewPath}.vue`;
    // 检查路径是否存在
    if (viewModules[fullPath]) {
        return viewModules[fullPath];
    } else {
        // 处理路径不存在的情况，可以返回一个默认组件或者报错
        console.error(`Component not found: ${fullPath}`);
        return () => import('@/views/dashboard/index.vue');
    }
}

// 生成动态路由
function generateRoutes(menuList) {
    const routes = [];

    menuList.forEach(menu => {
        const route = {
            path: `/${menu.path}`,
            name: menu.name,
            component: loadView(menu.component),
            meta: {
                title: menu.meta.title,
                icon: menu.meta.icon
            },
            children: []
        };

        if (menu.children && menu.children.length > 0) {
            menu.children.forEach(child => {
                route.children.push({
                    path: `/${child.path}`,  // 将子路由的 path 改为相对于根路径
                    name: child.name,
                    component: loadView(child.component),
                    meta: {
                        title: child.meta.title,
                        icon: child.meta.icon
                    }
                });
                console.log("当前的childPath：" + child.path);
                console.log("当前的child.component：" + child.component);
                console.log("当前的loadView(child.component)：" + loadView(child.component));
            });
        }

        routes.push(route);
        console.log("当前获取到的route：" + JSON.stringify(route));
    });

    return routes;
}

// 路由守卫，用于动态添加路由
router.beforeEach(async (to, from, next) => {
    const tokenStore = useTokenStore();
    // 如果用户已登录，并且路由中没有动态添加过路由
    if (tokenStore.token && router.options.routes.length === 2) {
        try {
            const userInfoStore = useUserInfoStore();
            const userInfoResult = await userInfoService();
            userInfoStore.setInfo(userInfoResult.data);
            userInfoStore.setUserButton(userInfoResult.data.userButtonList);
            const userMenuList = userInfoResult.data.userMenuList;
            const dynamicRoutes = generateRoutes(userMenuList);
            // 动态添加路由
            dynamicRoutes.forEach(route => {
                router.addRoute(route);
            });
            // 完成添加后，跳转到首页或者当前路由
            if (to.path === '/login') {
                // 如果当前路径是登录页，则跳转到首页
                next('/');
            } else {
                // 否则继续跳转到目标路由
                next();
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            // 跳转到登录页重新登录
            // 清除token
            tokenStore.removeToken();
            // 清除用户信息
            useUserInfoStore().removeInfo();
            useUserInfoStore().removeUserButton();
            useUserInfoStore().removeUserMenu();
            next('/login');
        }
    } else {
        // 如果未登录或者已经添加过动态路由，则直接放行
        next();
    }
});

export default router;


