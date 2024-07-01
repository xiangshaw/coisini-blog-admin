import {defineStore} from "pinia"
import {ref} from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
    // 1.定义用户信息
    const info = ref({})

    // 1.1.定义修改用户信息的方法
    const setInfo = (newInfo) => {
        info.value = newInfo
    }
    // 1.2.定义清空用户信息的方法
    const removeInfo = () => {
        info.value = {}
    }

    // 2.定义用户按钮权限
    const userButton = ref([])
    // 2.1.定义修改用户按钮权限的方法
    const setUserButton = (newUserButton) => {
        userButton.value = newUserButton
    }
    // 2.2.定义清空用户按钮权限的方法
    const removeUserButton = () => {
        userButton.value = []
    }

    // 3.定义用户菜单权限
    const userMenu = ref([])
    // 3.1.定义修改用户菜单权限的方法
    const setUserMenu = (newUserMenu) => {
        userMenu.value = newUserMenu
    }
    // 3.2.定义清空用户菜单权限的方法
    const removeUserMenu = () => {
        userMenu.value = []
    }

    // 4. 定义路由是否加载
    const routeState  = {routesLoaded: false}
    // 4.1.定义修改路由是否加载的方法
    const setRoutesLoaded = (newRoutesLoaded) => {
        routeState.routesLoaded = newRoutesLoaded
    }

    return {
        info, setInfo, removeInfo,
        userButton, setUserButton, removeUserButton,
        userMenu, setUserMenu, removeUserMenu,
        routeState, setRoutesLoaded
    }
}, {
    persist: true
})