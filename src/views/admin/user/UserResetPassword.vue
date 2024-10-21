<template>
  <el-card class="change-password-card" style="min-height: 330px">
    <template #header>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <el-button
            :type="isBindingPhone ? 'primary' : 'text'"
            @click="toggleForm('bindPhone')"
            style="border: none;"
        >
          绑定手机号
        </el-button>
        <el-button
            :type="isChangingPhone ? 'primary' : 'text'"
            @click="toggleForm('phone')"
            style="border: none;"
        >
          更改手机号
        </el-button>
        <el-button
            :type="isChangingPassword ? 'primary' : 'text'"
            @click="toggleForm('password')"
            style="border: none;"
        >
          更改密码
        </el-button>
      </div>
    </template>

    <el-form :model="isChangingPassword ? passwordForm : (newPhoneVisible ? newPhoneForm : phoneForm)"
             label-width="100px">
      <template v-if="isChangingPassword">
        <el-form-item label="旧密码">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" autocomplete="off"/>
          <span v-if="oldPasswordError" style="color: red;">{{ oldPasswordError }}</span>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" autocomplete="off"
                    @input="validateNewPassword"/>
          <span v-if="newPasswordError" style="color: red;">{{ newPasswordError }}</span>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" autocomplete="off"
                    @input="validateConfirmPassword"/>
          <span v-if="confirmPasswordError" style="color: red;">{{ confirmPasswordError }}</span>
        </el-form-item>
      </template>

      <template v-else-if="isChangingPhone">
        <el-form-item v-if="!newPhoneVisible" label="手机号" prop="phone">
          <el-input v-model="phoneForm.phone" @input="validatePhone" placeholder="请输入手机号"/>
          <span v-if="phoneError" style="color: red;">{{ phoneError }}</span>
        </el-form-item>

        <el-form-item v-if="newPhoneVisible" label="新手机号" prop="newPhone">
          <el-input v-model="newPhoneForm.newPhone" @input="validateNewPhone" placeholder="请输入新手机号"/>
          <span v-if="newPhoneError" style="color: red;">{{ newPhoneError }}</span>
        </el-form-item>

        <el-form-item label="验证码" prop="confirmCode" v-if="!newPhoneVisible"
                      style="display: flex; align-items: center;">
          <el-input v-model="phoneForm.confirmCode" placeholder="请输入验证码" style="flex: 1;"/>
          <el-button @click="sendConfirmCode" :disabled="!canSendCode" size="mini" style="margin-left: 10px;">
            {{ isSendingCode ? countdown + '秒' : '发送验证码' }}
          </el-button>
        </el-form-item>

        <el-form-item label="验证码" prop="newConfirmCode" v-if="newPhoneVisible"
                      style="display: flex; align-items: center;">
          <el-input v-model="newPhoneForm.newConfirmCode" placeholder="请输入验证码" style="flex: 1;"/>
          <el-button @click="sendNewPhoneConfirmCode" :disabled="!canSendCode" size="mini" style="margin-left: 10px;">
            {{ isSendingCode ? countdown + '秒' : '发送验证码' }}
          </el-button>
        </el-form-item>
      </template>

      <template v-else-if="isBindingPhone">
        <el-form-item v-if="userInfoStore.info.phone" label="已绑定：">
          <span>{{ userInfoStore.info.phone ? userInfoStore.info.phone : '尚未绑定手机号' }}</span>
        </el-form-item>
        <el-form-item label="绑定手机号" v-if="!userInfoStore.info.phone">
          <el-input v-model="bindPhoneForm.bindPhone" @input="validateBindPhone" placeholder="请输入绑定手机号"/>
          <span v-if="bindPhoneError" style="color: red;">{{ bindPhoneError }}</span>
        </el-form-item>
        <el-form-item label="验证码" v-if="!userInfoStore.info.phone" style="display: flex; align-items: center;">
          <el-input v-model="bindPhoneForm.bindConfirmCode" placeholder="请输入验证码" style="flex: 1;"/>
          <el-button @click="sendBindPhoneConfirmCode" :disabled="!canSendBindCode" size="mini"
                     style="margin-left: 10px;">
            {{ isSendingCode ? countdown + '秒' : '发送验证码' }}
          </el-button>
        </el-form-item>
      </template>

      <el-form-item v-if="isChangingPassword || isChangingPhone || !userInfoStore.info.phone">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import {ref, computed} from 'vue'
import {userPasswordUpdateService, sendSmsCodeService, bindPhoneService} from '@/api/user'
import {ElMessage} from "element-plus";
import {useUserInfoStore} from "@/stores/userInfo";

const userInfoStore = useUserInfoStore();

// 表单数据
const passwordForm = ref({oldPassword: '', newPassword: '', confirmPassword: ''});
const phoneForm = ref({phone: '', confirmCode: ''});
const newPhoneForm = ref({newPhone: '', newConfirmCode: ''})
const bindPhoneForm = ref({bindPhone: '', bindConfirmCode: ''});
const sendSmsData = ref({mode: '', smsType: ''});


// 错误提示信息
const oldPasswordError = ref('');
const newPasswordError = ref('');
const confirmPasswordError = ref('');
const phoneError = ref('');
const newPhoneError = ref('');
const bindPhoneError = ref('');

// 控制显示的表单
// 新手机号框是否可见
const newPhoneVisible = ref(false);
const isChangingPassword = ref(true);

const isChangingPhone = ref(false);
const isBindingPhone = ref(false);
const isSendingCode = ref(false);
const countdown = ref(60);

// 计算属性：判断是否可以发送验证码
const canSendCode = computed(() => {
  const currentForm = isBindingPhone.value ? bindPhoneForm.value : (isChangingPhone.value ? phoneForm.value : {});
  return currentForm.phone && /^[1][3-9][0-9]{9}$/.test(currentForm.phone) && !isSendingCode.value;
});
// 计算属性：判断是否可以发送绑定手机号验证码
const canSendBindCode = computed(() => {
  return bindPhoneForm.value.bindPhone && /^[1][3-9][0-9]{9}$/.test(bindPhoneForm.value.bindPhone) && !isSendingCode.value;
});

// 切换表单
const toggleForm = (formType) => {
  isChangingPassword.value = formType === 'password';
  isChangingPhone.value = formType === 'phone';
  isBindingPhone.value = formType === 'bindPhone';
  resetForm();
  // 切换到密码时隐藏新手机号输入框
  newPhoneVisible.value = false;
  // 重置状态以避免意外发送验证码
  isSendingCode.value = false;
  // 重置倒计时
  countdown.value = 60;
};

// 验证密码
const validateNewPassword = () => {
  if (!passwordForm.value.newPassword) {
    newPasswordError.value = '新密码不能为空';
  } else if (passwordForm.value.newPassword.length < 6) {
    newPasswordError.value = '密码长度不能小于6个字符';
  } else {
    newPasswordError.value = '';
  }
};

const validateConfirmPassword = () => {
  if (passwordForm.value.confirmPassword !== passwordForm.value.newPassword) {
    confirmPasswordError.value = '两次输入密码不一致';
  } else {
    confirmPasswordError.value = '';
  }
};

// 验证手机号
const validatePhone = () => {
  if (!phoneForm.value.phone) {
    phoneError.value = '手机号不能为空';
  } else if (!/^[1][3-9][0-9]{9}$/.test(phoneForm.value.phone)) {
    phoneError.value = '手机号格式不正确';
  } else {
    phoneError.value = '';
  }
};

// 验证绑定手机号
const validateBindPhone = () => {
  if (!bindPhoneForm.value.bindPhone) {
    bindPhoneError.value = '绑定手机号不能为空';
  } else if (!/^[1][3-9][0-9]{9}$/.test(bindPhoneForm.value.bindPhone)) {
    bindPhoneError.value = '绑定手机号格式不正确';
  } else {
    bindPhoneError.value = '';
  }
};
// 验证新手机号
const validateNewPhone = () => {
  if (!newPhoneForm.value.newPhone) {
    newPhoneError.value = '新手机号不能为空';
  } else if (!/^[1][3-9][0-9]{9}$/.test(newPhoneForm.value.newPhone)) {
    newPhoneError.value = '新手机号格式不正确';
  } else {
    newPhoneError.value = '';
  }
}
// 发送验证码
const sendConfirmCode = async () => {
  sendSmsData.value.mode = phoneForm.value.phone
  sendSmsData.value.smsType = 'MOBILE'
  await sendSmsCodeService(sendSmsData.value)
  // 启动倒计时
  startCountdown();
};

const sendNewPhoneConfirmCode = async () => {
  sendSmsData.value.mode = newPhoneForm.value.newPhone;
  sendSmsData.value.smsType = 'MOBILE';
  isSendingCode.value = true;
  await sendSmsCodeService(sendSmsData.value);
  startCountdown();
};

const sendBindPhoneConfirmCode = async () => {
  sendSmsData.value.mode = bindPhoneForm.value.bindPhone
  sendSmsData.value.smsType = 'MOBILE'
  await sendSmsCodeService(sendSmsData.value);
  startCountdown();
};

// 启动倒计时
const startCountdown = () => {
  // 重置倒计时
  countdown.value = 60;
  // 开始时设置为 true
  isSendingCode.value = true;
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
      // 结束时设置为 false
      isSendingCode.value = false;
    }
  }, 1000);
};


// 提交表单
const submitForm = async () => {
  if (isChangingPassword.value) {
    await userPasswordUpdateService(passwordForm.value);
    ElMessage.success('密码修改成功');
    resetForm();
  } else if (isBindingPhone.value) {
    await bindPhoneService(bindPhoneForm.value);
    ElMessage.success('手机号绑定成功');
    resetForm();
  } else if (newPhoneVisible.value) {
    // 提交的是新手机号的数据
    await userPasswordUpdateService(newPhoneForm.value);
    ElMessage.success('新手机号修改成功');
    // 隐藏新手机号输入框
    newPhoneVisible.value = false;
    // 确保切换回手机号表单
    isChangingPhone.value = false;
    resetForm();
  } else {
    await userPasswordUpdateService(phoneForm.value);
    // 切换到新手机号表单
    newPhoneVisible.value = true;
    ElMessage.success('手机号验证成功');
    resetForm();
  }
};


// 重置表单
const resetForm = () => {
  if (isChangingPassword.value) {
    resetPasswordForm();
  } else if (isChangingPhone.value) {
    resetPhoneForm();
  } else if (isChangingPassword.value) {
    resetNewPhoneForm();
  } else if (isBindingPhone.value) {
    resetBindPhoneForm();
  }
};

const resetPasswordForm = () => {
  passwordForm.value = {oldPassword: '', newPassword: '', confirmPassword: ''};
  oldPasswordError.value = '';
  newPasswordError.value = '';
  confirmPasswordError.value = '';
};

const resetPhoneForm = () => {
  phoneForm.value = {phone: '', confirmCode: ''};
  phoneError.value = '';
};

const resetNewPhoneForm = () => {
  newPhoneForm.value = {newPhone: '', newConfirmCode: ''};
  newPhoneError.value = '';
};

const resetBindPhoneForm = () => {
  bindPhoneForm.value = {bindPhone: '', bindConfirmCode: ''};
  bindPhoneError.value = '';
};

</script>

<style scoped>
.change-password-card {
  width: 40%;
  margin: 50px auto;
}
</style>
