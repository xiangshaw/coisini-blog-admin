<script setup>

import {useTokenStore} from "@/stores/token";
import {useUserInfoStore} from "@/stores/userInfo";
</script>

<template>
  <el-card style="width: auto">
    <div>当前用户token: {{ useTokenStore().token }}</div>
  </el-card>

  <el-card style="max-width: 480px">
    已加入coisini技术探索{{ useUserInfoStore().info.period }}

    IP属地：{{ useUserInfoStore().info.loginIpCity }}
    用户总文章数：{{ useUserInfoStore().info.articleCount }}

  </el-card>

</template>
<style scoped lang="scss">

</style>