<template>
  <div>
    <el-row class="h-[50px] border-b border-blue-500">
      <el-col :span="24">
        <el-icon class="cursor-pointer" @click="handleBack">
          <ArrowLeft />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-image v-if="sysStore.flowDiagramUrl" :src="'data:image/png;base64,' + sysStore.flowDiagramUrl" alt="流程图"
          fit="contain" style="width: 100%; height: 100%" :zoom-rate="1.2" :initial-index="0" :min-scale="0.2"
          :max-scale="5" :preview-src-list="[
            'data:image/png;base64,' + sysStore.flowDiagramUrl,
          ]">
          <template #error>
            <div class="image-slot">
              <span>加载失败</span>
            </div>
          </template>
        </el-image>
      </el-col>
      <el-col :span="12" class="form_list">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
          <template v-if="selectKey === 'leave'">
            <el-form-item label="请假类型" required prop="leaveType">
              <el-select v-model="form.leaveType" placeholder="请选择请假类型">
                <el-option v-for="type in leaveTypes" :key="type" :label="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请假事由" required prop="reason">
              <el-input type="textarea" v-model="form.reason" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="说明附件">
              <el-upload :action="upload" :limit="1" :on-remove="handleRemove" :file-list="form.attachmentId"
                :on-success="handleSuccess" :data="{ model: 'REIMBURSEMENT' }">
                <el-button size="small">添加附件</el-button>
              </el-upload>
            </el-form-item>
          </template>

          <template v-if="selectKey === 'reimbursement_process'">
            <el-form-item label="费用类型" required prop="expenseType">
              <el-select v-model="form.expenseType" placeholder="请选择费用类型" @change="expenseTypeChange">
                <el-option v-for="type in expenseTypes" :key="type.value" :label="type.label"
                  :value="type.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="附件" required prop="attachmentId">
              <el-upload :action="upload" :limit="1000" :on-remove="handleRemove" :file-list="form.attachmentId"
                :on-success="handleSuccess" :data="{ model: 'REIMBURSEMENT' }" :multiple="true">
                <el-button size="small">上传附件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item v-if="form.expenseType === 'IMPLEMENTATION_FEE'" label="报销金额" required prop="reimbursementAmount">
              <el-input type="number" v-model="form.reimbursementAmount" placeholder="请输入报销金额"></el-input>
            </el-form-item>
            <el-form-item label="所属项目" v-if="form.expenseType !=='DAILY_EXPENSES'" required prop="project">
              <SelectLimit v-model="form.project" url="/sys/getProjectList" dataKey="list" labelKey="name"
                valueKey="name" searchKey="name" placeholder="请选择所属项目" tag-type="warning" />
            </el-form-item>
            <el-form-item label="地点" required prop="place">
              <el-input type="text" v-model="form.place" placeholder="请输入地点"></el-input>
            </el-form-item>
            <el-form-item label="拜访单位" required prop="company">
              <el-input type="text" v-model="form.company" placeholder="拜访单位"></el-input>
            </el-form-item>
            <el-form-item label="关联工单" required prop="businessTravel">
              <el-input type="text" v-model="form.businessTravel" placeholder="请输入关联工单"></el-input>
            </el-form-item>
          </template>

          <template v-if="selectKey === 'leave' || selectKey === 'reimbursement_process'">
            <el-form-item label="开始时间" required prop="startTime">
              <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" format="YYYY/MM/DD"
                :disabled-date="getDisabledDate"></el-date-picker>
              <el-select class="select_width" v-model="form.startPeriod" placeholder="选择时间">
                <el-option label="上午" value="上午"></el-option>
                <el-option label="下午" value="下午"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="结束时间" required prop="endTime">
              <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" format="YYYY/MM/DD"
                :disabled-date="getDisabledDate"></el-date-picker>
              <el-select class="select_width" v-model="form.endPeriod" placeholder="选择时间">
                <el-option label="上午" value="上午"></el-option>
                <el-option label="下午" value="下午"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="部门" required prop="department">
              <el-select v-model="form.department" placeholder="请选择部门">
                <el-option v-for="item in depList" :key="item.deptId" :label="item.deptName"
                  :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
          </template>

          <el-divider v-if="selectKey === 'leave'" />
          <template v-if="selectKey === 'leave'">
            <div style="color: #909399; font-size: 13px; margin-bottom: 10px">
              <span style="color: #303133; font-weight: bold; font-size: 15px">审批流程</span>（已由管理员预设不可修改审批人和删除抄送人）
            </div>
            <el-form-item label="审批人" required prop="approvers">
              <SelectLimit v-model="form.approvers" url="/user/page" :dataKey="['list', 'list']" labelKey="userName"
                valueKey="id" searchKey="name" placeholder="请选择审批人" disabled />
            </el-form-item>
            <el-form-item label="抄送人" required prop="ccPerson">
              <SelectLimit v-model="form.ccPerson" url="/user/page" :dataKey="['list', 'list']" labelKey="userName"
                valueKey="id" searchKey="name" placeholder="请选择抄送人" :multiple="true" tag-type="warning" disabled />
            </el-form-item>
          </template>

          <el-form-item label="费用明细" v-if="selectKey === 'reimbursement_process'">
            <el-table :data="tableData" border height="200px" style="width: 100%;">
              <el-table-column prop="index" label="序号" width="80"></el-table-column>
              <el-table-column prop="participant" :label="form.expenseType === 'IMPLEMENTATION_FEE' ? '参与人' : '项目名称'"
                width="180">
                <template #default="scope">
                  <SelectLimit v-if="form.expenseType !== 'IMPLEMENTATION_FEE'" v-model="scope.row.participant"
                    :url="`/sys/getReiTypeList?type=${form.expenseType}`" dataKey="list" labelKey="name" valueKey="name"
                    searchKey="name" placeholder="请选择项目" tag-type="warning" />
                  <el-input v-else v-model="scope.row.participant" placeholder="请输入参与人"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="participationCount"
                :label="form.expenseType === 'IMPLEMENTATION_FEE' ? '参与天数' : '费用占比(元)'" width="180">
                <template #default="scope">
                  <el-input-number v-model="scope.row.participationCount" :min="0" :step="0.5" :max="999"
                    :placeholder="form.expenseType === 'IMPLEMENTATION_FEE' ? '请输入参与天数' : '请输入费用占比(元)'"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template #default="scope">
                  <el-input v-model="scope.row.remark" placeholder="请输入备注"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-form-item>
              <el-button @click="addRow" type="primary" style="margin-top: 10px;">添加行</el-button>
              <el-button @click="deleteRow" type="primary" style="margin-top: 10px;">删除行</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-col>
      <div class="flex justify-center mt-5 w-full">
        <el-button style="width: 120px" @click="handleBack">取消</el-button>
        <el-button style="width: 120px" type="primary" @click="handleSave">提交</el-button>
      </div>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useSysStore } from "@/stores/sys";
import { useAppStore } from '@/stores/app'
import SelectLimit from "@/components/form/SelectLimit.vue";
import { upload } from "@/services/upload.js";
import { post } from "@/utils/request";

const sysStore = useSysStore();
const appStore = useAppStore();

const selectKey = ref(sysStore.selected.key)
const tableData = ref([
  { index: 1, participant: '', participationCount: null, remark: '' }
]);

const leaveTypes = ['事假', '病假', '调休', '年假', '婚假', '产假', '其他'];
const expenseTypes = [
  { label: '实施费', value: 'IMPLEMENTATION_FEE' },
  { label: '差旅费', value: 'TRAVEL_EXPENSES' },
  { label: '日常开支', value: 'DAILY_EXPENSES' }
];

const form = ref({
  leaveType: "",
  startTime: "",
  startPeriod: "上午",
  endTime: "",
  endPeriod: "上午",
  reason: "",
  attachmentId: [],
  approvers: 1,
  ccPerson: [],
  department: '',
  reimbursementAmount: "",
  project: '',
  place: "",
  company: "",
  businessTravel: '',
  expenseType: "IMPLEMENTATION_FEE",
});

const departmentList = computed(() => {
  const deptIdArray = appStore.userInfo.deptId ? appStore.userInfo.deptId.split(',') : [];
  const deptNameArray = appStore.userInfo.deptName ? appStore.userInfo.deptName.split(',') : [];
  if (deptIdArray.length === 0 && deptNameArray.length === 0) return [];
  const result = deptIdArray.map((id, index) => ({ deptId: id, deptName: deptNameArray[index] }));
  if (result.length > 0 && !form.value.department) {
    form.value.department = result[0].deptId;
  }
  return result;
});

const depList = computed(() => departmentList.value);

const formRef = ref(null);

const rules = {
  leaveType: [{ required: true, message: "请选择请假类型", trigger: "change" }],
  startTime: [{ required: true, message: "请选择开始日期", trigger: "change" }],
  startPeriod: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endTime: [{ required: true, message: "请选择结束日期", trigger: "change" }],
  endPeriod: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  reason: [{ required: true, message: "请输入请假事由", trigger: "blur" }],
  attachmentId: [{ required: true, message: "请上传说明附件", trigger: "change" }],
  approvers: [{ required: true, message: "请选择审批人", trigger: "change" }],
  ccPerson: [{ required: true, message: "请选择抄送人", trigger: "change" }],
  businessTravel: [{ required: true, message: "请选择光联工单", trigger: "change" }],
  place: [{ required: true, message: "请输入地点", trigger: "blur" }],
  company: [{ required: true, message: "请输入拜访单位", trigger: "blur" }],
  reimbursementAmount: [{ required: true, message: "请输入报销金额", trigger: "blur" }],
  project: [{ required: true, message: "请选择所属项目", trigger: "change" }],
  expenseType: [{ required: true, message: "请选择费用类型", trigger: "change" }],
};

const expenseTypeChange = () => {
  tableData.value = tableData.value.map((item, index) => ({
    index: index + 1,
    participant: '',
    participationCount: null,
    remark: ''
  }));
}

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
  if(tableData.value.length > 1){
    tableData.value.pop();
  } else {
    ElMessage.error('最少保留一行');
  }
};

const handleSuccess = async (response, file, fileList) => {
  if (response.code === 200) {
    if (selectKey.value === 'reimbursement_process') {
      form.value.attachmentId = fileList.map(item => ({
        name: item.name,
        url: item.url,
        id: item.response.list,
      }));
    } else {
      form.value.attachmentId = [{
        name: file.name,
        url: file.url,
        id: response.list,
      }];
    }
  } else {
    ElMessage.error(response.list);
  }
};

const handleRemove = (file, fileList) => {
  form.value.attachmentId = selectKey.value === 'reimbursement_process'
    ? fileList.map(item => ({
        name: item.name,
        url: item.url,
        id: item.response.list,
      }))
    : [];
};

const handleSave = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const data = selectKey.value === 'reimbursement_process'
        ? prepareReimbursementData()
        : prepareLeaveData();
      sysStore.startProcess(data);
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

const prepareReimbursementData = () => {
  const tableDataJson = tableData.value.map(item => ({
    [form.value.expenseType === '差旅费' ? 'type' : 'participants']: item.participant,
    [form.value.expenseType === '差旅费' ? 'cost' : 'days']: item.participationCount,
    remark: item.remark,
  }));

  return {
    dateJson: JSON.stringify({
      startTime: form.value.startTime,
      startPeriod: form.value.startPeriod,
      endTime: form.value.endTime,
      endPeriod: form.value.endPeriod,
      place: form.value.place,
      company: form.value.company,
      businessTravel: form.value.businessTravel,
      type: form.value.expenseType,
      reimbursementAmount: form.value.reimbursementAmount,
      project: form.value.project,
      department: form.value.department,
      attachmentId: form.value.attachmentId.map(item => item.id).join(','),
    }) + '&' + JSON.stringify(tableDataJson),
    deployId: sysStore.selected.id,
    type: sysStore.selected.key
  };
};

const prepareLeaveData = () => ({
  dateJson: JSON.stringify({
    approver: form.value.approvers,
    ccPerson: form.value.ccPerson.join(','),
    department: form.value.department,
    leaveType: form.value.leaveType,
    startTime: form.value.startTime,
    startPeriod: form.value.startPeriod,
    endTime: form.value.endTime,
    endPeriod: form.value.endPeriod,
    reason: form.value.reason,
    attachmentId: form.value.attachmentId[0]?.id,
  }),
  deployId: sysStore.selected.id,
  type: sysStore.selected.key
});

const handleBack = () => {
  sysStore.flowDiagramUrl = "";
  sysStore.selectedId = {};
};

const getFlow = async() => {
  const selectedDept = depList.value.find(item => item.deptId === form.value.department);
  if (selectedDept) {
    const res = await post('/sys/getByName', { name: selectedDept.deptName });
    if (res.code === 200 && res.list.value) {
      const { approver, ccPerson } = JSON.parse(res.list.value);
      form.value.approvers = approver ? Number(approver.split('%')[0]) : '';
      form.value.ccPerson = ccPerson ? ccPerson.split(',').map(item => Number(item.split('%')[0])) : [];
    }
  }
};

watch(() => form.value.department, getFlow, { immediate: true });

const getDisabledDate = (time) => {
  const currentDate = new Date().getTime() - 86400000;
  return selectKey.value === 'reimbursement_process'
    ? time.getTime() >= currentDate
    : time.getTime() < currentDate;
};
</script>

<style scoped>
.select_width {
  width: 100px !important;
}
.form_list {
  user-select: none;
  height: calc(100vh - 300px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.form_list::-webkit-scrollbar {
  width: 8px;
}

.form_list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.form_list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.form_list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
