<template>
  <!-- 如果有子菜单，显示 el-sub-menu -->
  <el-sub-menu v-if="hasChildren" :index="menu.path">
    <!-- 标题包含图标和文本 -->
    <template #title>
      <el-icon>
        <component :is="iconMap[menu.meta.icon] || Compass"/>
      </el-icon>
      <span>{{ menu.meta.title }}</span>
    </template>
    <!-- 递归渲染子菜单项 -->
    <MenuItem v-for="child in menu.children"
              :key="`${child.path}`"
              :menu="child"
              :icon-map="iconMap"
              :default-icon="Compass"/>
  </el-sub-menu>
  <!-- 如果没有子菜单，显示 el-menu-item -->
  <el-menu-item v-else :index="menu.path" @click="handleClick(`${menu.path}`)">
    <el-icon>
      <component :is="iconMap[menu.meta.icon] || Compass"/>
    </el-icon>
    <span>{{ menu.meta.title }}</span>
  </el-menu-item>
</template>

<script setup>
import {defineProps} from 'vue';
import {ElMenuItem, ElSubMenu, ElIcon} from 'element-plus';
import {Compass} from '@element-plus/icons-vue';

const props = defineProps({
  menu: Object,      // 传入的菜单对象
  iconMap: Object,   // 图标名称到组件的映射
  defaultIcon: {     // 默认图标组件
    type: Object,
    default: () => Compass
  }
});

// 检查菜单是否有子菜单
const hasChildren = props.menu.children && props.menu.children.length > 0;
const handleClick = (path) => {
  console.log('当下点击的路径是这个Clicked path:', path);
}
</script>
