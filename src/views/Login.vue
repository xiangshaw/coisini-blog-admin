<script setup>
import {ref, onMounted} from 'vue'
import {User, Lock, ChatLineSquare} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {getCodeService, userLoginService, userRegisterService} from '@/api/user'

// 切换注册与登录表单，默认是注册
const switchLoginRegister = ref(false)

// 定义数据模型
const registerData = ref({
  username: '',
  password: '',
  rePassword: '',
  captcha: '',
  uuid: ''
})

// 定义验证码图片的响应式变量
const captchaSrc = ref('')

// 获取验证码的函数
const getCode = async () => {
  try {
    const response = await getCodeService()
    if (response.code === 200) {
      captchaSrc.value = 'data:image/png;base64,' + response.data.captcha
      registerData.value.uuid = response.data.uuid
    } else {
      ElMessage.error(response.message)
    }
  } catch (error) {
    ElMessage.error('获取验证码失败')
  }
}

// 页面加载时获取验证码
onMounted(() => {
  getCode()
})

// 密码校验函数
const checkPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerData.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 定义表单规则
const rules = ref({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
  ],
  rePassword: [
    {validator: checkPassword, trigger: 'blur'},
  ],
  captcha: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ]
})

// 注册功能
const register = async () => {
  let result = await userRegisterService(registerData.value)
  ElMessage.success(result.message ? result.message : '注册成功')
}

// 导入路由
import { useRouter } from "vue-router"
// 导入token状态
import { useTokenStore } from "@/stores/token"
// 获取token状态
const tokenStore = useTokenStore();
// 登录功能
const router = useRouter();
const login = async () => {
  // 登录
  let result = await userLoginService(registerData.value)
  // 提示信息
  ElMessage.success(result.message ? result.message : '登录成功')
  // 设置token
  tokenStore.setToken(result.data.token)
  // 跳转首页
  await router.push('/')
}

// 清空表单
const clearData = () => {
  registerData.value = {
    username: '',
    password: '',
    rePassword: '',
    captcha: '',
    uuid: ''
  }
}

</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 :model 绑定数据表单 :rules 校验规则-->
      <el-form ref="form" size="large" autocomplete="off" v-if="switchLoginRegister" :model="registerData"
               :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                    v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码"
                    v-model="registerData.rePassword"></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input placeholder="请输入验证码" :prefix-icon="ChatLineSquare"
                      v-model="registerData.captcha"></el-input>
            <el-image v-if="captchaSrc" :src="captchaSrc" alt="验证码" class="captcha-image" @click="getCode"/>
          </div>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" @click="register">注册</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="switchLoginRegister = false;clearData()">← 返回</el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                    v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input placeholder="请输入验证码" :prefix-icon="ChatLineSquare"
                      v-model="registerData.captcha"></el-input>
            <el-image v-if="captchaSrc" :src="captchaSrc" alt="验证码" class="captcha-image" @click="getCode"/>
          </div>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="switchLoginRegister = true;clearData()">注册 →</el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
    url('@/assets/login_bg.png') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }

  .captcha-container {
    display: flex;
    align-items: center;

    el-input {
      // 占据剩余空间
      flex: 1;
    }

    .captcha-image {
      margin-left: 10px;
      cursor: pointer;
      width: 210px;
      height: 40px;
    }
  }
}
</style>
