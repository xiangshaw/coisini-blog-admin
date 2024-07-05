<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>标签管理</span>
        <div class="extra">
          <!--搜索-->
          <el-input
              v-model="tagSearchObj.keyword"
              :prefix-icon="Search"
              placeholder="请输入搜索关键字"
              @keyup.enter.native="getAllTag"
              style="width: 200px; margin-right: 10px;"
          />
          <el-button type="primary" @click="getAllTag">搜索</el-button>
          <el-button type="info" @click="resetSearch">重置</el-button>
          <el-button type="warning" @click="title='添加标签';dialogVisible = true;clearTagModel()">添加标签
          </el-button>
          <el-button type="danger" @click="batchDelete" :disabled="selectedCategories.length === 0">批量删除</el-button>
        </div>
      </div>
    </template>
    <!--标签列表-->
    <el-table v-loading="loading"
              element-loading-text="Loading..."
              :element-loading-svg="svg"
              class="custom-loading-svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              :data="tags"
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="标签名" prop="tagName">
        <template #default="{ row }">
          <div :style="{ backgroundColor: row.color, color: getTextColor(row.color), padding: '5px 10px', borderRadius: '2px', display: 'inline-block' }">
            {{ row.tagName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标签颜色" prop="color">
        <template #default="{ row }">
          <el-tag effect="light" :style="{ backgroundColor: row.color, color: getTextColor(row.color) }">
            {{ row.color }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="115" sortable></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="info" @click="updateTagEcho(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteTag(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!--分页-->
    <el-pagination
        layout="jumper, total, sizes, prev, pager, next"
        :current-page="tagSearchObj.current"
        :page-size="tagSearchObj.limit"
        :page-sizes="[5, 10, 50, 100]"
        background
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;  justify-content: flex-end"
    />
    <!-- 添加标签弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%" @close="clearTagModel">
      <el-form ref="formRef" :model="tagModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="tagModel.tagName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <!-- 使用颜色选择器 -->
          <el-color-picker v-model="tagModel.color"></el-color-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false;clearTagModel()">取消</el-button>
            <el-button type="primary" @click="title==='添加标签'? addTag():updateTag()"> 确认 </el-button>
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

// 初始化标签数据
const tags = ref([])

// 初始化总条数
const total = ref(0)

// 初始化搜索条件
const tagSearchObj = ref({
  // 当前页码
  current: 1,
  // 每页显示的条数
  limit: 10,
  // 搜索关键词
  keyword: ''
})

import {ElMessage, ElMessageBox} from "element-plus";
// 获取文章标签数据
import {tagAddService, tagBatchDeleteService, tagDeleteService, tagListService, tagUpdateService} from "@/api/tag";

/**
 * 根据背景颜色获取合适的文本颜色（黑色或白色）
 * @param {string} bgColor - 背景颜色的十六进制代码
 * @returns {string} - 合适的文本颜色
 */
const getTextColor = (bgColor) => {
  if (!bgColor) return '#000'; // 默认黑色
  // 去掉 #，将背景色转为RGB格式
  const color = bgColor.substring(1);
  // 将颜色转成整型
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  // 计算相对亮度
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // 根据相对亮度判断文字颜色
  return brightness > 0.5 ? '#000' : '#fff';
};


// 获取标签数据
const getAllTag = async () => {
  let result = await tagListService(tagSearchObj.value);
  loading.value = false
  // 更新标签数据
  tags.value = result.data.records;
  // 获取总条数
  total.value = result.data.total
}

// 调用方法获取标签数据
getAllTag();

// 添加标签
const addTag = async () => {
  let result = await tagAddService(tagModel.value);
  // 提示添加成功
  ElMessage.success(result.message ? result.message : '添加成功')
  // 关闭弹窗
  dialogVisible.value = false
  // 刷新页面
  await getAllTag()
}

//修改标签
const updateTag = async () => {
  let result = await tagUpdateService(tagModel.value)
  ElMessage.success(result.message ? result.message : '修改成功')
  //隐藏弹窗
  dialogVisible.value = false
  //再次访问后台接口，查询所有标签
  await getAllTag()
}

//删除标签
const deleteTag = (row) => {
  ElMessageBox.confirm(
      '你确认删除该标签信息吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //用户点击了确认
        let result = await tagDeleteService(row.id)
        ElMessage.success(result.message ? result.message : '删除成功')
        //再次调用getAllTag，获取所有文章标签
        await getAllTag()
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
const clearTagModel = () => {
  tagModel.value.tagName = ''
  tagModel.value.color = '#a9aeb8'
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
  tagSearchObj.value.current = page
  getAllTag()
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  tagSearchObj.value.limit = size
  getAllTag()
}

// 重置搜索条件
const resetSearch = () => {
  tagSearchObj.value = {
    current: 1,
    limit: 10,
    keyword: ''
  }
  getAllTag()
}

// 控制添加标签弹窗
const dialogVisible = ref(false)
// 弹窗标题
const title = ref('')

//添加标签数据模型
const tagModel = ref({
  tagName: '',
  color: '#a9aeb8'
})

//添加标签表单校验
const rules = {
  tagName: [
    {required: true, message: '请输入标签名称', trigger: 'blur'},
  ],
  color: [
    {required: true, message: '请输入选择标签颜色', trigger: 'blur'},
  ]
}

// 修改标签回显
const updateTagEcho = (row) => {
  title.value = '修改标签'
  dialogVisible.value = true
  tagModel.value.tagName = row.tagName
  tagModel.value.color = row.color
  // 修改的时候必须传递标签的id
  tagModel.value.id = row.id
}

// 用于存储选中的标签
const selectedCategories = ref([]);

// 多选框选中事件（获取值）
const handleSelectionChange = (selection) => {
  selectedCategories.value = selection;
};

// 批量删除标签
const batchDelete = async () => {
  if (selectedCategories.value.length === 0) {
    ElMessage.warning('请选择要删除的标签');
    return;
  }
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedCategories.value.length} 个标签吗？`,
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
      const result = await tagBatchDeleteService({ids});
      ElMessage.success(result.message ? result.message : '删除成功');
      await getAllTag();
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
.tag-name {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
}

.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>