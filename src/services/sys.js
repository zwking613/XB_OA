import {post} from '@/utils/request';

/**
 * Fetch flow diagram data for a given process definition
 * @param {string} processDefinitionId - The ID of the process definition
 * @returns {Promise<Object>} - A promise that resolves with the flow diagram data
 */

export const fetchFlowDiagram = (processDefinitionId) => post('/flowable/getFlowDiagram', {processDefinedId:processDefinitionId})


/**
 * Fetch deployed process definitions list
 * @returns {Promise<Object>} - A promise that resolves with the deployed process definitions data
 */
export const getProcdefList = () => post('/flowable/getProcdefList');


/**
 * 发起申请
 * @param {Object} data 
 * @returns {Promise<Object>} - A promise that resolves with the deployed process definitions data
 */
export const startProcess = (data) => post('/flowable/start', data);
// 获取待处理
export const getToBeProcessedList = () => post('/flowable/getToBeProcessedList');
// 获取已处理
export const getProcessedList = () => post('/flowable/getHistoryList');

// 抄送我的
export const getCopyMyList = () => post('/flowable/getCopyMyList');

// 获取已提交
export const getSubmittedList = () => post('/flowable/getInstantiateList',{
    searchType:2
});




// 获取待处理列表
/**
 * 
 * @param {string} type reimbursement_process - 报销流程
 * @returns 
 */
export const todoList = (params) => post('/flowable/getInstantiateList',params);


export const updateItem = (params) => post('/reimbursement/updateItem',params);


export const audit = (params) => post('/flowable/audit', params);
export const reject = (params) => post('/flowable/deleteProcess', params);

export const historyList = (params) => post('/reimbursement/page',params);







