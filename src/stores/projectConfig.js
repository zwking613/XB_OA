import { defineStore } from 'pinia'
import * as projectConfigService from '@/services/projectConfig'
export const useProjectConfigStore = defineStore('projectConfig', {
    state: () => ({
        projectConfig: [], // 项目配置列表
        type: '', // 当前配置类型
    }),
    actions: {
        async getProjectConfig(name) {
            const result = await projectConfigService.getProjectConfig(name)
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
            const result = await projectConfigService.updateProjectConfig(values)
            if (result.code === 200) {
                ElMessage.success('更新成功!')
                callback.onSuccess && callback.onSuccess()
                this.getProjectConfig(values.name)
            } else {
                ElMessage.error(result.list)
            }
        }

    },
});
