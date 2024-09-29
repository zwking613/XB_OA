// POST
//     / api / pps / deleteItem
// 通过id删除进度更新记录
// POST
//     / api / pps / deletePps
// 通过id删除项目进度统计
// POST
//     / api / pps / page
// 分页查询
// POST
//     / api / pps / saveItem
// 添加进度
// POST
//     / api / pps / saveOrUpdate
// 添加 / 更新

import { post } from '@/utils/request'

export const deleteItem = (id) => post('/pps/deleteItem', { id })

export const deletePps = (id) => post('/pps/deletePps', { id })

export const page = (params) => post('/pps/page', params)

export const saveItem = (params) => post('/pps/saveItem', params)

export const saveOrUpdate = (params) => post('/pps/saveOrUpdate', params)

export const getItemList = (id) => post('/pps/getItemList', { ppsId:id })


