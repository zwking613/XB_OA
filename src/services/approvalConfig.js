import { post } from '@/utils/request'

// 获取列表
export const getApprovalConfig = () => {
    return post('/sys/getLeaveConfig')
}

// 修改/新增
export const updateApprovalConfig = (values) => {
    return post('/sys/saveOrUpdate', values)
}