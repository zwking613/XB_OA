import { defineStore } from "pinia";
import * as sysServices from "@/services/sys";

export const useSysStore = defineStore("sys", {
    state: () => ({
       flowDiagramUrl:'', // 流程图url
       procdefList:[], 
       selected:{}, // 当前选中的流程定义
       submittedList:[], // 已提交列表
    }),
    getters: {
    },
    actions: {
        async fetchFlowDiagram(processDefinitionId,key) {
            try{
                const result = await sysServices.fetchFlowDiagram(processDefinitionId);
                if(result.code === 200){
                    this.selected = {
                        id:processDefinitionId,
                        key:key
                    };
                    this.flowDiagramUrl = result.list;
                }
            }catch(error){
                console.error("获取流程图失败", error);
            }
        },
        async getProcdefList() {
            try{
                const result = await sysServices.getProcdefList();
                if(result.code === 200){
                    this.procdefList = result.list;
                }
            }catch(error){
                console.error("获取已部署流程定义失败", error);
            }
        },
        async startProcess(data) {
            try{
                const result = await sysServices.startProcess(data);
                if(result.code === 200){
                    this.flowDiagramUrl = '';
                    this.selected = {};
                    ElMessage.success("发起申请成功");
                }
            }catch(error){
                console.error("发起申请失败", error);
            }
        },
        async getSubmittedList() {
            try{
                const result = await sysServices.getSubmittedList();
                console.log(result)
                if(result.code === 200){
                    this.submittedList = result.list;
                }
            }catch(error){
                console.error("获取已提交列表失败", error);
            }
        },
    },
});