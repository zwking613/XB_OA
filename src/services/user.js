import { post } from "@/utils/request";

/**
 * 获取用户列表
 * @author xz
 * @date 2024-09-12
 * @param {Object} params 
 * @param {Number} params.pageNo
 * @param {Number} params.pageSize 
 * @param {Object} params.filter 
 * 
 * @returns {Promise}
 */
export const getUserList = (params) => post("/user/page", params);

/**
 * 新增或修改用户
 * @author xz
 * @date 2024-09-12
 * @param {Object} params 
 * @returns {Promise}
 * 
 */
export const updateUser = (params) => post("/user/saveOrUpdate", params);

/**
 * 删除用户
 * @author xz
 * @date 2024-09-12
 * @param {number} id 
 * @returns {Promise}
 */
export const deleteUser = (id) => post("/user/del", {id});

/**
 * 重置密码
 * @author xz
 * @date 2024-09-12
 * @param {number} id 
 * @returns {Promise}
 */
export const resetPassword = (id) => post("/user/resetPwd", {id});
