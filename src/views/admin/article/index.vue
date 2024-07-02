<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="clearDrawer">添加文章</el-button>
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
      <el-table-column label="文章标题" width="150" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryId"></el-table-column>
      <el-table-column label="发表时间" prop="createTime" sortable></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" sortable></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="updateArticleEcho(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="confirmDeleteArticle(row)"></el-button>
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
    <!-- 抽屉 -->
    <el-drawer v-model="articleVisibleDrawer" title="添加文章" direction="rtl" size="100%">
      <!-- 添加文章表单 -->
      <el-form :model="articleModel" label-width="100px">
        <el-form-item label="文章标题">
          <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select placeholder="请选择" v-model="articleModel.categoryId">
            <el-option v-for="c in articleCategory" :key="c.id" :label="c.categoryName" :value="c.categoryName">
            </el-option>
          </el-select>
        </el-form-item>
        <!--
           auto-upload: 是否自动上传
           action: 服务器接口路径
           name: 上传的文件字段名
           headers: 设置上传的请求头
           on-success: 上传成功的回调函数
         -->
        <el-form-item label="文章封面">
          <el-upload class="avatar-uploader"
                     :show-file-list="false"
                     action="/coisiniBlogApi/api/v1/file/admin/upload"
                     name="file"
                     :headers="{'Authorization':tokenStore.token}"
                     :on-success=uploadSuccess>
            <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容">
          <div class="editor">
            <quill-editor
                :options="options"
                v-model:content="articleModel.content"
                contentType="html">
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticle(1)">发布</el-button>
          <el-button type="info" @click="addArticle(0)">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>
</template>

<script setup>
import {ref, watch, onMounted, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {
  Edit,
  Delete,
  Search,
  Plus,
} from '@element-plus/icons-vue';
import {
  articleAddService,
  articleCategoryGetService,
  articleDeleteService,
  articleListService,
  articleUpdateService,
} from '@/api/article.js';

import {useTokenStore} from '@/stores/token';

// 编辑器
import {Quill, QuillEditor} from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
// 处理图像上传到服务器 https://github.com/NoelOConnell/quill-image-uploader
import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
// 调整图片大小
import BlotFormatter from "quill-blot-formatter";
import axios from "axios";
//注册
if (!Quill.imports["modules/ImageUploader"]) {
  Quill.register("modules/ImageUploader", ImageUploader);
}
if (!Quill.imports["modules/BlotFormatter"]) {
  Quill.register("modules/BlotFormatter", BlotFormatter);
}
import '@/assets/css/quillEditor.css'


const fonts = [
  "Microsoft-YaHei",
  "SimSun",
  "SimHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif",
];
const sizes = [false, "16px", "18px", "20px", "22px", "26px", "28px", "30px"];
const Size = Quill.import("formats/size");
Size.whitelist = sizes;
const Font = Quill.import("formats/font");
Font.whitelist = fonts;
Quill.register(Font, true);


// 自定义工具栏
const toolbar = ref([
  // 字体大小
  //[{size: ["small", false, "large", "huge"]}],
  [{size: sizes}],
  // 字体种类
  [{font: fonts}],
  // 标题
  [{header: [1, 2, 3, 4, 5, 6, false]}],
  // 字体颜色、字体背景颜色
  [{color: []}, {background: []}],
  // 对齐方式
  [{align: []}],
  // 清除文本格式
  ["clean"],
  // 加粗、斜体、下划线、删除线
  ["bold", "italic", "underline", "strike"],
  // 引用、代码块
  ["blockquote", "code-block"],
  // 1、2 级标题
  [{header: 1}, {header: 2}],
  // 有序、无序列表
  [{list: "ordered"}, {list: "bullet"}],
  // 上标、下标
  [{script: "sub"}, {script: "super"}],
  // 缩进
  [{indent: "-1"}, {indent: "+1"}],
  // 文本方向
  [{'direction': 'rtl'}]
      // 插入链接
      ['link'],
  // 插入图片
  ['image'],
  // 插入视频
  ['video'],

])

// 图像上传到服务器
const options = reactive({
  modules: {
    ImageUploader: {
      upload(file) {
        return new Promise(async (resolve, reject) => {
          // 上传服务器
          let formdata = new FormData();
          formdata.append("file", await file);
          axios({
            url: '/coisiniBlogApi/api/v1/file/admin/upload',
            method: "post",
            headers: {'Authorization': tokenStore.token},
            data: formdata,
          }).then((res) => {
            resolve(res.data.data);
          });
        });
      },
    },
    // 图片大小位置设置
    BlotFormatter,
    // 配置工具栏
    toolbar: toolbar.value
  },
  placeholder: '请输入内容...',
  // 配置编辑器主题 snow、bubble
  theme: 'snow',
});

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
  state: '',
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
    state: '',
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

// 页面初始化时加载
onMounted(() => {
  getArticleCategoryList();
});

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

/**
 * 获取文章列表
 */
const getArticleList = async () => {
  loading.value = true;
  try {
    let result = await articleListService(articleSearchObj.value);
    articles.value = result.data.records;
    total.value =result.data.total;
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    loading.value = false;
  }
};
getArticleList();

/**
 * 添加文章
 */
const tokenStore = useTokenStore();
// 上传图片成功回调
const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data;
};
// 控制抽屉是否显示
const articleVisibleDrawer = ref(false);
// 添加表单数据模型
const articleModel = ref({
  id: '',
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: '',
});
// 添加文章
const addArticle = async (state) => {
  articleModel.value.state = state;
  try {
    if (articleModel.value.id) {
      // 如果有id，调用更新方法
      let result = await articleUpdateService(articleModel.value);
      // 隐藏抽屉
      articleVisibleDrawer.value = false;
      ElMessage.success(result.message ? result.message : '文章更新成功');
    } else {
      // 否则调用新增方法
      let result = await articleAddService(articleModel.value);
      // 隐藏抽屉
      articleVisibleDrawer.value = false;
      ElMessage.success(result.message ? result.message : '文章发布成功');
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试');
  } finally {
    // 刷新获取文章
    await getArticleList();
  }
};

// 清空抽屉
const clearDrawer = () => {
  articleModel.value = {
    id: '', // 重置id
    title: '',
    categoryId: '',
    coverImg: '',
    content: '<span></span>',
    state: '',
  };
  articleVisibleDrawer.value = true;
};

// 打开编辑抽屉
const updateArticleEcho = (row) => {
  articleModel.value.id = row.id; // 设置id
  articleModel.value.categoryId = row.categoryId;
  articleModel.value.title = row.title;
  articleModel.value.content = row.content;
  articleModel.value.coverImg = row.coverImg;
  articleModel.value.state = row.state;

  articleVisibleDrawer.value = true;
};

// 删除文章
const confirmDeleteArticle = (row) => {
  ElMessageBox.confirm(
      '你确认删除该文章吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 用户点击了确认
        let result = await articleDeleteService(row.id);
        ElMessage.success(result.message ? result.message : '删除成功');
        // 获取所有文章
        await getArticleList();
      })
      .catch(() => {
        // 用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
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

  /* 抽屉样式  文件上传样式*/
  .avatar-uploader {
    /* 使用 :deep() 确保样式穿透到子组件 */
    :deep(.avatar) {
      width: 178px;
      height: 178px;
      display: block;
    }

    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    :deep(.el-upload:hover) {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }

  .editor {
    width: 100%;
    /* 深度穿透 Quill 编辑器样式 */
    :deep(.ql-editor) {
      min-height: 300px;
    }
  }
}
</style>