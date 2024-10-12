<template>
    <el-tabs type="border-card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane>
            <!-- name="approval" -->
            <template #label>
                <span class="custom-tabs-label">
                    <el-icon>
                        <calendar />
                    </el-icon>
                    <span>审核配置</span>
                </span>
            </template>
            <approval-config />
        </el-tab-pane>
        <el-tab-pane name="project">
            <template #label>
                <span class="custom-tabs-label">
                    <el-icon>
                        <calendar />
                    </el-icon>
                    <span>项目配置</span>
                </span>
            </template>
            <project-config type="project" />
        </el-tab-pane>

        <el-tab-pane name="reimbursement_items">
            <template #label>
                <span class="custom-tabs-label">
                    <el-icon>
                        <calendar />
                    </el-icon>
                    <span>报销配置</span>
                </span>
            </template>
            <rei-type-config type="reimbursement_items" />
        </el-tab-pane>
        <!-- <el-tab-pane name="reimbursement_allocation">
            <template #label>
                <span class="custom-tabs-label">
                    <el-icon>   
                        <calendar />
                    </el-icon>
                    <span>报销审核配置</span>
                </span>
            </template>
            <reimbursement-allocation />
        </el-tab-pane> -->
    </el-tabs>
</template>
<script setup>
import { Calendar } from '@element-plus/icons-vue'
import ProjectConfig from './components/ProjectConfig.vue'
import ApprovalConfig from './components/approvalConfig.vue'
import ReiTypeConfig from './components/ReiTypeConfig.vue'
import { useConfigStore } from '@/stores/config'
import { useApprovalConfigStore } from "@/stores/approvalConfig";
const configStore = useConfigStore()
const approvalConfigStore = useApprovalConfigStore();
const handleClick = (tab, event) => {
    if (tab.props.name === 'project') {
        configStore.getProjectList()
    } else if (tab.props.name === 'reimbursement_items') {
        configStore.getReiTypeList()
    }else{
        approvalConfigStore.getApprovalConfig();
    }
}
</script>

