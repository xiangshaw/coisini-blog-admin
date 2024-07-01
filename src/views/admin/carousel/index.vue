<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>轮播图管理</span>
        <div class="extra">
          <!-- 搜索表单 -->
          <el-form inline>
            <el-col>
              <el-form-item label="地址搜索：">
                <el-input
                    v-model="carouselSearchObj.keyword"
                    :prefix-icon="Search"
                    placeholder="输入URL地址"
                    @keyup.enter.native="getCarouse"
                    style="width: 100%"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getCarouse">搜索</el-button>
                <el-button type="info" @click="resetCarouselSearch">重置</el-button>
                <el-button type="danger" @click="batchDeleteCarousels" :disabled="selectedCarousel.length === 0">批量删除
                </el-button>
                <el-button type="primary" @click="openCarouselDialog('add')">添加轮播图</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </template>

    <!-- 轮播图列表 -->
    <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-svg="svg"
        class="custom-loading-svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="carousels" style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="轮播图地址" prop="carouselUrl" width="100px">
        <template #default="scope">
          <div class="demo-image__preview">
            <el-image
                style="width: 60px; height: 60px;"
                :src="scope.row.carouselUrl"
                :preview-src-list="[scope.row.carouselUrl]"
                preview-teleported
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="跳转地址" prop="redirectUrl" width="80px"></el-table-column>
      <el-table-column label="排序" prop="carouselRank" sortable></el-table-column>
      <el-table-column label="创建人" prop="createUser"></el-table-column>
      <el-table-column label="更新人" prop="updateUser"></el-table-column>
      <el-table-column label="状态" prop="delFlag">
        <template #default="scope">
          <el-tag
              :type="scope.row.delFlag === 0 ? 'success' : 'danger'"
              disable-transitions>{{ scope.row.delFlag === 0 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="115" sortable></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" width="115" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" size="small"
                     @click="openCarouselDialog('edit', row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" size="small"
                     @click="confirmDeleteCarousel(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        layout="jumper, total, sizes, prev, pager, next"
        :current-page="carouselSearchObj.current"
        :page-size="carouselSearchObj.limit"
        :page-sizes="[5, 10, 50, 100]"
        background
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加/编辑轮播图弹窗 -->
    <el-dialog v-model="carouselDialogVisible" :title="dialogTitle" @close="resetCarouselForm">
      <el-form :model="carouselForm" :rules="carouselRules" ref="carouselFormRef" label-width="100px">
        <el-form-item label="轮播图地址" prop="carouselUrl">
          <el-input v-model="carouselForm.carouselUrl" placeholder="轮播图地址"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="redirectUrl">
          <el-input v-model="carouselForm.redirectUrl" placeholder="轮播图跳转地址"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="carouselForm.carouselRank" controls-position="right" :min="0"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="carouselDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCarousel">{{ dialogAction === 'add' ? '添加' : '保存' }}</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {ref, onMounted, nextTick, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Search, Edit, Tickets} from '@element-plus/icons-vue';
import {
  addCarousel,
  batchRemoveCarousel,
  getCarouselList,
  removeById,
  updateByCarousel,
} from "@/api/carousel";

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

// 轮播图数据模型
const carousels = ref([]);

// 初始化搜索条件
const carouselSearchObj = ref({
  current: 1,
  limit: 10,
  keyword: '',
});
/**
 * 获取轮播图列表
 */
const getCarouse = async () => {
  loading.value = true;
  let result = await getCarouselList(carouselSearchObj.value);
  carousels.value = result.data.records;
  total.value = result.data.total;
  loading.value = false;
};

// 页面初始化时加载
onMounted(() => {
  getCarouse();
});

// 清空搜索条件
const resetCarouselSearch = () => {
  carouselSearchObj.value = {
    current: 1,
    limit: 10,
    keyword: '',
  };
  getCarouse();
};

// 初始化总条数
const total = ref(0);

// 处理分页变化
const handlePageChange = (page) => {
  carouselSearchObj.value.current = page;
  getCarouse();
};

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  carouselSearchObj.value.limit = size;
  getCarouse();
};

// 删除
const confirmDeleteCarousel = (row) => {
  ElMessageBox.confirm(
      '你确认删除该轮播图吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 点击确定
        let result = await removeById(row.id);
        ElMessage.success(result.message ? result.message : '删除成功');
        // 获取所有轮播图
        await getCarouse();
      })
      .catch(() => {
        // 点击取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        });
      });
};

// 用于存储选中的轮播图
const selectedCarousel = ref([]);

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedCarousel.value = selection;
};

// 批量删除
const batchDeleteCarousels = async () => {
  if (selectedCarousel.value.length === 0) {
    ElMessage.warning('请选择要删除的轮播图');
    return;
  }
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedCarousel.value.length} 个轮播图吗？`,
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    const ids = selectedCarousel.value.map(item => item.id);
    try {
      const result = await batchRemoveCarousel(ids);
      ElMessage.success(result.message ? result.message : '删除成功');
      await getCarouse();
    } catch (error) {
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
};

// 添加/编辑轮播图对话框
const carouselDialogVisible = ref(false);
const carouselForm = reactive({
  id:'',
  carouselUrl: '',
  redirectUrl: '',
  carouselRank: 1,
});
const carouselFormRef = ref(null);
// 'add' 或 'edit'
const dialogAction = ref('');
const dialogTitle = ref('');

// 打开添加/编辑轮播图对话框
const openCarouselDialog = (action, row = null) => {
  dialogAction.value = action;
  dialogTitle.value = action === 'add' ? '添加轮播图' : '编辑轮播图';
  if (action === 'edit' && row) {
    carouselForm.id = row.id;
    carouselForm.carouselUrl = row.carouselUrl;
    carouselForm.redirectUrl = row.redirectUrl;
    carouselForm.carouselRank = row.carouselRank;
  } else {
    resetCarouselForm();
  }
  nextTick(() => {
    carouselDialogVisible.value = true;
  });
};

// 保存轮播图（添加或更新）
const saveCarousel = async () => {
  await carouselFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogAction.value === 'add') {
          let result = await addCarousel({...carouselForm});
          ElMessage.success(result.message ? result.message : '添加成功');
        } else {
          let result = await updateByCarousel({...carouselForm});
          ElMessage.success(result.message ? result.message : '更新成功');
        }
        carouselDialogVisible.value = false;
        await getCarouse();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    } else {
      ElMessage.error('轮播图信息填写不完整');
    }
  });
};

// 重置轮播图表单
const resetCarouselForm = () => {
  carouselForm.carouselUrl = '';
  carouselForm.redirectUrl = '';
  carouselForm.carouselRank = 1;
};

// 表单验证规则
const carouselRules = {
  carouselUrl: [{ required: true, message: '请输入轮播图地址', trigger: 'blur' }],
  redirectUrl: [{ required: true, message: '请输入轮播图跳转地址', trigger: 'blur' }],
  carouselRank: [{ required: true, message: '请输入排序', trigger: 'change' }],
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
