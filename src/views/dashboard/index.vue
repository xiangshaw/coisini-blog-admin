<script setup>

import {useTokenStore} from "../../stores/token";
</script>

<template>
  <div>
    当前用户token:
    {{ useTokenStore().token }}
  </div>
</template>

<style scoped lang="scss">

</style>