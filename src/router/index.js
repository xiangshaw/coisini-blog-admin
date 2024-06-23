// 导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import category from '@/views/category/index.vue'
import article from '@/views/article/index.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserAvatarVUe from '@/views/user/UserAvatar.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import MenuVue from '@/views/menu/index.vue'
import LoginLogVue from '@/views/log/loginLog/index.vue'
import OperLogVue from '@/views/log/operLog/index.vue'

// 定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        component: LayoutVue,
        // 重定向
        redirect: '/article/index',
        // 子路由
        children: [
            { path: '/category/index', component: category },
            { path: '/article/index', component: article },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVUe },
            { path: '/user/resetPassword', component: UserResetPasswordVue },
            { path: '/menu/index', component: MenuVue },
            { path: '/log/loginLog/index', component: LoginLogVue },
            { path: '/log/operLog/index', component: OperLogVue }

        ]
    }
]

// 创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router