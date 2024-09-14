import { defineStore } from "pinia";
import * as userServices from "@/services/user";

export const useUserStore = defineStore("user", {
    state: () => ({
        userList: {
            list: [],
            pageNo: 1,
            pageSize: 10,
            totalCount: 0,
        },
        loading: false,
        filter:{},
    }),
    getters: {
    },
    actions: {
        // 获取用户列表
        async getUserList(params = { pageNo: 1, pageSize: 10,filter:{} }) {
            this.loading = true;
            const filter = {...this.filter,...params.filter}
            try {
                const result = await userServices.getUserList({ pageNo:params.pageNo,pageSize:params.pageSize,...filter});
                if(result.code === 200){
                    this.userList = result.list;
                    this.filter = params.filter;
                }
            } catch (error) {
                console.error("获取用户列表失败", error);
            }
            finally{
                this.loading = false;
            }
        },
        async addUser(params,callback) {
            try {
                const result = await userServices.updateUser(params);
                if(result.code === 200){
                    ElMessage.success(result.list || "新增用户成功");
                    callback && callback();
                    this.getUserList();
                }
                else{
                    ElMessage.error(result.message || "新增用户失败");
                }
            } catch (error) {
                console.error("新增用户失败", error);
            }
        },
        async deleteUser(id) {
            try {
                const result = await userServices.deleteUser(id);
                if(result.code === 200){
                    ElMessage.success(result.list || "删除用户成功");
                    this.getUserList();
                }
            } catch (error) {
                console.error("删除用户失败", error);
            }
        },
        async resetPassword(id) {
            try {
                const result = await userServices.resetPassword(id);
                if(result.code === 200){
                    ElMessage.success(result.list || "重置密码成功");
                    this.getUserList();
                }
            } catch (error) {
                console.error("重置密码失败", error);
            }   
        }
    },
});