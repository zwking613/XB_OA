<template>
  <div class="to-be-processed">
    <el-empty
      :image-size="200"
      description="暂无数据"
      v-if="sysStore.submittedList.length === 0"
    />
    <div
      v-else
      v-for="item in sysStore.submittedList"
      :key="item.id"
      class="to-be-processed-content"
      @click="handleCopyMe(item)"
    >
      <div class="to-be-processed-header">
        <span class="title">{{ item.name }}</span>
        <el-tag size="small" :type="tarType(item.businessData.stats)">{{
          item.businessData.stats
        }}</el-tag>
      </div>
      <div class="info-item">
        <span class="time">{{
          item.businessData.createdAt
        }}</span>
      </div>
      <div class="info-item">
        <span class="label">请假类型：</span>
        <span class="value">{{ item.businessData.leaveType }}</span>
      </div>
      <div class="info-item">
        <span class="label">开始时间：</span>
        <span class="value"
          >{{ item.businessData.startTime.split(" ")[0] }}
          {{ item.businessData.startPeriod }}</span
        >
      </div>
      <div class="info-item">
        <span class="label">结束时间：</span>
        <span class="value"
          >{{ item.businessData.endTime.split(" ")[0] }}
          {{ item.businessData.endPeriod }}</span
        >
      </div>
    </div>
    <el-dialog v-model="dialogVisible" width="500" destroy-on-close>
      <el-descriptions :column="1" border label-align="center" align="center">
        <el-descriptions-item label-align="center" label="申请类型">{{
          copyInfo.name
        }}</el-descriptions-item>
        <el-descriptions-item label-align="center" label="部门">{{
          copyInfo.businessData.departmentName
        }}</el-descriptions-item>
        <el-descriptions-item label-align="center" label="请假类型">{{
          copyInfo.businessData.leaveType
        }}</el-descriptions-item>
        <el-descriptions-item label-align="center" label="开始时间">
          {{ copyInfo.businessData.startTime.split(" ")[0] }}
          {{ copyInfo.businessData.startPeriod }}
        </el-descriptions-item>
        <el-descriptions-item label-align="center" label="结束时间">
          {{ copyInfo.businessData.endTime.split(" ")[0] }}
          {{ copyInfo.businessData.endPeriod }}
        </el-descriptions-item>
        <el-descriptions-item label-align="center" label="请假原因">{{
          copyInfo.businessData.reason
        }}</el-descriptions-item>
        <el-descriptions-item label-align="center" label="审批人">{{
          copyInfo.businessData.approverName
        }}</el-descriptions-item>
        <el-descriptions-item label-align="center" label="抄送人">{{
          copyInfo.businessData.ccPersonName
        }}</el-descriptions-item>
        <el-descriptions-item label-align="center" label="发起人">{{
          copyInfo.businessData.initiatorName
        }}</el-descriptions-item>
        <el-descriptions-item label-align="center" label="附件">
          <el-link
            v-if="copyInfo.businessData.attachmentId"
            @click="handleDownload(copyInfo.businessData.attachmentId)"
            type="primary"
            target="_blank"
            >下载查看
          </el-link>
          <span v-else>无</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSysStore } from "@/stores/sys";
import { download } from "@/services/upload";
const sysStore = useSysStore();
const copyInfo = ref({});
const dialogVisible = ref(false);

const handleCopyMe = (item) => {
  copyInfo.value = item;
  dialogVisible.value = true;
};

const tarType = (status) => {
  if (status === "已通过") {
    return "success";
  } else if (status === "未通过") {
    return "danger";
  } else if (status === "待审核") {
    return "primary";
  } else {
    return "info";
  }
};

const handleDownload = (attachmentId) => {
  window.open(`${download}?fileId=${attachmentId}`, "_self");
};

onMounted(async () => {});
</script>

<style scoped lang="less">
.to-be-processed {
  height: calc(100vh - 200px);
  overflow-y: auto;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.detail-content {
  height: 640px;
  overflow-y: auto;
}

.to-be-processed-content {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  padding: 20px;
  cursor: pointer;
}

.label {
  font-size: 14px;
  margin-right: 10px;
}

.value {
  font-size: 14px;
  color: #606266;
}
.title {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
  color: #606266;
}
.time {
  font-size: 14px;
  color: #909399;
}

/* Webkit browsers (Chrome, Safari) */
.to-be-processed::-webkit-scrollbar,
.detail-content::-webkit-scrollbar {
  width: 4px;
}

.to-be-processed::-webkit-scrollbar-track,
.detail-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.to-be-processed::-webkit-scrollbar-thumb,
.detail-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.to-be-processed::-webkit-scrollbar-thumb:hover,
.detail-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox */
.to-be-processed,
.detail-content {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>

