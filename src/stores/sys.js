import { defineStore } from "pinia";
import * as sysServices from "@/services/sys";

export const useSysStore = defineStore("sys", {
    state: () => ({
       flowDiagramUrl:'',
       procdefList:[],
     selectedId:''
    }),
    getters: {
    },
    actions: {
        async fetchFlowDiagram(processDefinitionId) {
            try{
                const result = await sysServices.fetchFlowDiagram(processDefinitionId);
                if(result.code === 200){
                    this.selectedId = processDefinitionId;
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
    },
});