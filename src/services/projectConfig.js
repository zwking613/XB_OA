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