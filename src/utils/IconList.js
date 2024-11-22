// 导入所有图标
import * as Icons from '@element-plus/icons-vue';

// 动态生成图标列表
export const iconList = Object.keys(Icons).map((key) => ({
  name: key,
  component: Icons[key],
}));

// 获取图标组件的方法
export const getIcon = (name) => {
  const icon = iconList.find((icon) => icon.name === name);
  return icon ? icon.component : null;
};
