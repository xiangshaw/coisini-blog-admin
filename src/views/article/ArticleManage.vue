<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary">添加文章</el-button>
        </div>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="articleSearchObj.categoryId" style="width: 100px">
          <el-option
              v-for="c in articleCategory"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="articleSearchObj.state" style="width: 100px">
          <el-option label="已发布" value="1"></el-option>
          <el-option label="草稿" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字搜索：">
        <el-input
            v-model="articleSearchObj.keyword"
            :prefix-icon="Search"
            placeholder="请输入关键字搜索"
            @keyup.enter.native="getArticleList"
            style="width: 200px"
        />
      </el-form-item>
      <el-col>
        <el-form-item label="操作时间">
          <el-date-picker
              v-model="articleCreateTimes"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getArticleList">搜索</el-button>
          <el-button type="info" @click="resetArticleSearch">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <!-- 文章列表 -->
    <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-svg="svg"
        class="custom-loading-svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="articles" style="width: 100%">
      <el-table-column label="文章标题" width="200" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryId"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary"></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        layout="jumper, total, sizes, prev, pager, next"
        :current-page="articleSearchObj.current"
        :page-size="articleSearchObj.limit"
        :page-sizes="[5, 10, 50, 100]"
        background
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px; justify-content: flex-end"
    />
  </el-card>
</template>

<script setup>
import {
  Edit,
  Delete,
  Search
} from '@element-plus/icons-vue';
import {ref, watch} from 'vue';
import {articleCategoryGetService, articleListService} from '@/api/article.js';

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

// 初始化分类数据
const articleCategory = ref([]);

// 文章列表数据模型
const articles = ref([]);

// 初始化搜索条件
const articleSearchObj = ref({
  current: 1,
  limit: 10,
  keyword: '',
  categoryId: '',
  createTimeBegin: '',
  createTimeEnd: '',
  state: ''
});

// 搜索条件中的开始和结束时间
const articleCreateTimes = ref([]);

// 监听操作时间的变化
watch(articleCreateTimes, (newTimes) => {
  if (newTimes && newTimes.length === 2) {
    articleSearchObj.value.createTimeBegin = formatDateTime(newTimes[0]);
    articleSearchObj.value.createTimeEnd = formatDateTime(newTimes[1]);
  } else {
    articleSearchObj.value.createTimeBegin = '';
    articleSearchObj.value.createTimeEnd = '';
  }
});

// 时间格式化函数
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 清空搜索条件
const resetArticleSearch = () => {
  articleSearchObj.value = {
    current: 1,
    limit: 10,
    keyword: '',
    categoryId: '',
    createTimeBegin: '',
    createTimeEnd: '',
    state: ''
  };
  articleCreateTimes.value = [];
  getArticleList();
};

// 初始化总条数
const total = ref(0);

// 处理分页变化
const handlePageChange = (page) => {
  articleSearchObj.value.current = page;
  getArticleList();
};

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  articleSearchObj.value.limit = size;
  getArticleList();
};

/**
 * 获取文章分类列表
 */
const getArticleCategoryList = async () => {
  try {
    let result = await articleCategoryGetService();
    articleCategory.value = result.data;
  } catch (error) {
    console.error('Error fetching article categories:', error);
  }
};
getArticleCategoryList();

/**
 * 获取文章列表
 */
const getArticleList = async () => {
  loading.value = true;
  try {
    let result = await articleListService(articleSearchObj.value);
    articles.value = result.data.records;
    total.value = result.data.total;
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    loading.value = false;
  }
};
getArticleList();
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

  .example-showcase .el-loading-mask {
    z-index: 9;
  }

  .page-container {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;
  }

  .page-container .block {
    padding: 30px 0;
    text-align: center;
  }
}
</style>
