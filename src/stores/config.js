import { defineStore } from 'pinia'
import * as configService from '@/services/config'
export const useConfigStore = defineStore('config', {
    state: () => ({
        projectConfig: [], // 项目配置列表
        reiTypeConfig:[], // 重新配置列表
        type: '', // 当前配置类型
    }),
    actions: {
        async getProjectConfig(name) {
            const result = await configService.getProjectConfig(name)
            if (result.code === 200) {
                this.type = name
                this.projectConfig = result.list.map((item,index) => {
                    return{
                        id: index,
                        name: item.name
                    }
                })
            } else {
                ElMessage.error(result.list)
            }
        },
        async updateProjectConfig(values, callback) {
            const result = await configService.updateProjectConfig(values)
            if (result.code === 200) {
                ElMessage.success('更新成功!')
                callback.onSuccess && callback.onSuccess()
                this.getProjectConfig(values.name)
            } else {
                ElMessage.error(result.list)
            }
        },

        async getProjectList() {
            const result = await configService.getProjectList()
            if (result.code === 200) {
                this.projectConfig = result.list
            } else {
                ElMessage.error(result.list)
            }
        },

        async updateProject(values, callback) {
            const result = await configService.updateProject(values)
            if (result.code === 200) {
                ElMessage.success('更新成功!')
                callback.onSuccess && callback.onSuccess()
                this.getProjectList()
            } else {
                ElMessage.error(result.list)
            }
        },



        async getReiTypeList() {
            const result = await configService.getReiTypeList()
            if (result.code === 200) {
                this.reiTypeConfig = result.list
            } else {
                ElMessage.error(result.list)
            }
        },
        async updateReiType(values, callback) {
            const result = await configService.updateReiType(values)
            if (result.code === 200) {
                ElMessage.success('更新成功!')
                callback.onSuccess && callback.onSuccess()
                this.getReiTypeList()
            } else {
                ElMessage.error(result.list)
            }
        }
    },
});
