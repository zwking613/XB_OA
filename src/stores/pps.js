import { defineStore } from 'pinia'
import * as pps from '@/services/pps'
export const usePpsStore = defineStore('pps', {
    state: () => ({
        pps: {},
        details: {},
        ppsItemList:[],
    }),
    actions: {
        async fetchPps({pageNo=1, pageSize=10,filter={}}={}) {
            try {
                const res = await pps.page({pageNo, pageSize,...filter})
                if(res.code === 200){
                    this.pps = res.list
                }
            } catch (error) {
                console.error(error)
            }
            // this.pps = res.data
        },
       
        async saveOrUpdate(params,callback) {
           try {
            const res = await pps.saveOrUpdate(params)
            if(res.code === 200){
                this.fetchPps()
                callback && callback()
                ElMessage.success(res.list || "操作成功")
            }
            else{
                ElMessage.error(res.list || "操作失败")
            }
           } catch (error) {
            console.error(error)
           }
        },
        async getItemList() {
            try {
                const res = await pps.getItemList(this.details.id)
                if(res.code === 200){
                    this.ppsItemList = res.list
                    console.log(this.ppsItemList)
                }
            } catch (error) {
                console.error(error)
            }
        },
        async deletePps(id) {
           try {
            const res = await pps.deletePps(id)
            if(res.code === 200){
                ElMessage.success(res.list || "操作成功")
                this.getItemList()
            }
            else{
                ElMessage.error(res.list || "操作失败")
           }
           } catch (error) {
            console.error(error)
           }
        },
        async saveItem(params, callback) {
           try {
            const res = await pps.saveItem(params)
            if(res.code === 200){
                this.getItemList()
                callback && callback()
                ElMessage.success(res.list || "操作成功")
            }
            else{
                ElMessage.error(res.list || "操作失败")
           }
           } catch (error) {
            console.error(error)
           }
        },
        async deleteItem(id) {
            try {
                const res = await pps.deleteItem(id)
                if (res.code === 200) {
                    ElMessage.success(res.list || "操作成功")
                    this.getItemList()
                }
                else {
                    ElMessage.error(res.list || "操作失败")
                }
            } catch (error) {
                console.error(error)
            }
        },

        
        
    },
})

