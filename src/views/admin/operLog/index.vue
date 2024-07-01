<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>操作日志</span>
        <div class="extra">
          <!-- 搜索表单 -->
          <el-form inline>
            <el-form-item label="模块标题：">
              <el-input
                  v-model="loginLogSearchObj.title"
                  :prefix-icon="Search"
                  placeholder="请输入模块标题搜索"
                  @keyup.enter.native="getOperLog"
                  style="width: 200px"
              />
            </el-form-item>
            <el-col>
              <el-form-item label="操作时间">
                <el-date-picker
                    v-model="loginLogCreateTimes"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getOperLog">搜索</el-button>
                <el-button type="info" @click="resetOperLogSearch">重置</el-button>
                <el-button type="danger" @click="batchDeleteOperLogs" :disabled="selectedOperLog.length === 0">批量删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </template>

    <!-- 操作日志列表 -->
    <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-svg="svg"
        class="custom-loading-svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="loginLogs" style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="模块标题" width="150" prop="title"></el-table-column>
      <el-table-column label="业务类型" prop="businessType">
        <template #default="{ row }">
          <el-tag :type="getBusinessTypeTagType(row.businessType)">
            {{ getBusinessTypeLabel(row.businessType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" prop="requestMethod"></el-table-column>
      <el-table-column label="操作类别" prop="operatorType">
        <template #default="{ row }">
          <el-tag :type="getOperatorTypeTagType(row.operatorType)">
            {{ getOperatorTypeLabel(row.operatorType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" prop="operName"></el-table-column>
      <el-table-column label="请求URL" prop="operUrl"></el-table-column>
      <el-table-column label="返回参数" prop="jsonResult"></el-table-column>
      <!--   0成功 1失败   -->
      <el-table-column label="操作状态" prop="status">
        <template #default="{ row }">
          <el-tag v-if="row.status === false" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="错误消息" prop="errorMsg"></el-table-column>
      <el-table-column label="时间" prop="createTime" sortable width="115"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100">
        <template #default="{ row }">
          <el-button :icon="More" circle plain type="primary" @click="loginLogDetailsEcho(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="confirmDeleteOperLog(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        layout="jumper, total, sizes, prev, pager, next"
        :current-page="loginLogSearchObj.current"
        :page-size="loginLogSearchObj.limit"
        :page-sizes="[5, 10, 50, 100]"
        background
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 日志详情弹窗 -->
    <el-dialog
        v-model="showLogDetailsDialog"
        title="日志详情"
        width="50%"
        @close="clearSelectedOperLogDetails">
      <div v-if="selectedOperLogDetails">
        <p><strong>模块标题：</strong> {{ selectedOperLogDetails.title }}</p>
        <p><strong>业务类型：</strong>
          <el-tag :type="getBusinessTypeTagType(selectedOperLogDetails.businessType)">
            {{ getBusinessTypeLabel(selectedOperLogDetails.businessType) }}
          </el-tag>
        </p>
        <p><strong>方法名称：</strong> {{ selectedOperLogDetails.method }}</p>
        <p><strong>请求方式：</strong> {{ selectedOperLogDetails.requestMethod }}</p>
        <p><strong>操作类别：</strong>
          <el-tag :type="getOperatorTypeTagType(selectedOperLogDetails.operatorType)">
            {{ getOperatorTypeLabel(selectedOperLogDetails.operatorType) }}
          </el-tag>
        </p>
        <p><strong>操作人员：</strong> {{ selectedOperLogDetails.operName }}</p>
        <p><strong>请求URL：</strong> {{ selectedOperLogDetails.operUrl }}</p>
        <p><strong>主机地址：</strong> {{ selectedOperLogDetails.operIp }}</p>
        <p><strong>请求参数：</strong> {{ selectedOperLogDetails.operParam }}</p>
        <p><strong>返回参数：</strong> {{ selectedOperLogDetails.jsonResult }}</p>
        <!--   0成功 1失败   -->
        <p><strong>操作状态：</strong>
          <el-tag v-if="selectedOperLogDetails.status === false" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </p>
        <p><strong>错误消息：</strong> {{ selectedOperLogDetails.errorMsg }}</p>
        <p><strong>时间：</strong> {{ selectedOperLogDetails.createTime }}</p>
      </div>
      <template #footer>
        <el-button @click="showLogDetailsDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {
  Delete,
  Search,
  More,
} from '@element-plus/icons-vue';
import {getOperLogList, getOperLogById, deleteOperLog, batchDeleteOperLog} from '@/api/operLog';

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

// 操作日志数据模型
const loginLogs = ref([]);

// 初始化搜索条件
const loginLogSearchObj = ref({
  current: 1,
  limit: 10,
  title: '',
  createTimeBegin: '',
  createTimeEnd: '',

  businessType: '',
  method: '',
  requestMethod: '',
  operatorType: '',
  operName: '',
  operUrl: '',
  operIp: '',
  operParam: '',
  jsonResult: '',
  status: '',
  errorMsg: '',
  createTime: '',
});

// 搜索条件中的开始和结束时间
const loginLogCreateTimes = ref([]);

// 监听操作时间的变化
watch(loginLogCreateTimes, (newTimes) => {
  if (newTimes && newTimes.length === 2) {
    loginLogSearchObj.value.createTimeBegin = formatDateTime(newTimes[0]);
    loginLogSearchObj.value.createTimeEnd = formatDateTime(newTimes[1]);
  } else {
    loginLogSearchObj.value.createTimeBegin = '';
    loginLogSearchObj.value.createTimeEnd = '';
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

/**
 * 获取操作日志列表
 */
const getOperLog = async () => {
  loading.value = true;
  let result = await getOperLogList(loginLogSearchObj.value);
  loginLogs.value = result.data.records;
  total.value = result.data.total;
  loading.value = false;
};

// 页面初始化时加载
onMounted(() => {
  getOperLog();
});


// 清空搜索条件
const resetOperLogSearch = () => {
  loginLogSearchObj.value = {
    current: 1,
    limit: 10,
    title: '',
    createTimeBegin: '',
    createTimeEnd: '',
  };
  loginLogCreateTimes.value = [];
  getOperLog();
};

// 初始化总条数
const total = ref(0);

// 处理分页变化
const handlePageChange = (page) => {
  loginLogSearchObj.value.current = page;
  getOperLog();
};

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  loginLogSearchObj.value.limit = size;
  getOperLog();
};

// 删除
const confirmDeleteOperLog = (row) => {
  ElMessageBox.confirm(
      '你确认删除该操作日志吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 用户点击了确认
        let result = await deleteOperLog(row.id);
        ElMessage.success(result.message ? result.message : '删除成功');
        // 获取所有日志
        await getOperLog();
      })
      .catch(() => {
        // 用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        });
      });
};

// 用于存储选中的操作日志
const selectedOperLog = ref([]);

const handleSelectionChange = (selection) => {
  selectedOperLog.value = selection;
  console.log("多选框的值：" + JSON.stringify(selection));
};

// 批量删除
const batchDeleteOperLogs = async () => {
  if (selectedOperLog.value.length === 0) {
    ElMessage.warning('请选择要删除的操作日志');
    return;
  }
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedOperLog.value.length} 个操作日志吗？`,
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    const ids = selectedOperLog.value.map(item => item.id);
    console.log("此时ids的值：" + ids);
    try {
      // 传输格式 ["7197787510292930560", "7196281315379937280"]
      const result = await batchDeleteOperLog(ids);
      ElMessage.success(result.message ? result.message : '删除成功');
      await getOperLog();
    } catch (error) {
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
};

// 查询详情
const selectedOperLogDetails = ref(null);
const showLogDetailsDialog = ref(false);

const loginLogDetailsEcho = async (row) => {
  try {
    const result = await getOperLogById(row.id);
    selectedOperLogDetails.value = result.data;
    showLogDetailsDialog.value = true;
  } catch (error) {
    ElMessage.error('获取日志详情失败');
  }
};

// 关闭弹窗时，清理选中的日志详情
const clearSelectedOperLogDetails = () => {
  selectedOperLogDetails.value = null;
};

// 业务类型
const businessTypeMap = {
  OTHER: { label: '其他', type: 'info' },
  INSERT: { label: '新增', type: 'success' },
  DELETE: { label: '删除', type: 'danger' },
  BATCH_REMOVE: { label: '批量删除', type: 'danger' },
  UPDATE: { label: '修改', type: 'warning' },
  SELECT: { label: '查询', type: 'info' },
  ASSGIN: { label: '授权', type: 'success' },
  CAST: { label: '分配角色', type: 'primary' },
  EXPORT: { label: '导出', type: 'info' },
  IMPORT: { label: '导入', type: 'primary' },
  EXIT: { label: '退出', type: 'warning' },
  FORCE: { label: '强退', type: 'danger' },
  STATUS: { label: '更新状态', type: 'success' },
  CLEAN: { label: '清空数据', type: 'danger' },
  RECORD_EXCEPTIONS: { label: '记录异常', type: 'danger' },
};

// 操作类别
const operatorTypeMap = {
  OTHER: { label: '其它', type: 'info' },
  MANAGE: { label: '后台用户', type: 'primary' },
  MOBILE: { label: '手机端用户', type: 'success' },
};

const getBusinessTypeLabel = (businessType) => {
  return businessTypeMap[businessType]?.label || '未知';
};

const getBusinessTypeTagType = (businessType) => {
  return businessTypeMap[businessType]?.type || 'info';
};

const getOperatorTypeLabel = (operatorType) => {
  return operatorTypeMap[operatorType]?.label || '未知';
};

const getOperatorTypeTagType = (operatorType) => {
  return operatorTypeMap[operatorType]?.type || 'info';
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
}

</style>