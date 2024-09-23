<template>
    <div >
        <el-row class="h-[50px] border-b border-blue-500">
            <el-col :span="24">
                <el-icon class="cursor-pointer" @click="handleBack">
                    <ArrowLeft />
                </el-icon>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-image v-if="sysStore.flowDiagramUrl" :src="'data:image/png;base64,' + sysStore.flowDiagramUrl"
                    alt="流程图" fit="contain" :preview-src-list="['data:image/png;base64,' + sysStore.flowDiagramUrl]"
                    style="width: 100%; height: 100%;" :zoom-rate="1.2" :initial-index="0" :min-scale="0.2"
                    :max-scale="5">
                    <template #error>
                        <div class="image-slot">
                            <span>加载失败</span>
                        </div>
                    </template>
                </el-image>
            </el-col>
            <el-col :span="12" >
                <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="加班事由" required>
                        <el-input type="textarea" v-model="form.reason" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" required>
                        <el-date-picker v-model="form.startTime" type="datetime" placeholder="请选择时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" required>
                        <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="加班时长" required>
                        <el-input-number v-model="form.duration" :min="0" placeholder="请输入时长"></el-input-number>
                    </el-form-item>
                    <el-form-item label="所在部门" required>
                        <el-select v-model="form.department" placeholder="请选择部门">
                            <el-option label="客服中心" value="客服中心"></el-option>
                            <!-- Add more options as needed -->
                        </el-select>
                    </el-form-item>
                    <el-divider />
                    <el-form-item required>
                        <div style="color: #909399;font-size: 13px;margin-bottom: 10px;">
                            <span
                                style="color: #303133;font-weight: bold; font-size: 15px;">审批流程</span>（已由管理员预设不可修改审批人和删除抄送人）
                        </div>
                    </el-form-item>
                    <el-form-item label="审批人" required>
                        <el-select v-model="form.approvers" multiple placeholder="请选择审批人">
                            <el-option label="张三" value="张三"></el-option>
                            <el-option label="李四" value="李四"></el-option>
                            <!-- Add more options as needed -->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="抄送人" required>
                        <el-select v-model="form.cc" multiple placeholder="请选择抄送人">
                            <el-option label="王五" value="王五"></el-option>
                            <el-option label="赵六" value="赵六"></el-option>
                            <!-- Add more options as needed -->
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width: 120px;" @click="handleBack">取消</el-button>
                        <el-button style="width: 120px;" type="primary" @click="handleSave">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { useSysStore } from '@/stores/sys';
const sysStore = useSysStore();
const form = ref({
    reason: '',
    startTime: '',
    endTime: '',
    duration: 0,
    department: '',
    approvers: [],
    cc: []
});
const rules = {
    reason: [
        { required: true, message: '请输入加班事由', trigger: 'blur' }
    ],
    startTime: [
        { required: true, message: '请选择开始时间', trigger: 'change' }
    ],
    endTime: [
        { required: true, message: '请选择结束时间', trigger: 'change' }
    ],
    duration: [
        { required: true, message: '请输入加班时长', trigger: 'blur' }
    ],
    department: [
        { required: true, message: '请选择所在部门', trigger: 'change' }
    ],
    approvers: [
        { required: true, message: '请选择审批人', trigger: 'change' }
    ],
    cc: [
        { required: true, message: '请选择抄送人', trigger: 'change' }
    ]
};
const handleSave = (formEl) => {
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}
const handleBack = () => {
    console.log(12)
    sysStore.flowDiagramUrl = '';
    sysStore.selectedId = '';
}
</script>
