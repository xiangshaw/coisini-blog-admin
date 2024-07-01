<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户管理</span>
        <div class="extra">
          <!-- 搜索表单 -->
          <el-form inline>
            <el-col>
              <el-form-item label="用户名称：">
                <el-input
                    v-model="userSearchObj.keyword"
                    :prefix-icon="Search"
                    placeholder="用户名/呢称/手机号码"
                    @keyup.enter.native="getUser"
                    style="width: 100%"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getUser">搜索</el-button>
                <el-button type="info" @click="resetUserSearch">重置</el-button>
                <el-button type="danger" @click="batchDeleteUsers" :disabled="selectedUser.length === 0">批量删除
                </el-button>
                <el-button type="primary" @click="openUserDialog('add')">添加用户</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </template>

    <!-- 用户列表 -->
    <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-svg="svg"
        class="custom-loading-svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="users" style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="用户名" width="150" prop="username"></el-table-column>
      <el-table-column label="用户呢称" prop="nickName"></el-table-column>
      <el-table-column label="描述" prop="description" width="150"></el-table-column>
      <el-table-column label="用户头像" prop="avatar">
        <template #default="scope">
          <div class="demo-image__preview">
            <el-image
                style="width: 60px; height: 60px;"
                :src="scope.row.avatar"
                :preview-src-list="[scope.row.avatar]"
                preview-teleported
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <el-tag
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              disable-transitions>{{ scope.row.status === 0 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" prop="loginTime" width="115" sortable></el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="115" sortable></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" width="115" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" size="small"
                     @click="openUserDialog('edit', row)"></el-button>
          <el-button :icon="Tickets" circle plain type="warning" size="small"
                     @click="showAssignRole(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" size="small"
                     @click="confirmDeleteUser(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        layout="jumper, total, sizes, prev, pager, next"
        :current-page="userSearchObj.current"
        :page-size="userSearchObj.limit"
        :page-sizes="[5, 10, 50, 100]"
        background
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog v-model="userDialogVisible" :title="dialogTitle" @close="resetUserForm">
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="80px">
        <el-form-item label="名称" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="呢称" prop="nickName">
          <el-input v-model="userForm.nickName" placeholder="请输入用户呢称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入用户密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="userForm.description" placeholder="请输入用户描述"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="nickname">
          <el-input v-model="userForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="nickname">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">{{ dialogAction === 'add' ? '添加' : '保存' }}</el-button>
      </template>
    </el-dialog>

    <!-- 分配角色弹窗 -->
    <el-dialog title="分配角色" v-model="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username"/>
        </el-form-item>
        <el-form-item label="角色列表">
          <div style="display: flex; flex-direction: column;">
            <el-checkbox
                v-model="checkRoleAll"
                :indeterminate="selected"
                @change="handleCheckAllChange"
                style="margin-bottom: 15px;"
            >
              全选
            </el-checkbox>
            <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
              <el-checkbox
                  v-for="role in allRoles"
                  :key="role.id"
                  :label="role.id"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="small" @click="saveAssignRole">保存</el-button>
        <el-button size="small" @click="dialogRoleVisible = false">取消</el-button>
      </template>
    </el-dialog>

  </el-card>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Search, Edit, Tickets} from '@element-plus/icons-vue';
import {
  getUserList, getUserRoleService,
  userAddService, userAssignRoleService,
  userBatchDeleteService,
  userDeleteService,
  userUpdatesService
} from '@/api/user';

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

// 用户数据模型
const users = ref([]);

// 初始化搜索条件
const userSearchObj = ref({
  current: 1,
  limit: 10,
  keyword: '',
});
/**
 * 获取用户列表
 */
const getUser = async () => {
  loading.value = true;
  let result = await getUserList(userSearchObj.value);
  users.value = result.data.records;
  total.value = result.data.total;
  loading.value = false;
};

// 页面初始化时加载
onMounted(() => {
  getUser();
});

// 清空搜索条件
const resetUserSearch = () => {
  userSearchObj.value = {
    current: 1,
    limit: 10,
    keyword: '',
  };
  getUser();
};

// 初始化总条数
const total = ref(0);

// 处理分页变化
const handlePageChange = (page) => {
  userSearchObj.value.current = page;
  getUser();
};

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  userSearchObj.value.limit = size;
  getUser();
};

// 删除
const confirmDeleteUser = (row) => {
  ElMessageBox.confirm(
      '你确认删除该用户吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 用户点击了确认
        let result = await userDeleteService(row.id);
        ElMessage.success(result.message ? result.message : '删除成功');
        // 获取所有用户
        await getUser();
      })
      .catch(() => {
        // 用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        });
      });
};

// 用于存储选中的用户
const selectedUser = ref([]);

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedUser.value = selection;
};

// 批量删除
const batchDeleteUsers = async () => {
  if (selectedUser.value.length === 0) {
    ElMessage.warning('请选择要删除的用户');
    return;
  }
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUser.value.length} 个用户吗？`,
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    const ids = selectedUser.value.map(item => item.id);
    try {
      // 传输格式 ["7197787510292930560", "7196281315379937280"]
      const result = await userBatchDeleteService(ids);
      ElMessage.success(result.message ? result.message : '删除成功');
      await getUser();
    } catch (error) {
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
};

// 添加/编辑用户对话框
const userDialogVisible = ref(false);
const userForm = ref({
  id: '',
  user: '',
  userCode: '',
  description: ''
});
const userFormRef = ref(null);
// 'add' 或 'edit'
const dialogAction = ref('');
const dialogTitle = ref('');

// 打开添加/编辑用户对话框
const openUserDialog = (action, row = null) => {
  dialogAction.value = action;
  dialogTitle.value = action === 'add' ? '添加用户' : '编辑用户';
  if (action === 'edit' && row) {
    userForm.value = {...row};
  } else {
    resetUserForm();
  }
  userDialogVisible.value = true;
};

// 保存用户（添加或更新）
const saveUser = async () => {
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogAction.value === 'add') {
          let result = await userAddService(userForm.value);
          ElMessage.success(result.message ? result.message : '添加成功');
        } else {
          let result = await userUpdatesService(userForm.value);
          ElMessage.success(result.message ? result.message : '更新成功');
        }
        userDialogVisible.value = false;
        await getUser();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    } else {
      ElMessage.error('用户信息填写不完整');
    }
  });
};

// 重置用户表单
const resetUserForm = () => {
  userForm.value = {
    id: '',
    keyword: '',
    userCode: '',
    description: ''
  };
};

// 表单验证规则
const userRules = {
  username: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
  nickName: [{required: true, message: '请输入用户编码', trigger: 'blur'}],
  password: [{required: true, message: '请输入用户密码', trigger: 'blur'}],
  description: [{required: true, message: '请输入用户描述', trigger: 'blur'}],
};

// 分配角色弹窗
const dialogRoleVisible = ref(false);
// 角色数据
const allRoles = ref([]);
// 选中的角色ID
const userRoleIds = ref([]);
// 全选角色
const checkRoleAll = ref(false);
// 是否选中
const selected = ref(false);
const user = ref({});
// 处理全选逻辑
const handleCheckAllChange = (val) => {
  userRoleIds.value = val ? allRoles.value.map(role => role.id) : [];
  selected.value = false;
};
// 取消全选
const handleCheckedChange = () => {
  const checkedCount = userRoleIds.value.length;
  checkRoleAll.value = checkedCount === allRoles.value.length;
  selected.value = checkedCount > 0 && checkedCount < allRoles.value.length;
};
// 显示分配角色对话框
const showAssignRole = async (row) => {
  try {
    const roleResult = await getUserRoleService(row.id);
    const {allRoles: roles, userRoleIds: assignedRoleIds} = roleResult.data;
    // 所有的角色
    allRoles.value = roles;
    // 用户已分配的角色ID
    userRoleIds.value = assignedRoleIds;
    checkRoleAll.value = assignedRoleIds.length === roles.length;
    selected.value = assignedRoleIds.length > 0 && assignedRoleIds.length < roles.length;
    // 设置当前用户
    user.value = row;
    // 显示分配角色对话框
    dialogRoleVisible.value = true;
  } catch (error) {
    ElMessage.error('获取角色信息失败');
  }
};

// 保存分配的角色
const saveAssignRole = async () => {
  const assignRoleVo = {
    userId: user.value.id,
    roleIdList: userRoleIds.value
  };
  try {
    const result = await userAssignRoleService(assignRoleVo);
    ElMessage.success(result.message || '分配角色成功');
    // 关闭对话框
    dialogRoleVisible.value = false;
  } catch (error) {
    ElMessage.error('分配角色失败');
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
}
</style>
