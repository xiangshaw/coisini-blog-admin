<script setup>
import { ref } from 'vue'

const rules = {
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}
import { useUserInfoStore } from '@/stores/userInfo';
const userInfo = ref({...useUserInfoStore().info})
console.log("用户菜单权限：" + JSON.stringify(useUserInfoStore().info.userMenuList))
console.log("用户按钮权限：" + useUserInfoStore().info.userButtonList)
// 修改用户信息
import {userInfoUpdateService} from '@/api/user.js'
import { ElMessage } from 'element-plus';
const updateUserInfo = async ()=>{
  let result = await userInfoUpdateService(userInfo.value)
  ElMessage.success(result.message? result.message:'修改成功')
  // 更新pinia中的数据
  useUserInfoStore().info.nickName=userInfo.value.nickName
  useUserInfoStore().info.description=userInfo.value.description
  useUserInfoStore().info.email = userInfo.value.email
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="userInfo.nickName"></el-input>
          </el-form-item>
          <el-form-item label="个性签名" prop="description">
            <el-input v-model="userInfo.description"
                      style="width: 100%"
                      :rows="2"
                      type="textarea"
                      placeholder="输入个性签名"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>