import { defineStore } from "pinia";
import * as filesAuditServices from "@/services/filesAudit";
import { ElMessage } from 'element-plus';
import { getUserList } from "@/services/user";
export const useFileAuditStore = defineStore("fileAudit", {
  state: () => ({
    auditList: {
        list: [],
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
    },
    userList: [],
  }),
  
  actions: {
    // 获取审核列表
    async fetchAuditList(params = { pageNo: 1, pageSize: 10 ,searchType :1}) {
      console.log(params)
      try {
        const result = await filesAuditServices.getAuditList(params);
        console.log(result)
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
    async auditFileShare(params,callback) {
      try {
        const result = await filesAuditServices.auditFileShare(params);
        if (result.code === 200) {
          ElMessage.success("审核成功");
          await this.fetchAuditList();
          callback && callback();
        } else {
          ElMessage.error(result.message || "审核失败");
        }
      } catch (error) {
        console.error("审核失败", error);
      }
    },

    // 取消审核
    async deleteAudit(id) {
      try {
        const result = await filesAuditServices.deleteAudit(id);
        if (result.code === 200) {
          ElMessage.success(result.list || "删除成功");
          this.fetchAuditList();
        }
        else{
          ElMessage.error(result.message || "删除失败");
        }
      } catch (error) {
        console.error("删除失败", error);
      }
    },
    // 获取用户列表
    async fetchUserList(callback) {
      try {
        const result = await getUserList({ pageNo: 1, pageSize: 1000 });
        if (result.code === 200) {
          this.userList = result.list.list;
          callback && callback();
        }
      } catch (error) {
        console.error("获取用户列表失败", error);
      }
    },
  },
});
