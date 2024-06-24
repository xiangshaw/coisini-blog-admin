<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>角色管理</span>
        <div class="extra">
          <!-- 搜索表单 -->
          <el-form inline>
            <el-col>
              <el-form-item label="角色名称：">
                <el-input
                    v-model="roleSearchObj.roleName"
                    :prefix-icon="Search"
                    placeholder="请输入角色名称搜索"
                    @keyup.enter.native="getRole"
                    style="width: 100%"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getRole">搜索</el-button>
                <el-button type="info" @click="resetRoleSearch">重置</el-button>
                <el-button type="danger" @click="batchDeleteRoles" :disabled="selectedRole.length === 0">批量删除
                </el-button>
                <el-button type="primary" @click="openRoleDialog('add')">添加角色</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </template>

    <!-- 角色列表 -->
    <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-svg="svg"
        class="custom-loading-svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="roles" style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="角色名称" width="150" prop="roleName"></el-table-column>
      <el-table-column label="角色编码" prop="roleCode"></el-table-column>
      <el-table-column label="角色描述" prop="description"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" size="small"
                     @click="openRoleDialog('edit', row)"></el-button>
          <el-button :icon="Tickets" circle plain type="primary" size="small"
                     @click="showAssignAuths(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" size="small"
                     @click="confirmDeleteRole(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        layout="jumper, total, sizes, prev, pager, next"
        :current-page="roleSearchObj.current"
        :page-size="roleSearchObj.limit"
        :page-sizes="[5, 10, 50, 100]"
        background
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加/编辑角色弹窗 -->
    <el-dialog v-model="roleDialogVisible" :title="dialogTitle" @close="resetRoleForm">
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="请输入角色编码"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input type="textarea" v-model="roleForm.description" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">{{ dialogAction === 'add' ? '添加' : '保存' }}</el-button>
      </template>
    </el-dialog>

    <!--分配菜单权限-->
    <el-dialog v-model="assignDialogVisible" title="分配权限" width="600px">
      <div>角色名称：{{ currentRole.roleName }}</div>
      <transition name="fade">
        <el-tree
            ref="assignTree"
            :data="sysMenuList"
            node-key="id"
            show-checkbox
            default-expand-all
            :props="treeProps">
        </el-tree>
      </transition>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Search, Edit, Tickets} from '@element-plus/icons-vue';
import {getRoleList, deleteRole, batchDeleteRole, addRole, updateRole} from '@/api/role';
import {doAssign, toAssign} from "@/api/menu";

// 初始化loading
const loading = ref(true);
const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`;

// 角色数据模型
const roles = ref([]);

// 初始化搜索条件
const roleSearchObj = ref({
  current: 1,
  limit: 10,
  roleName: '',
});
/**
 * 获取角色列表
 */
const getRole = async () => {
  loading.value = true;
  let result = await getRoleList(roleSearchObj.value);
  roles.value = result.data.records;
  total.value = result.data.total;
  loading.value = false;
};

// 页面初始化时加载
onMounted(() => {
  getRole();
});

// 清空搜索条件
const resetRoleSearch = () => {
  roleSearchObj.value = {
    current: 1,
    limit: 10,
    roleName: '',
  };
  getRole();
};

// 初始化总条数
const total = ref(0);

// 处理分页变化
const handlePageChange = (page) => {
  roleSearchObj.value.current = page;
  getRole();
};

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  roleSearchObj.value.limit = size;
  getRole();
};

// 删除
const confirmDeleteRole = (row) => {
  ElMessageBox.confirm(
      '你确认删除该角色吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 用户点击了确认
        let result = await deleteRole(row.id);
        ElMessage.success(result.message ? result.message : '删除成功');
        // 获取所有角色
        await getRole();
      })
      .catch(() => {
        // 用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        });
      });
};

// 用于存储选中的角色
const selectedRole = ref([]);

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedRole.value = selection;
};

// 批量删除
const batchDeleteRoles = async () => {
  if (selectedRole.value.length === 0) {
    ElMessage.warning('请选择要删除的角色');
    return;
  }
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRole.value.length} 个角色吗？`,
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    const ids = selectedRole.value.map(item => item.id);
    try {
      // 传输格式 ["7197787510292930560", "7196281315379937280"]
      const result = await batchDeleteRole(ids);
      ElMessage.success(result.message ? result.message : '删除成功');
      await getRole();
    } catch (error) {
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
};

// 添加/编辑角色对话框
const roleDialogVisible = ref(false);
const roleForm = ref({
  id: '',
  roleName: '',
  roleCode: '',
  description: ''
});
const roleFormRef = ref(null);
// 'add' 或 'edit'
const dialogAction = ref('');
const dialogTitle = ref('');

// 打开添加/编辑角色对话框
const openRoleDialog = (action, row = null) => {
  dialogAction.value = action;
  dialogTitle.value = action === 'add' ? '添加角色' : '编辑角色';
  if (action === 'edit' && row) {
    roleForm.value = {...row};
  } else {
    resetRoleForm();
  }
  roleDialogVisible.value = true;
};

// 保存角色（添加或更新）
const saveRole = async () => {
  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogAction.value === 'add') {
          let result = await addRole(roleForm.value);
          ElMessage.success(result.message ? result.message : '添加成功');
        } else {
          let result = await updateRole(roleForm.value);
          ElMessage.success(result.message ? result.message : '更新成功');
        }
        roleDialogVisible.value = false;
        await getRole();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    } else {
      ElMessage.error('角色信息填写不完整');
    }
  });
};

// 重置角色表单
const resetRoleForm = () => {
  roleForm.value = {
    id: '',
    roleName: '',
    roleCode: '',
    description: ''
  };
};

// 表单验证规则
const roleRules = {
  roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
  roleCode: [{required: true, message: '请输入角色编码', trigger: 'blur'}],
  description: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
};

// 菜单权限树
const assignTree = ref(null);
// 分配菜单权限
const sysMenuList = ref([]);
const assignDialogVisible = ref(false);
const currentRole = ref({roleName: '', id: ''});
const treeProps = ref({
  children: 'children',
  label: 'name',
});

/*
 得到所有选中的id列表
 */
const getCheckedIds = (auths, initArr = []) => {
  return auths.reduce((pre, item) => {
    if (item.selected && (!item.children || item.children.length === 0)) {
      pre.push(item.id);
    } else if (item.children && item.children.length > 0) {
      getCheckedIds(item.children, pre);
    }
    return pre;
  }, initArr);
};


/*
  获取角色权限数据并设置选中项
 */
const obtainPermissions = async () => {
  // 获取角色权限数据
  const result = await toAssign(currentRole.value.id);
  sysMenuList.value = result.data;
  // 获取选中的ID列表
  const checkedIds = getCheckedIds(sysMenuList.value);
  await nextTick(() => {
    if (assignTree.value) {
      assignTree.value.setCheckedKeys(checkedIds);
    } else {
      console.error('assignTree未定义');
    }
  });
};

// 显示分配权限对话框
const showAssignAuths = async (row) => {
  currentRole.value = {roleName: row.roleName, id: row.id};
  assignDialogVisible.value = true;
  await obtainPermissions();

};

// 保存分配的权限
const savePermissions = async () => {
  const allCheckedNodes = assignTree.value.getCheckedNodes(false, true);
  const idList = allCheckedNodes.map(node => node.id);
  const assginMenuVo = {
    roleId: currentRole.value.id,
    menuIdList: idList
  };
  try {
    const result = await doAssign(assginMenuVo);
    ElMessage.success(result.message || '分配权限成功');
    assignDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('分配权限失败');
  }
};

</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .extra {
    margin-top: 20px;
    display: flex;
    align-items: center;

    .el-form-item {
      margin-right: 10px;
    }
  }

  .el-dialog {
    width: 600px;
  }

  .el-tree {
    margin: 20px 0;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  /*
   权限树加载动画
   transition: opacity 0.5s; 定义了透明度的变化时间为 0.5 秒
   .fade-enter 和 .fade-leave-to 设置元素的透明度为 0，实现从透明到不透明或从不透明到透明的过渡
   .fade-enter-active 和 .fade-leave-active 控制透明度变化的动画效果
     */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.6s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}
</style>
