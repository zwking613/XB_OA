import { defineStore } from "pinia";
import * as filesAuditServices from "@/services/filesAudit";
import { ElMessage } from 'element-plus';

export const useFileAuditStore = defineStore("fileAudit", {
  state: () => ({
    auditList: {
        list: [],
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
    },
  }),
  
  actions: {
    // 获取审核列表
    async fetchAuditList(params = { pageNo: 1, pageSize: 10 ,searchType :1}) {
      try {
        const result = await filesAuditServices.getAuditList(params);
        if (result.code === 200) {
          this.auditList = result.list || [];
        } else {
          ElMessage.error(result.message || "获取审核列表失败");
        }
      } catch (error) {
        console.error("获取审核列表失败", error);
      }
    },

    // 审核文件分享
    async auditFileShare(params) {
      try {
        const result = await filesAuditServices.auditFileShare(params);
        if (result.code === 200) {
          ElMessage.success("审核成功");
          await this.fetchAuditList();
        } else {
          ElMessage.error(result.message || "审核失败");
        }
      } catch (error) {
        console.error("审核失败", error);
      }
    },

    // 取消审核
    async cancelAudit(id) {
      try {
        const result = await filesAuditServices.cancelAudit(id);
        if (result.code === 200) {
          ElMessage.success("取消审核成功");
          await this.fetchAuditList();
        } else {
          ElMessage.error(result.message || "取消审核失败");
        }
      } catch (error) {
        console.error("取消审核失败", error);
      }
    },
  },
});
