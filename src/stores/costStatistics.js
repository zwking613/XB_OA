import * as costStatisticsServices from '../services/costStatistics'
import { defineStore } from 'pinia'

export const useCostStatisticsStore = defineStore('costStatistics', {
    state: () => ({
        pieProject:{},
        comProject:{},
        projectType:'',
        userType:'',
        pieUser:{},
        comUser:{},
    }),
    actions: {
        async getProjectStatistics(params) {
            const res = await costStatisticsServices.projectStatistics(params)
            if (res.code === 200) {
                const pieProject = {}
                const comProject = {}
                res.list.forEach(item => {
                    const  paid= {
                        ...(item.statistics || {}),
                            ...(item.detailsByUser || {}),
                        }
                    pieProject[item.projectName] = item.totalCost || 0
                    comProject[item.projectName] = {
                        all: item.totalCost || 0,
                        paid,
                    }
                })
                this.pieProject = pieProject
                this.comProject = comProject
                this.projectType = Object.keys(pieProject)[0]
            }
        },
        async getUserStatistics(params) {
            const res = await costStatisticsServices.userStatistics(params)
            if (res.code === 200) {
                const pieUser = {}
                const comUser = {}
                for (const item in res.list) {
                    pieUser[item] = Object.keys(res.list[item]).reduce(function (all, key) {
                        return all + res.list[item][key];
                    }, 0),
                    comUser[item] = res.list[item]
                }
                this.pieUser = pieUser
                this.comUser = comUser
                this.userType = Object.keys(pieUser)[0]
            }
        }
    }
})