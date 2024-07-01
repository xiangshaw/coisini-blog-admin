import {createRouter, createWebHistory} from 'vue-router';
import {useTokenStore} from "@/stores/token";
import {useUserInfoStore} from "@/stores/userInfo";
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/layout/Layout.vue';
import {userInfoService} from "@/api/user";
// 导入 NProgress模块（进度条）
import NProgress from 'nprogress';
// 进度条样式 右上角圈圈
import 'nprogress/nprogress.css';

// 初始化静态路由
const staticRoutes = [
    {
        path: '/login',
        component: LoginVue,
        meta: {
            title: '登录',
            icon: 'login'
        }
    },
    {
        path: '/',
        component: LayoutVue,
        redirect: 'dashboard/index',
        children: [
            {
                path: 'dashboard/index',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: '首页',
                    icon: 'PieChart'
                },
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
    if (viewPath === 'Layout' || viewPath === 'ParentView') {
        return LayoutVue;
    }
    const fullPath = `/src/views/${viewPath}.vue`;
    if (viewModules[fullPath]) {
        return viewModules[fullPath];
    } else {
        console.error(`Component not found: ${fullPath}`);
        return () => import('@/views/dashboard/index.vue');
    }
}

// 生成动态路由
function generateRoutes(menuList) {
    const routes = [];
    // 添加静态路由
    staticRoutes.forEach(route => {
        routes.push({
            path: route.path,
            name: route.name,
            component: route.component,
            meta: route.meta,
            // 如果有子路由，也要添加进来
            children: route.children
        });
    });

    // 添加动态
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
                    path: `${child.path}`,
                    name: child.name,
                    component: loadView(child.component),
                    meta: {
                        title: child.meta.title,
                        icon: child.meta.icon
                    }
                });
            });
        }
        routes.push(route);
    });

    return routes;
}

// 路由守卫，用于动态添加路由
router.beforeEach(async (to, from, next) => {
    // 开启进度条
    NProgress.start()
    const tokenStore = useTokenStore();
    const userInfoStore = useUserInfoStore();

    if (tokenStore.token && !userInfoStore.routeState.routesLoaded) {
        try {
            const userInfoResult = await userInfoService();
            userInfoStore.setInfo(userInfoResult.data);
            userInfoStore.setUserButton(userInfoResult.data.userButtonList);
            const userMenuList = userInfoResult.data.userMenuList;
            const dynamicRoutes = generateRoutes(userMenuList);
            dynamicRoutes.forEach(route => {
                router.addRoute(route);
            });
            userInfoStore.setRoutesLoaded(true);
            // 避免无限循环
            if (to.matched.length === 0) {
                next({...to, replace: true});
            } else {
                next();
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            tokenStore.removeToken();
            userInfoStore.removeInfo();
            userInfoStore.removeUserButton();
            userInfoStore.removeUserMenu();
            userInfoStore.setRoutesLoaded(false);
            next('/login');
        }
    } else {
        next();
    }
});

// 全局后置钩子
router.afterEach((to, from) => {
    // 关闭进度条
    NProgress.done()
})
export default router;

