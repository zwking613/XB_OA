import { defineStore } from 'pinia'
import * as approvalConfigService from '@/services/approvalConfig'
export const useApprovalConfigStore = defineStore('approvalConfig', {
    state: () => ({
        approvalConfig: [], // 审批配置列表
    }),
    actions: {
        // 登录
        async getApprovalConfig() {
            const result = await approvalConfigService.getApprovalConfig()
            if (result.code === 200) {
               this.approvalConfig = result.list.map(item => {
                const approver = item.value ? JSON.parse(item.value).approver : ''
                const ccPerson = item.value ? JSON.parse(item.value).ccPerson : ''
                return {
                    ...item,
                    approver: approver ? approver : '',
                    ccPerson: ccPerson ? ccPerson.split(',') : '',
                }
               })
            } else {
                ElMessage.error(result.list)
            }
        },
        async updateApprovalConfig(values,callback) {
            const result = await approvalConfigService.updateApprovalConfig(values)
            if (result.code === 200) {
                ElMessage.success('更新成功!')
                callback.onSuccess && callback.onSuccess()
                this.getApprovalConfig()
            } else {
                ElMessage.error(result.list)
            }
        }

    },
});
