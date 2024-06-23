<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>登录日志</span>
        <div class="extra">
          <!-- 搜索表单 -->
          <el-form inline>
            <el-form-item label="用户名称：">
              <el-input
                  v-model="loginLogSearchObj.username"
                  :prefix-icon="Search"
                  placeholder="请输入用户名搜索"
                  @keyup.enter.native="getLoginLog"
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
                <el-button type="primary" @click="getLoginLog">搜索</el-button>
                <el-button type="info" @click="resetLoginLogSearch">重置</el-button>
                <el-button type="danger" @click="batchDeleteLoginLogs" :disabled="selectedLoginLog.length === 0">批量删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </template>

    <!-- 文章列表 -->
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
      <el-table-column label="用户" width="150" prop="username"></el-table-column>
      <el-table-column label="登录IP" prop="loginIp"></el-table-column>
      <el-table-column label="IP来源" prop="loginIpSource"></el-table-column>
      <el-table-column label="IP归属地" prop="loginIpCity"></el-table-column>
      <el-table-column label="返回消息" prop="msg"></el-table-column>
      <el-table-column label="登录时间" prop="createTime"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100">
        <template #default="{ row }">
          <el-button :icon="More" circle plain type="primary" @click="loginLogDetailsEcho(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="confirmDeleteLoginLog(row)"></el-button>
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
        @close="clearSelectedLoginLogDetails">
      <div v-if="selectedLoginLogDetails">
        <p><strong>用户：</strong> {{ selectedLoginLogDetails.username }}</p>
        <p><strong>登录IP：</strong> {{ selectedLoginLogDetails.loginIp }}</p>
        <p><strong>IP来源：</strong> {{ selectedLoginLogDetails.loginIpSource }}</p>
        <p><strong>IP归属地：</strong> {{ selectedLoginLogDetails.loginIpCity }}</p>
        <p><strong>返回消息：</strong> {{ selectedLoginLogDetails.msg }}</p>
        <p><strong>登录时间：</strong> {{ selectedLoginLogDetails.createTime }}</p>
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
import {getLoginLogList, getLoginLogById, deleteLoginLog, batchDeleteLoginLog} from '@/api/loginLog';

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

// 登录日志数据模型
const loginLogs = ref([]);

// 初始化搜索条件
const loginLogSearchObj = ref({
  current: 1,
  limit: 10,
  username: '',
  createTimeBegin: '',
  createTimeEnd: '',

  loginIp: '',
  loginIpSource: '',
  loginIpCity: '',
  msg: '',
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
 * 获取登录日志列表
 */
const getLoginLog = async () => {
  loading.value = true;
  let result = await getLoginLogList(loginLogSearchObj.value);
  loginLogs.value = result.data.records;
  total.value = result.data.total;
  loading.value = false;
};

// 页面初始化时加载
onMounted(() => {
  getLoginLog();
});


// 清空搜索条件
const resetLoginLogSearch = () => {
  loginLogSearchObj.value = {
    current: 1,
    limit: 10,
    username: '',
    createTimeBegin: '',
    createTimeEnd: '',
  };
  loginLogCreateTimes.value = [];
  getLoginLog();
};

// 初始化总条数
const total = ref(0);

// 处理分页变化
const handlePageChange = (page) => {
  loginLogSearchObj.value.current = page;
  getLoginLog();
};

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  loginLogSearchObj.value.limit = size;
  getLoginLog();
};

// 删除
const confirmDeleteLoginLog = (row) => {
  ElMessageBox.confirm(
      '你确认删除该登录日志吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 用户点击了确认
        let result = await deleteLoginLog(row.id);
        ElMessage.success(result.message ? result.message : '删除成功');
        // 获取所有日志
        await getLoginLog();
      })
      .catch(() => {
        // 用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        });
      });
};

// 用于存储选中的登录日志
const selectedLoginLog = ref([]);

const handleSelectionChange = (selection) => {
  selectedLoginLog.value = selection;
  console.log("多选框的值：" + JSON.stringify(selection));
};

// 批量删除
const batchDeleteLoginLogs = async () => {
  if (selectedLoginLog.value.length === 0) {
    ElMessage.warning('请选择要删除的登录日志');
    return;
  }
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedLoginLog.value.length} 个登录日志吗？`,
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    const ids = selectedLoginLog.value.map(item => item.id);
    console.log("此时ids的值：" + ids);
    try {
      // 传输格式 ["7197787510292930560", "7196281315379937280"]
      const result = await batchDeleteLoginLog(ids);
      ElMessage.success(result.message ? result.message : '删除成功');
      await getLoginLog();
    } catch (error) {}
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
};

// 查询详情
const selectedLoginLogDetails = ref(null);
const showLogDetailsDialog = ref(false);

const loginLogDetailsEcho = async (row) => {
  try {
    const result = await getLoginLogById(row.id);
    selectedLoginLogDetails.value = result.data;
    showLogDetailsDialog.value = true;
  } catch (error) {
    ElMessage.error('获取日志详情失败');
  }
};

// 关闭弹窗时，清理选中的日志详情
const clearSelectedLoginLogDetails = () => {
  selectedLoginLogDetails.value = null;
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