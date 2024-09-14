import { post } from '@/utils/request'

/**
 * 登录
 * @author xz
 * @date 2024-09-12
 * @param {Object} values 
 * @param {string} values.username 用户名
 * @param {string} values.phone 密码    
 * @returns {Promise<Object>} 返回一个Promise，resolve时返回一个对象
 * @property {number} code 状态码
 * @property {string} list token
 * @property {string} msg 消息
 */
export const login = (values) =>{
    console.log(values)
    return post('/web/login', values)
}

/**
 * 获取用户信息
 * @author xz
 * @date 2024-09-12
 * @returns {Promise<Object>} 返回一个Promise，resolve时返回一个对象
 * @property {number} code 状态码
 * @property {Object} list 用户信息
 * @property {string} msg 消息
 */

export const getUserInfo = () => post('/userInfo')

/**
 * 登出
 * @author xz
 * @date 2024-09-12
 * @returns 
 */
export const logout = () => post('/logout')

/**
 * 修改密码
 * @author xz
 * @date 2024-09-12
 * @param {Object} values 
 * @param {string} values.oldpwd 旧密码
 * @param {string} values.newpwd 新密码
 * @returns 
 */
export const changePassword = (values) => post('/changepwd', values)

/**
 * 重置密码
 * @author xz
 * @date 2024-09-12
 * @returns 
 */

export const resetPwd = () => post('/resetInitPwd')
