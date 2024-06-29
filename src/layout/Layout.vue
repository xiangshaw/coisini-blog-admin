<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom, Postcard, Memo, Compass, Odometer
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

// 获取用户信息
import {userInfoService} from '@/api/user'
import {useUserInfoStore} from "@/stores/userInfo";

const getUserInfo = async () => {
  // 调用接口
  const result = await userInfoService()
  // 存储用户信息到pinia
  useUserInfoStore().setInfo(result.data)
}
getUserInfo();

// 当dropDown条目被点击后，回调的函数
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from "element-plus";
import {useTokenStore} from "@/stores/token";

const router = useRouter()
const handleCommand = (command) => {
  if (command === 'logout') {
    //退出登录
    ElMessageBox.confirm(
        '您确认退出登录码？',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      // 退出登录
      useTokenStore().removeToken()
      useUserInfoStore().removeInfo()
      // 跳转到登录页面
      router.push('/login')
    })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消退出登录',
          })
        })
  } else {
    //路由
    router.push('/admin/' + command)
  }
}


</script>

<template>
  <!-- 容器 -->
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff"
               :default-active="$route.path" router>
        <el-menu-item index="/dashboard/index">
          <el-icon>
            <Odometer/>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/category/index">
          <el-icon>
            <Management/>
          </el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/index">
          <el-icon>
            <Promotion/>
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/menu/index">
          <el-icon>
            <Management/>
          </el-icon>
          <span>菜单管理</span>
        </el-menu-item>
        <el-sub-menu>
          <template #title>
            <el-icon>
              <UserFilled/>
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon>
              <User/>
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop/>
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/resetPassword">
            <el-icon>
              <EditPen/>
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/log/loginLog/index">
          <el-icon>
            <Memo/>
          </el-icon>
          <span>登录日志</span>
        </el-menu-item>
        <el-menu-item index="/log/operLog/index">
          <el-icon>
            <Postcard/>
          </el-icon>
          <span>操作日志</span>
        </el-menu-item>
        <el-menu-item index="/role/index">
          <el-icon>
            <Compass/>
          </el-icon>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/user/index">
          <el-icon>
            <Compass/>
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>用户：<strong>{{ useUserInfoStore().info.username }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="useUserInfoStore().info.avatar?useUserInfoStore().info.avatar:avatar"/>
                        <el-icon>
                            <CaretBottom/>
                        </el-icon>
                    </span>
          <template #dropdown>
            <!--下拉菜单-->
            <!--command：点击触发事件-->
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
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
      <el-footer>COISINIBLOG ©2023 Created by coisini</el-footer>
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