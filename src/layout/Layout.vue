<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside class="sidebar">
      <Logo/>
      <SidebarMenu :user-menu="useUserInfoStore().userMenu" :icon-map="iconMap"/>
    </el-aside>

    <!-- 主区域 -->
    <el-container class="main-container">
      <!-- 头部区域 -->
      <el-header class="header">
        <HeaderBar/>
      </el-header>
      <!-- 中间区域 -->
      <el-main class="main-content">
        <MainContent/>
      </el-main>
      <!-- 底部区域 -->
      <el-footer class="footer">
        <FooterBar/>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import Logo from '@/layout/components/Logo.vue';
import SidebarMenu from '@/layout//components/SidebarMenu.vue';
import HeaderBar from '@/layout//components/HeaderBar.vue';
import FooterBar from '@/layout//components/FooterBar.vue';
import MainContent from '@/layout//components/MainContent.vue';
import {iconList} from '@/utils/IconList';
import {useUserInfoStore} from "@/stores/userInfo";

const iconMap = iconList.reduce((map, icon) => {
  map[icon.name] = icon.component;
  return map;
}, {});
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  background-color: #f5f5f5;
}


/* 左侧菜单 */
.sidebar {
  width: 240px;
  background-color: #1f1f1f;
  color: #fff;
  flex-direction: column;
  justify-content: space-between;

  .el-menu {
    border: none;
    font-size: 14px;

    .el-menu-item {
      padding: 12px 20px;

      &.is-active {
        background-color: #ffd04b !important;
        color: #1f1f1f !important;
      }

      &:hover {
        background-color: #333;
      }

      .el-icon {
        margin-right: 8px;
      }
    }
  }
}

/* 头部 */
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-bar {
    display: flex;
    align-items: center;
  }

  .el-dropdown__box {
    cursor: pointer;

    .el-icon {
      color: #999;
      margin-left: 8px;
    }

    &:hover .el-icon {
      color: #ffd04b;
    }
  }
}

/* 中间内容区域 */
.main-content {
  padding: 0.5px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 减去头部和底部高度 */
  height: calc(100vh - 120px);
  overflow-y: auto;
}

/* 底部 */
.footer {
  height: 50px;
  background-color: #fff;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  color: #eee;
}
</style>