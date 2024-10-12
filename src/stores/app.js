import { defineStore } from 'pinia'
import router from '@/router'
import * as appService from '@/services/app'
export const useAppStore = defineStore('app', {
  state: () => ({
    userInfo:{}, // 用户信息
  }),
  getters: {
    getUserName: (state) => {
      return state.userInfo.userName;
    },
  },
  actions: {
    // 登录
    async login(values) {
      const result = await appService.login(values)
      if (result.code === 200) {
        ElMessage.success('登录成功!')
        localStorage.setItem('token', result.list || '')
        router.push('/')
      } else {
        ElMessage.error(result.list)
      }
    },

    // 获取用户信息
    async getUserInfo() {
      const result = await appService.getUserInfo()
      if (result.code === 200) {
        this.userInfo = result.list
      } else {
        ElMessage.error('获取用户信息失败！')
      }
    },

    // 退出登录
    async logout() {
      const result = await appService.logout()
      if (result.code === 200) {
        ElMessage.success('退出登录成功！')
        localStorage.removeItem('token')
        router.push('/login')
      } else {
        ElMessage.error('退出登录失败！')
      }
    },

    // 修改密码
    async updatePassword(values,callback) {
      console.log(values)
      const result = await appService.changePassword(values)
      if (result.code === 200) {
        ElMessage.success('修改密码成功！')
        this.logout()
        callback && callback()
      } else {
        ElMessage.error(result.list)
      }
    },

    // 重置密码
    async resetPassword(callback) {
      const result = await appService.resetPwd()
      if (result.code === 200) {
        ElMessage.success('重置密码成功！')
        this.logout()
        callback && callback()
      } else {
        ElMessage.error('重置密码失败！')
      }
    },

  },
});
