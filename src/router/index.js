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
