import { defineStore } from "pinia";
import { getDepartmentList, deleteDepartment, saveDepartment, setDepartment, updateDepartment, getDepartment } from "@/services/department";
import { getUserList } from "@/services/user";

const splitDepartmentList = (departmentList, id = 0) => {
  return departmentList.map(item => {
    return {
      label: item.name || item.userName,
      type: 'department',
      isManager: item.id === id,
      ...item,
      children: item.users && item.users.map(user => {
        return {
          label: user.userName,
          type: 'user',
          isManager: user.id === item.managerId,
          ...user,
        }
      }),
    }
  })
}

export const useDepartmentStore = defineStore("department", {
  state: () => ({
    departmentList: [],
    userList: [],
  }),
  getters: {

  },
  actions: {
    // 获取部门列表
    async fetchDepartmentList(params = {}) {
      try {
        const result = await getDepartmentList(params);
        if (result.code === 200) {
          this.departmentList = splitDepartmentList(result.list);
        } else {
          ElMessage.error(result.list || "获取部门列表失败");
        }
      } catch (error) {
        console.error("获取部门列表失败", error);
      }
    },

    // 删除部门
    async removeDepartment(id) {
      try {
        const result = await deleteDepartment(id);
        if (result.code === 200) {
          ElMessage.success("删除部门成功");
          await this.fetchDepartmentList();
        } else {
          ElMessage.error(result.message || "删除部门失败");
        }
      } catch (error) {
        console.error("删除部门失败", error);
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

    // 新增部门
    async addDepartment(params, callback) {
      try {
        const result = await saveDepartment(params);
        if (result.code === 200) {
          ElMessage.success("新增部门成功");
          callback && callback();
          this.fetchDepartmentList();
        } else {
          ElMessage.error(result.message || "新增部门失败");
        }
      } catch (error) {
        console.error("新增部门失败", error);
      }
    },

    // 设置部门用户
    async assignDepartmentUser(params, callback) {
      try {
        const result = await setDepartment(params);
        if (result.code === 200) {
          ElMessage.success(result.list || "设置部门用户成功");
          this.fetchDepartmentList();
          callback && callback();
        } else {
          ElMessage.error(result.list || "设置部门用户失败");
        }
      } catch (error) {
        console.error("设置部门用户失败", error);
      }
    },
  },
});
