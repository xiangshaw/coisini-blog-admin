<template>
  <div class="logo" :style="{ backgroundImage: `url(${logo})` }">
  </div>
</template>

<script setup>
import logo from '@/assets/logo.png';
</script>

<style scoped>
.logo {
  height: 100px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 120px auto;
}
</style>
