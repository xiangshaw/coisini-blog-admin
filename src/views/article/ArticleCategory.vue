<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'

// 初始化分类数据
const categorys = ref([
  {
    "id": 1,
    "categoryName": "科技",
    "categoryAlias": "kj",
    "createTime": "2024-06-17 13:14:20",
    "updateTime": "2024-06-17 13:14:20"
  },
])

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
import { articleCategoryListService } from '@/api/article.js'
const getAllCategory = async () => {
  let result = await articleCategoryListService(categorySearchObj.value);
  // 更新分类数据
  categorys.value = result.data.records;
  // 获取总条数
  total.value = result.data.total
}

// 调用方法获取分类数据
getAllCategory();

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

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <!--搜索-->
          <el-input
              v-model="categorySearchObj.keyword"
              placeholder="请输入搜索关键字"
              @keyup.enter.native="getAllCategory"
              style="width: 200px; margin-right: 10px;"
          />
          <el-button type="primary" @click="getAllCategory">搜索</el-button>
          <el-button type="primary">添加分类</el-button>
        </div>
      </div>
    </template>
    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" ></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  <!--分页-->
    <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="categorySearchObj.limit"
        :current-page="categorySearchObj.current"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
    />
  </el-card>
</template>

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
</style>