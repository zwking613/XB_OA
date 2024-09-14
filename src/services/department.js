import { post } from "@/utils/request";

/**
 * 获取部门列表
 * @author xz
 * @date 2024-09-12
 * @param {Object} params 
 * @returns {Promise}
 */
export const getDepartmentList = (params) => post("/department/list", params);

/**
 * 删除部门
 * @author xz
 * @date 2024-09-12
 * @param {number} id 部门Id
 * @returns {Promise}
 */
export const deleteDepartment = (id) => post("/department/delete", { id });

/**
 * 新增部门
 * @author xz
 * @date 2024-09-12
 * @param {Object} params 
 * @returns {Promise}
 */
export const saveDepartment = (params) => post("/department/save", params);

/**
 * 设置部门用户
 * @author xz
 * @date 2024-09-12
 * @param {Object} params 
 * @returns {Promise}
 */
export const setDepartment = (params) => post("/department/setDept", params);

/**
 * 更新部门
 * @author xz
 * @date 2024-09-12
 * @param {Object} params 
 * @returns {Promise}
 */
export const updateDepartment = (params) => post("/department/update", params);

/**
 * 获取部门信息
 * @author xz
 * @date 2024-09-12
 * @param {Object} params 
 * @returns {Promise}
 */
export const getDepartment = (params) => post("/department/find", params);










