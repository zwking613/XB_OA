import { post } from '@/utils/request'

// 获取列表
export const getProjectConfig = (name) => {
    return post('/sys/getListByName',{
        name
    })
}

// 修改/新增
export const updateProjectConfig = (values) => {
    return post('/sys/saveOrUpdate', values)
}


/**
 * 
 * @returns 获取项目列表
 */

export const getProjectList = () => post('/sys/getProjectList')

/**
 * 
 * @returns 添加/修改项目
 * 
 * */

export const updateProject = (values) => post('/sys/saveOrUpdateProject', values)



/**
 * 
 * @returns 获取报销列表
 * 
 * */

export const getReiTypeList = () => post('/sys/getReiTypeList')

/**
 * 
 * @returns 添加/修改报销
 * 
 * */

export const updateReiType = (values) => post('/sys/saveOrUpdateReiType', values)