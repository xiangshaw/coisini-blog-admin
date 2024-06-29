<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" :icon="Plus" @click="add()">添 加</el-button>
    </div>

    <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-svg="svg"
        class="custom-loading-svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="sysMenuList"
        style="width: 100%; margin-bottom: 20px; margin-top: 10px;"
        row-key="id"
        border
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :default-expand-all="false"
        :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="菜单名称" width="160"/>
      <el-table-column label="图标">
        <template #default="scope">
          <i :class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" width="160"/>
      <el-table-column prop="path" label="路由地址" width="120"/>
      <el-table-column prop="component" label="组件路径" width="160"/>
      <el-table-column prop="sortValue" label="排序" width="60"/>
      <!--<el-table-column label="状态" width="80">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>-->
      <el-table-column prop="createTime" label="创建时间" width="160"/>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="scope">
          <el-button
              v-if="scope.row.type !== 2"
              type="success"
              :icon="Plus"
              size="small"
              title="添加下级节点"
              @click="add(scope.row)"
          />
          <el-button
              type="primary"
              :icon="Edit"
              size="small"
              title="修改"
              @click="edit(scope.row)"
          />
          <el-button
              type="danger"
              :icon="Delete"
              size="small"
              title="删除"
              :disabled="scope.row.children.length > 0"
              @click="removeDataById(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="menu" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="menu.id === ''" label="上级部门">
          <el-input v-model="menu.parentName" disabled/>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menu.type" :disabled="typeDisabled">
            <el-radio :value="0" :disabled="type0Disabled">目录</el-radio>
            <el-radio :value="1" :disabled="type1Disabled">菜单</el-radio>
            <el-radio :value="2" :disabled="type2Disabled">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name"/>
        </el-form-item>
        <el-form-item v-if="menu.type !== 2" label="图标" prop="icon">
          <el-select v-model="menu.icon" clearable>
            <el-option v-for="item in iconList" :key="item.class" :label="item.class" :value="item.class">
              <span style="float: left;">
                <i :class="item.class"/>
              </span>
              <span style="padding-left: 6px;">{{ item.class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="menu.sortValue" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item prop="path">
          <span slot="label">
            <el-tooltip content="访问的路由地址，如：`user`" placement="top">
              <i class="el-icon-question"/>
            </el-tooltip>
            路由地址
          </span>
          <el-input v-model="menu.path" placeholder="请输入路由地址"/>
        </el-form-item>
        <el-form-item v-if="menu.type !== 0" prop="component">
          <span slot="label">
            <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
              <i class="el-icon-question"/>
            </el-tooltip>
            组件路径
          </span>
          <el-input v-model="menu.component" placeholder="请输入组件路径"/>
        </el-form-item>
        <el-form-item v-if="menu.type === 2">
          <el-input v-model="menu.perms" placeholder="请输入权限标识" maxlength="100"/>
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(hasAuthority('bnt.role.list'))"
                        placement="top">
              <i class="el-icon-question"/>
            </el-tooltip>
            权限字符
          </span>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="menu.status">
            <el-radio :value="false">正常</el-radio>
            <el-radio :value="true">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" :icon="Close" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :icon="Check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {findNodes, saveMenu, updateById, removeById, updateStatus} from '@/api/menu'
import {Check, Close, Delete, Edit, Plus} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";

// 初始化loading
const loading = ref(true)
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
// 数据和状态
const sysMenuList = ref([])
const dialogTitle = ref('')
const dialogVisible = ref(false)
const menu = reactive({
  id: '',
  parentId: '',
  name: '',
  type: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  sortValue: 1,
  status: false,
  parentName: ''
})
const typeDisabled = ref(false)
const type0Disabled = ref(false)
const type1Disabled = ref(false)
const type2Disabled = ref(false)
const saveBtnDisabled = ref(false)
const iconList = [
  {class: 'Notification'},
  {class: 'Tools'},
  {class: 'Custom'},
  {class: 'Setting'},
  {class: 'UserFilled'},
  {class: 'Help'},
  {class: 'Iphone'},
  {class: 'ChatLineRound'},
  {class: 'Operation'},
  {class: 'DataLine'},
  {class: 'Check'},
  {class: 'Tickets'},
  {class: 'Goods'},
  {class: 'Remove'},
  {class: 'warning'},
  {class: 'QuestionFilled'},
  {class: 'el-icon-info'}
]

// 获取菜单数据
const getMenuListData = async () => {
  const response = await findNodes()
  sysMenuList.value = response.data
  loading.value = false
}

// 切换状态
const switchStatus = async (row) => {
  await updateStatus(row.id, row.status)
  await getMenuListData()
}

// 删除数据
const removeDataById = async (row) => {
  ElMessageBox.confirm(
      '此操作将永久删除该记录, 是否继续？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //用户点击了确认
        await removeById(row.id)
        await getMenuListData()
        ElMessage.success('操作成功')
      })
      .catch(() => {
        //用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

// 添加菜单
const add = (row = null) => {
  typeDisabled.value = false
  dialogTitle.value = row ? '添加下级节点' : '添加目录节点'
  dialogVisible.value = true
  Object.assign(menu, {
    id: '',
    parentId: row ? row.id : 0,
    parentName: row ? row.name : '',
    name: '',
    type: row ? (row.type === 0 ? 1 : 2) : 0,
    path: '',
    component: row ? (row.type === 0 ? '' : 'ParentView') : 'Layout',
    perms: '',
    icon: '',
    sortValue: 1,
    status: false
  })
  type0Disabled.value = row && row.type === 0
  type1Disabled.value = row && row.type === 1
  type2Disabled.value = row && row.type === 2
}

// 编辑菜单
const edit = (row) => {
  dialogTitle.value = '修改菜单'
  dialogVisible.value = true
  Object.assign(menu, row)
  typeDisabled.value = true
}

// 保存或更新菜单
const saveOrUpdate = async () => {
  try {
    saveBtnDisabled.value = true
    if (menu.type === 0 && menu.parentId !== '0') {
      menu.component = 'ParentView'
    }
    if (!menu.id) {
      await saveMenu(menu)
    } else {
      console.log("当前菜单：" + JSON.stringify(menu))
      await updateById(menu)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    await getMenuListData()
  } catch (error) {
    ElMessage.error('Error saving or updating data:', error)
  } finally {
    saveBtnDisabled.value = false
  }
}

// 组件挂载时获取数据
onMounted(getMenuListData)
</script>

<style>
.app-container {
  padding: 16px;
}

.tools-div {
  margin-bottom: 10px;
}

.dialog-footer {
  text-align: right;
}

.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>
