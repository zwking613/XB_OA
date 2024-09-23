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
