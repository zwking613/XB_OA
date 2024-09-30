<template>
    <el-tabs type="border-card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane >
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
            <project-config type="reimbursement_items" />
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
import ProjectConfig from './components/projectConfig.vue'
import ApprovalConfig from './components/approvalConfig.vue'
import { useProjectConfigStore } from '@/stores/projectConfig'
const projectConfigStore = useProjectConfigStore()
const handleClick = (tab, event) => {
    if (tab.props.name === 'project') {
        projectConfigStore.getProjectConfig('project')
    } else if (tab.props.name === 'reimbursement_items') {
        projectConfigStore.getProjectConfig('reimbursement_items')
    } else if (tab.props.name === 'reimbursement_allocation') {
        projectConfigStore.getProjectConfig('reimbursement_allocation')
    }
}
</script>

