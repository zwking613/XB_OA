<template>
  <div>
    <div style="margin-bottom: 10px;display: flex;">
      <el-select style="width: 100px;" v-model="sysStore.searchType" @change="searchTypeChange" placeholder="请选择">
        <el-option label="全部" value="all" />
        <el-option label="我审核的" :value="0" />
        <el-option label="我发起的" :value="1" />
      </el-select>
      <el-select style="width: 100px;" v-model="sysStore.listType" @change="listTypeChange" placeholder="请选择">
        <el-option label="报销" value="reimbursement_process" />
      </el-select>
    </div>
    <div class="to-be-processed">
      <div v-for="item in sysStore.submittedList" :key="item.id" class="to-be-processed-content"
        @click="handleCopyMe(item)">
        <div class="to-be-processed-header">
          <span class="title">{{ type[sysStore.listType] }}</span>
          <el-tag size="small" type="success">{{
            item.businessData.statusName
          }}</el-tag>
        </div>
        <div class="info-item">
          <span class="time">{{
            item.businessData.createdAt
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ type[sysStore.listType] }}类型：</span>
          <span class="value">{{ item.businessData.typeName }}</span>
        </div>
        <div class="info-item">
          <span class="label">开始时间：</span>
          <span class="value">{{ item.businessData.startTime.split(" ")[0] }}
            {{ item.businessData.startPeriod }}</span>
        </div>
        <div class="info-item">
          <span class="label">结束时间：</span>
          <span class="value">{{ item.businessData.endTime.split(" ")[0] }}
            {{ item.businessData.endPeriod }}</span>
        </div>
      </div>
      <el-dialog v-model="dialogVisible" width="800" destroy-on-close>

        <el-descriptions v-if="sysStore.listType === 'reimbursement_process'" title="报销详情" :column="2" border
          label-align="center" align="center">
          <el-descriptions-item label-align="center" align="center" label="发起人">{{
            copyInfo.businessData.submitUserName
            }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="发起时间">{{
            copyInfo.businessData.submitDate
            }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="费用类型">{{
            copyInfo.businessData.typeName
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="报销金额">{{
            copyInfo.businessData.reimbursementAmount
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="地点">
            {{ copyInfo.businessData.place }}
          </el-descriptions-item>

          <el-descriptions-item label-align="center" align="center" label="所属项目">
            {{ copyInfo.businessData.project }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="拜访单位">
            {{ copyInfo.businessData.company }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="关联工单">
            {{ copyInfo.businessData.businessTravel }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="开始时间">
            {{ copyInfo.businessData.startTime.split(" ")[0] }} - {{ copyInfo.businessData.startPeriod }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="结束时间">
            {{ copyInfo.businessData.endTime.split(" ")[0] }} - {{ copyInfo.businessData.endPeriod }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="部门">{{
            copyInfo.businessData.departmentName
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="附件">
            <div v-for="item in copyInfo.businessData.fileList" :key="item.fileId">
              <el-link type="success" :href="`${download}?fileId=${item.fileId
                }`">{{ item.fileName }}</el-link>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="费用明细" :span="2">
            <el-table :data="copyInfo.businessData.details" border style="width: 100%;">
              <el-table-column prop="participants"
                :label="copyInfo.businessData.type === 'IMPLEMENTATION_FEE' ? '参与人' : '项目名称'" width="180">
              </el-table-column>
              <el-table-column prop="days"
                :label="copyInfo.businessData.type === 'IMPLEMENTATION_FEE' ? '参与天数' : '费用占比(元)'"
                width="180"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="修改" v-if="copyInfo.businessData.status === 'ACCOUNTING'">
                <template #default="scope">
                  <el-button link size="small" type="warning"
                    @click="edit(scope.row, copyInfo.businessData)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions v-if="sysStore.listType === 'leave_process'" title="请假详情" :column="1" border
          label-align="center" align="center">
          <el-descriptions-item label-align="center" align="center" label="申请类型">{{
            copyInfo.name
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="部门">{{
            copyInfo.businessData.departmentName
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="请假类型">{{
            copyInfo.businessData.leaveType
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="开始时间">
            {{ copyInfo.businessData.startTime.split(" ")[0] }}
            {{ copyInfo.businessData.startPeriod }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="结束时间">
            {{ copyInfo.businessData.endTime.split(" ")[0] }}
            {{ copyInfo.businessData.endPeriod }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="请假原因">{{
            copyInfo.businessData.reason
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="审批人">{{
            copyInfo.businessData.approverName
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="抄送人">{{
            copyInfo.businessData.ccPersonName
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="发起人">{{
            copyInfo.businessData.initiatorName
          }}</el-descriptions-item>
          <el-descriptions-item label-align="center" align="center" label="附件">
            <el-link v-if="copyInfo.businessData.attachmentId"
              @click="handleDownload(copyInfo.businessData.attachmentId)" type="primary" target="_blank">下载查看
            </el-link>
            <span v-else>无</span>
          </el-descriptions-item>
        </el-descriptions>
        <el-image :src="`/api/flowable/getTaskProcessDiagram?taskId=${copyInfo.id}`" alt="流程图" fit="contain"
          style="width: 100%; height: 100%" :zoom-rate="1.2" :initial-index="0" :min-scale="0.2" :max-scale="5"
          :preview-src-list="[`/api/flowable/getTaskProcessDiagram?taskId=${copyInfo.id}`]">
          <template #error>
            <div class="image-slot">
              <span>加载失败</span>
            </div>
          </template>
        </el-image>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <!-- <el-button type="danger" @click="audit(copyInfo, 'REJECT')">不通过</el-button> -->
            <el-button type="success" @click="audit(copyInfo, 'PASS')">通过</el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog title="编辑" v-model="editDialogVisible" width="40%">
        <el-form ref="formRef" :model="orderInfo" label-width="120px">
          <el-form-item label="费用明细">
            <el-table :data="tableData" border style="width: 100%;">
              <el-table-column prop="index" label="序号" width="80"></el-table-column>
              <el-table-column prop="participant" :label="orderInfo.type === 'IMPLEMENTATION_FEE' ? '参与人' : '项目名称'"
                width="180">
                <template #default="scope">
                  <SelectLimit v-if="orderInfo.type !== 'IMPLEMENTATION_FEE'" v-model="scope.row.participant"
                    :url="`/sys/getReiTypeList?type=${orderInfo.type}`" dataKey="list" labelKey="name" valueKey="name"
                    searchKey="name" placeholder="请选择项目" tag-type="warning" />
                  <el-input v-else v-model="scope.row.participant" placeholder="请输入参与人"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="participationCount"
                :label="orderInfo.type === 'IMPLEMENTATION_FEE' ? '参与天数' : '费用占比(元)'" width="180">
                <template #default="scope">
                  <el-input-number v-model="scope.row.participationCount" :min="0" :step="0.5" :max="999"
                    :placeholder="orderInfo.type === 'IMPLEMENTATION_FEE' ? '请输入参与天数' : '请输入费用占比(元)'"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template #default="scope">
                  <el-input v-model="scope.row.remark" placeholder="请输入备注"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="success" @click="submit">提交</el-button>
          </div>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSysStore } from "@/stores/sys";
import { download } from "@/services/upload";
const sysStore = useSysStore();
const copyInfo = ref({});
const dialogVisible = ref(false);
const editDialogVisible = ref(false);
const tableData = ref([])
const orderInfo = ref({})


const addRow = () => {
  const newIndex = tableData.value.length + 1;
  tableData.value.push({
    index: newIndex,
    participant: '',
    participationCount: null,
    remark: ''
  });
};

const deleteRow = () => {
  if (tableData.value.length > 1) {
    tableData.value.pop();
  } else {
    ElMessage.error('最少保留一行');
  }
};
const type = {
  reimbursement_process: "报销",
}
const handleCopyMe = (item) => {
  copyInfo.value = item;
  dialogVisible.value = true;
  // sysStore.getProgressUrl(item.id,()=>{

  // });

};


const edit = (item, info) => {

  tableData.value = [item].map((item, index) => {
    return {
      index: index + 1,
      id: item.id,
      participant: item.participants,
      participationCount: item.reimbursementId,
      remark: item.remark
    }
  });
  orderInfo.value = info;
  editDialogVisible.value = true;
};
const submit = () => {
  const tableDataJson = tableData.value.map(item => ({
    [orderInfo.value.type === '差旅费' ? 'type' : 'participants']: item.participant,
    [orderInfo.value.type === '差旅费' ? 'cost' : 'days']: item.participationCount,
    id: item.id,
    remark: item.remark,
  }));
  sysStore.update(tableDataJson[0], () => {
    editDialogVisible.value = false;
    dialogVisible.value = false;
  });
}




const audit = (item, type) => {
  sysStore.audit({ taskId: item.id }, () => {
    dialogVisible.value = false;
  })
}



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

const searchTypeChange = (val) => {
  sysStore.searchType = val;
}

const listTypeChange = (val) => {
  sysStore.listType = val;
}

watch([() => sysStore.searchType, () => sysStore.searchValue], () => {
  sysStore.getTodoList()
})

onMounted(async () => { });
</script>

<style scoped lang="less">
.to-be-processed {
  height: calc(100vh - 300px);
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