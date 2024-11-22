<script setup>
import avatar from '@/assets/default.png';
import {ElDropdown, ElAvatar, ElMessageBox, ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
import {useUserInfoStore} from '@/stores/userInfo';
import {useTokenStore} from '@/stores/token';
import {getIcon} from '@/utils/IconList';

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
    )
        .then(() => {
          useTokenStore().removeToken();
          useUserInfoStore().removeInfo();
          router.push('/login');
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消退出登录',
          });
        });
  } else {
    router.push(command);
  }
};
</script>

<template>
  <div class="header-bar">
    <div class="header-left">
      用户：<strong>{{ useUserInfoStore().info.username }}</strong>
    </div>
    <div class="header-right">
      <el-dropdown placement="bottom-end" @command="handleCommand">
      <span class="el-dropdown__box">
        <el-avatar :src="useUserInfoStore().info.avatar || avatar" />
        <el-icon><CaretBottom /></el-icon>
      </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="/UserInfo" :icon="getIcon('User')">基本资料</el-dropdown-item>
            <el-dropdown-item command="/UserAvatar" :icon="getIcon('Avatar')">更换头像</el-dropdown-item>
            <el-dropdown-item command="/UserResetPassword" :icon="getIcon('EditPen')">重置密码</el-dropdown-item>
            <el-dropdown-item command="logout" :icon="getIcon('SwitchButton')">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header-bar {
  width: 100%;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .header-left {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .header-right {
    display: flex;
    align-items: center;

    .el-dropdown__box {
      display: flex;
      align-items: center;
      cursor: pointer;

      .el-avatar {
        margin-right: 10px;
      }

      .el-icon {
        color: #999;
      }

      &:hover .el-icon {
        /* 悬浮时图标颜色变化 */
        color: #ffd04b;
      }
    }
  }
}
</style>

