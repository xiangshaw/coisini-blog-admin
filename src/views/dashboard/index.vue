<script setup>

import {useUserInfoStore} from "@/stores/userInfo";
</script>

<template>
  <el-card style="margin: 20px 30px 10px 30px">
    <el-row>
      <el-col :span="2">
        <el-avatar :size="80" :src="useUserInfoStore().info.avatar"/>
      </el-col>
      <el-col :span="20">
        <div style="display: flex; flex-direction: column;">
          <span style="align-self: flex-start;">
            {{ useUserInfoStore().info.nickName }}
          探索历程：<strong>{{ useUserInfoStore().info.period }}</strong>天
          </span>
          <div style="text-align: left;">
            <span><strong>{{ useUserInfoStore().info.visitCount }}</strong> 总访问量</span>
            <span style="color: #ccc;">|</span>
            <span><strong>{{ useUserInfoStore().info.articleCount }}</strong> 原创文章</span>
            <span style="color: #ccc;">|</span>
            <span><strong>{{ useUserInfoStore().info.likeCount }}</strong> 获赞</span>
            <span style="color: #ccc;">|</span>
            <span><strong>{{ useUserInfoStore().info.commentCount }}</strong> 评论</span>
            <span style="color: #ccc;">|</span>
            <span><strong>{{ useUserInfoStore().info.followerCount }}</strong> 收藏</span>
          </div>
          <span> IP属地：{{ useUserInfoStore().info.loginIpCity }}</span>
          <span>个人简介：{{ useUserInfoStore().info.description }}</span>
        </div>
      </el-col>
    </el-row>
  </el-card>


</template>
<style scoped lang="scss">

</style>