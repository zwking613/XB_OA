import {post} from '@/utils/request'

/**
 * 根据项目费用统计
 * @param {*} params 
 * @returns 
 */


export const projectStatistics = (params) => post('/projectCostStatistics/countByProject', params)

/**
 * 根据用户统计
 * @param {*} params 
 * @returns 
 */
export const userStatistics = (params) => post('/projectCostStatistics/countByUser', params)