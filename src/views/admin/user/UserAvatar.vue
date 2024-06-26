<script setup>
import {Plus, Upload} from '@element-plus/icons-vue'
//获取el-upload元素
const uploadRef = ref()

// 读取用户信息
import {ref} from 'vue'
import {useUserInfoStore} from '@/stores/userInfo'

const userInfoStore = useUserInfoStore()
const imgUrl = ref(userInfoStore.info.avatar)
// 取token信息
import {useTokenStore} from '@/stores/token'

const tokenStore = useTokenStore()

// 图片上传成功回调
const uploadSuccess = (result) => {
  // 回显图片
  imgUrl.value = result.data
}

// 调用接口，更新头像url
import {userAvatarUpdateService} from '@/api/user'
import {ElMessage} from 'element-plus'

const updateAvatar = async () => {
  let result = await userAvatarUpdateService({avatar:imgUrl.value})
  ElMessage.success(result.message ? result.message : '修改成功')
  // 更新pinia中的数据
  userInfoStore.info.avatar = imgUrl.value
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>更换头像</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="true"
            action="/coisiniBlogApi/api/v1/file/admin/upload"
            name="file"
            :headers="{'Authorization':tokenStore.token}"
            :on-success="uploadSuccess"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar"/>
          <img v-else src="../../../assets/avatar.jpg" width="278"/>
        </el-upload>
        <br/>
        <el-button type="primary" :icon="Plus" size="large" @click="uploadRef.$el.querySelector('input').click()">
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep(.avatar) {
    width: 278px;
    height: 278px;
    display: block;
  }

  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 278px;
    height: 278px;
    text-align: center;
  }
}
</style>