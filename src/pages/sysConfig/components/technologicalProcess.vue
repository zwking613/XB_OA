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
      <!-- :preview-src-list="[
            'data:image/png;base64,' + sysStore.flowDiagramUrl,
            ]" -->
      <el-col :span="12">
        <el-image v-if="sysStore.flowDiagramUrl" :src="'data:image/png;base64,' + sysStore.flowDiagramUrl" alt="流程图"
          fit="contain" style="width: 100%; height: 100%" :zoom-rate="1.2" :initial-index="0" :min-scale="0.2"
          :max-scale="5">
          <template #error>
            <div class="image-slot">
              <span>加载失败</span>
            </div>
          </template>
        </el-image>
      </el-col>
      <el-col :span="12">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="请假类型" required prop="leaveType">
            <el-select v-model="form.leaveType" placeholder="请选择请假类型">
              <el-option label="事假" value="事假"></el-option>
              <el-option label="病假" value="病假"></el-option>
              <el-option label="调休" value="调休"></el-option>
              <el-option label="年假" value="年假"></el-option>
              <el-option label="婚假" value="婚假"></el-option>
              <el-option label="产假" value="产假"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间" required prop="startTime">
            <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" format="YYYY/MM/DD"
               :disabled-date="
                (time) => time.getTime() < new Date().getTime() - 86400000
              "></el-date-picker>
            <el-select class="select_width" v-model="form.startPeriod" placeholder="选择时间">
              <el-option label="上午" value="上午"></el-option>
              <el-option label="下午" value="下午"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="结束时间" required prop="endTime">
            <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" format="YYYY/MM/DD"
               :disabled-date="
                (time) => time.getTime() < new Date().getTime() - 86400000
              "></el-date-picker>
            <el-select class="select_width" v-model="form.endPeriod" placeholder="选择时间">
              <el-option label="上午" value="上午"></el-option>
              <el-option label="下午" value="下午"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请假事由" required prop="reason">
            <el-input type="textarea" v-model="form.reason" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="说明附件">
            <el-upload :action="upload" :limit="1" :on-remove="handleRemove" :file-list="form.attachment"
              :on-success="handleSuccess" :data="{ model: 'REIMBURSEMENT' }">
              <el-button size="small">添加附件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="部门" required prop="department">
            <el-select v-model="form.department" placeholder="请选择部门">
              <el-option v-for="item in depList" :key="item.deptId" :label="item.deptName"
                :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-divider />
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
          <el-form-item>
            <el-button style="width: 120px" @click="handleBack">取消</el-button>
            <el-button style="width: 120px" type="primary" @click="handleSave">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { useSysStore } from "@/stores/sys";
import { useAppStore } from '@/stores/app'
import SelectLimit from "@/components/form/SelectLimit.vue";
import { upload } from "@/services/upload.js";
import { post } from "@/utils/request";
const sysStore = useSysStore();
const appStore = useAppStore();

const form = ref({
  leaveType: "", // 请假类型
  startTime: "", // 开始日期
  startPeriod: "上午", // 开始时间
  endTime: "", // 结束日期
  endPeriod: "上午", // 结束时间
  reason: "", // 请假事由
  attachmentId: [], // 说明附件
  approvers: 1, // 审批人
  ccPerson: [], // 抄送人
  department: '', // 部门
});
const departmentList = () => {
  const deptIdArray = appStore.userInfo.deptId ? appStore.userInfo.deptId.split(',') : [];
  const deptNameArray = appStore.userInfo.deptName ? appStore.userInfo.deptName.split(',') : [];
  if (deptIdArray.length === 0 && deptNameArray.length === 0) return [];
  const result = [];
  for (let i = 0; i < deptIdArray.length; i++) {
    result.push({ deptId: deptIdArray[i], deptName: deptNameArray[i] });
  }
  form.value.department = result[0].deptId;
  return result;
};
const depList = ref(departmentList());
const formRef = ref(null);
const rules = {
  leaveType: [{ required: true, message: "请选择请假类型", trigger: "change" }],
  startTime: [{ required: true, message: "请选择开始日期", trigger: "change" }],
  startPeriod: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endTime: [{ required: true, message: "请选择结束日期", trigger: "change" }],
  endPeriod: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  reason: [{ required: true, message: "请输入请假事由", trigger: "blur" }],
  attachmentId: [ { required: true, message: "请上传说明附件", trigger: "change" }],
  approvers: [{ required: true, message: "请选择审批人", trigger: "change" }],
  ccPerson: [{ required: true, message: "请选择抄送人", trigger: "change" }],
};

const handleSuccess = (response, file, fileList) => {
  console.log(response);
  if (response.code === 200) {
    form.value.attachmentId=[{
      name: file.name,
      url: file.url,
      id: response.list,
    }];
  }
};

const handleRemove = (file, fileList) => {
  console.log(file,fileList);
  form.value.attachmentId = []
};
// 提交
const handleSave = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const data = {
        dateJson:JSON.stringify({
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
        deployId:sysStore.selected.id,
        type:sysStore.selected.key
      }
      sysStore.startProcess(data);
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
const handleBack = () => {
  sysStore.flowDiagramUrl = "";
  sysStore.selectedId ={};
};
const getFlow = async() => {
 await post('/sys/getByName', { name: depList.value.find(item => item.deptId === form.value.department).deptName }).then(res => {
    if (res.code === 200) {
      const approver = res.list.value ? JSON.parse(res.list.value).approver : ''
      const ccPerson = res.list.value ? JSON.parse(res.list.value).ccPerson : ''
      form.value.approvers = approver ? Number(approver.split('%')[0]) : '';
      form.value.ccPerson = ccPerson ? ccPerson.split(',').map(item => Number(item.split('%')[0])) : '';
    }
  });
}
watch([() => form.value.department], ([department]) => {
  getFlow();
}, { immediate: true ,deep:true});
</script>
<style scoped>
.select_width {
  width: 100px !important;
}
</style>
