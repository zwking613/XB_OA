import { post } from "@/utils/request";

/**
 * 审核文件分享
 * @param {Object} params - 审核参数
 * @returns {Promise}
 */
export const auditFileShare = (params) => post("/fileAudit/audit", params);

/**
 * 取消审核
 * @param {string} id - 审核记录ID
 * @returns {Promise}
 */
export const deleteAudit = (id) => post('/fileAudit/delete',{id});

/**
 * 获取审核列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getAuditList = (params) => post("/fileAudit/list", params);

