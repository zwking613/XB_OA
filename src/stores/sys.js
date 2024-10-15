import { defineStore } from "pinia";
import * as sysServices from "@/services/sys";

export const useSysStore = defineStore("sys", {
    state: () => ({
       flowDiagramUrl:'', // 流程图url
       procdefList:[], 
       selected:{}, // 当前选中的流程定义
       submittedList:[], // 已提交列表

       searchType:'all', // 搜索类型
       listType:'reimbursement_process', 
       toBeProcessedList:{
        list:[], 
        pageSize:10,
        pageNo:1,
        totalCount:0,
        filter:{},
       }, // 待处理列表
        historyList: {
            list: [],
            pageSize: 10,
            pageNo: 1,
            totalCount: 0,
            filter: {
                searchType: 1,
            },
        }, // 待处理列表
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



        // 获取待处理列表

        async getTodoList() {
            try{
                const result = await sysServices.todoList({
                    type:this.listType,
                    searchType:this.searchType
                });
                if(result.code === 200){
                   this.submittedList = result.list;
                }
               
            }catch(error){
                console.error("获取待处理列表失败", error);
            }
        },
        async update(params,callback) {
            try{
                const result = await sysServices.updateItem(params);
                if(result.code === 200){
                    this.getTodoList()
                    ElMessage.success(result.list);
                    callback && callback();
                }
                else{
                    ElMessage.error(result.list);
                }
            }catch(error){
                console.error("更新失败", error);
            }
        },
        async audit(params, callback) {
            try {
                const result = await sysServices.audit(params);
                if (result.code === 200) {
                    this.getTodoList()
                    ElMessage.success(result.list);
                    callback && callback();
                }
                else {
                    ElMessage.error(result.list);
                }
            } catch (error) {
                console.error("审核失败", error);
            }
        },

        async getHistoryList(params = { pageNo: 1, pageSize: 10, filter: {} }) {
            const filter = { ...this.historyList.filter, ...params.filter }
            try{
                const result = await sysServices.historyList({ pageNo: params.pageNo, pageSize: params.pageSize, ...filter });
                if(result.code === 200){
                    this.historyList ={
                        ...result.list,
                        filter,
                    };
                }
            }catch(error){
                console.error("获取历史记录失败", error);
            }
        }
    },
});