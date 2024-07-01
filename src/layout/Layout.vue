<script setup>
import {iconList,getIcon} from "@/utils/IconList";
import avatar from '@/assets/default.png';
// 动态生成 iconMap
const iconMap = iconList.reduce((map, icon) => {
  map[icon.name] = icon.component;
  return map;
}, {});

// 获取用户信息
import {userInfoService} from '@/api/user';
import {useUserInfoStore} from "@/stores/userInfo";
import MenuItem from '@/components/MenuItem.vue';

const getUserInfo = async () => {
  const result = await userInfoService();
  useUserInfoStore().setInfo(result.data);
  useUserInfoStore().setUserMenu(result.data.userMenuList);
}
getUserInfo();

// 当dropDown条目被点击后，回调的函数
import {useRouter} from 'vue-router';
import {ElMessage, ElMessageBox} from "element-plus";
import {useTokenStore} from "@/stores/token";

const router = useRouter();
const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm(
        '您确认退出登录吗？',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      useTokenStore().removeToken();
      useUserInfoStore().removeInfo();
      router.push('/login');
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消退出登录',
      });
    });
  } else {
    router.push('/user/' + command);
  }
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <!--LOGO-->
      <div class="el-aside__logo"></div>
      <!--设置菜单项被激活时的文本颜色、
      菜单的背景色、
      菜单项的文本颜色、
      动态绑定菜单的默认激活项为当前路由路径，保持菜单项的同步高亮显示-->
      <el-menu
          active-text-color="#ffd04b"
          background-color="#232323"
          text-color="#fff"
          :default-active="$route.path"
          router
      >
        <!--
        使用自定义的 MenuItem 组件来循环渲染用户菜单列表、
        使用菜单路径来确保唯一性、
        将当前循环的菜单项对象 menu 传递给 MenuItem 组件，用于动态渲染菜单内容、
        将图标映射表 iconMap 传递给 MenuItem 组件，以便根据菜单配置显示对应的图标
        -->
        <MenuItem
            v-for="menu in useUserInfoStore().userMenu"
            :key="menu.path"
            :menu="menu"
            :icon-map="iconMap"
        />
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>用户：<strong>{{ useUserInfoStore().info.username }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="useUserInfoStore().info.avatar ? useUserInfoStore().info.avatar : avatar"/>
            <el-icon>
              <CaretBottom/>
            </el-icon>
          </span>
          <template #dropdown>
            <!--下拉菜单-->
            <el-dropdown-menu>
              <el-dropdown-item command="UserInfo" :icon="getIcon('User')">基本资料</el-dropdown-item>
              <el-dropdown-item command="UserAvatar" :icon="getIcon('Crop')">更换头像</el-dropdown-item>
              <el-dropdown-item command="UserResetPassword" :icon="getIcon('EditPen')">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="getIcon('SwitchButton')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <div>
          <router-view></router-view>
        </div>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>COISINIBLOG ©2024 Created by coisini</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
