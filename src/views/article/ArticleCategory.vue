<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <!--搜索-->
          <el-input
              v-model="categorySearchObj.keyword"
              :prefix-icon="Search"
              placeholder="请输入搜索关键字"
              @keyup.enter.native="getAllCategory"
              style="width: 200px; margin-right: 10px;"
          />
          <el-button type="primary" @click="getAllCategory">搜索</el-button>
          <el-button type="info" @click="resetSearch">重置</el-button>
          <el-button type="warning" @click="title='添加分类';dialogVisible = true;clearCategoryModel()">添加分类
          </el-button>
          <el-button type="danger" @click="batchDelete" :disabled="selectedCategories.length === 0">批量删除</el-button>
        </div>
      </div>
    </template>
    <!--分类列表-->
    <el-table v-loading="loading"
              element-loading-text="Loading..."
              :element-loading-svg="svg"
              class="custom-loading-svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              :data="categorys"
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="updateCategoryEcho(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!--分页-->
    <el-pagination
        layout="jumper, total, sizes, prev, pager, next"
        :current-page="categorySearchObj.current"
        :page-size="categorySearchObj.limit"
        :page-sizes="[5, 10, 50, 100]"
        background
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;  justify-content: flex-end"
    />
    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%" @close="clearCategoryModel">
      <el-form ref="formRef" :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false;clearCategoryModel()">取消</el-button>
            <el-button type="primary" @click="title==='添加分类'? addCategory():updateCategory()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {
  Edit,
  Delete,
  Search
} from '@element-plus/icons-vue'
import {ref} from 'vue'

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
      `

// 初始化分类数据
const categorys = ref([])

// 初始化总条数
const total = ref(0)

// 初始化搜索条件
const categorySearchObj = ref({
  // 当前页码
  current: 1,
  // 每页显示的条数
  limit: 10,
  // 搜索关键词
  keyword: ''
})


// 获取文章分类数据
import {
  articleCategoryListService,
  articleCategoryAddService,
  articleCategoryUpdateService,
  articleCategoryDeleteService, articleCategoryBatchDeleteService
} from '@/api/article.js'
import {ElMessage, ElMessageBox} from "element-plus";

const getAllCategory = async () => {
  let result = await articleCategoryListService(categorySearchObj.value);
  loading.value = false
  // 更新分类数据
  categorys.value = result.data.records;
  // 获取总条数
  total.value = result.data.total
}

// 调用方法获取分类数据
getAllCategory();

// 添加分类
const addCategory = async () => {
  let result = await articleCategoryAddService(categoryModel.value);
  // 提示添加成功
  ElMessage.success(result.message ? result.message : '添加成功')
  // 关闭弹窗
  dialogVisible.value = false
  // 刷新页面
  await getAllCategory()
}

//修改分类
const updateCategory = async () => {
  let result = await articleCategoryUpdateService(categoryModel.value)
  ElMessage.success(result.message ? result.message : '修改成功')
  //隐藏弹窗
  dialogVisible.value = false
  //再次访问后台接口，查询所有分类
  await getAllCategory()
}

//删除分类
const deleteCategory = (row) => {
  ElMessageBox.confirm(
      '你确认删除该分类信息吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //用户点击了确认
        let result = await articleCategoryDeleteService(row.id)
        ElMessage.success(result.message ? result.message : '删除成功')
        //再次调用getAllCategory，获取所有文章分类
        await getAllCategory()
      })
      .catch(() => {
        //用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

// 表单引用
const formRef = ref(null);

//清空模型数据
const clearCategoryModel = () => {
  categoryModel.value.categoryName = ''
  categoryModel.value.categoryAlias = ''
  // 如果表单引用已定义，重置表单校验状态
  // 延迟重置表单校验状态
  setTimeout(() => {
    if (formRef.value) {
      formRef.value.resetFields();
    }// 50 毫秒的延迟
  }, 50);
}

// 处理分页变化
const handlePageChange = (page) => {
  categorySearchObj.value.current = page
  getAllCategory()
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  categorySearchObj.value.limit = size
  getAllCategory()
}

// 重置搜索条件
const resetSearch = () => {
  categorySearchObj.value = {
    current: 1,
    limit: 10,
    keyword: ''
  }
  getAllCategory()
}

//控制添加分类弹窗
const dialogVisible = ref(false)
// 弹窗标题
const title = ref('')

//添加分类数据模型
const categoryModel = ref({
  categoryName: '',
  categoryAlias: ''
})

//添加分类表单校验
const rules = {
  categoryName: [
    {required: true, message: '请输入分类名称', trigger: 'blur'},
  ],
  categoryAlias: [
    {required: true, message: '请输入分类别名', trigger: 'blur'},
  ]
}

// 修改分类回显
const updateCategoryEcho = (row) => {
  title.value = '修改分类'
  dialogVisible.value = true
  // 将row中的数据赋值给categoryModel
  categoryModel.value.categoryName = row.categoryName
  categoryModel.value.categoryAlias = row.categoryAlias
  // 修改的时候必须传递分类的id，所以扩展一个id属性
  categoryModel.value.id = row.id
}

// 用于存储选中的分类
const selectedCategories = ref([]);

const handleSelectionChange = (selection) => {
  selectedCategories.value = selection;
  console.log("多选框的值：" + JSON.stringify(selection));
};

// 批量删除分类
const batchDelete = async () => {
  if (selectedCategories.value.length === 0) {
    ElMessage.warning('请选择要删除的分类');
    return;
  }
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedCategories.value.length} 个分类吗？`,
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    const ids = selectedCategories.value.map(item => item.id);
    console.log("此时ids的值：" + ids);
    try {
      // 传输格式 {ids: ["7201362886097227776", "7201362874646777856", "7201362857680818176"]}
      const result = await articleCategoryBatchDeleteService({ids});
      ElMessage.success(result.message ? result.message : '删除成功');
      await getAllCategory();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
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
  }
}

.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>