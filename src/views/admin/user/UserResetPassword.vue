<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {userPasswordUpdateService} from '@/api/user'

// 表单数据
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const rules = {
  oldPassword: [
    {required: true, message: '请输入旧密码', trigger: 'blur'}
  ],
  newPassword: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, message: '密码长度不能小于6个字符', trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: '请确认新密码', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
}

// 获取表单的引用
const formRef = ref(null)
import {useUserInfoStore} from "@/stores/userInfo";
import {useTokenStore} from "@/stores/token";
import {useRouter} from "vue-router";
const router = useRouter()
// 提交密码表单
const passwordSubmit = async () => {
  const PasswordResult = await userPasswordUpdateService(passwordForm.value)
  ElMessage.success(PasswordResult.message ? PasswordResult.message : '修改密码成功')
  passwordFormReset()
  // 退出登录
  useTokenStore().removeToken()
  useUserInfoStore().removeInfo()
  // 跳转到登录页面
  await router.push('/login')
}
// 重置表单
const passwordFormReset = () => {
  formRef.value.resetFields();
}
</script>

<template>
  <el-card class="change-password-card">
    <template #header>
      <span>修改密码</span>
    </template>
    <el-form :model="passwordForm" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="passwordSubmit">提交</el-button>
        <el-button @click="passwordFormReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.change-password-card {
  width: 40%;
  margin: 50px auto;
}
</style>
