<script setup>
import { ElMenu, ElMenuItem } from 'element-plus';
import MenuItem from '@/components/MenuItem.vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  userMenu: {
    type: Array,
    required: true,
  },
  iconMap: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
</script>

<template>
  <div class="sidebar-menu">
    <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        text-color="#fff"
        :default-active="route.path"
        router
    >
      <!-- 静态菜单项 -->
      <el-menu-item index="/dashboard/index">
        <el-icon><DataAnalysis /></el-icon>
        首页
      </el-menu-item>

      <!-- 动态菜单项 -->
      <MenuItem
          v-for="menu in userMenu"
          :key="menu.path"
          :menu="menu"
          :icon-map="iconMap"
      />
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-menu .el-menu {
  border-right: none;
}
</style>
