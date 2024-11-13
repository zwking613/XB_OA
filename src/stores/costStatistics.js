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


        searchType:'project',
        data:{
            pieData:[],
            comData:[],
            select:'',
            barData:{
                key: [],
                value: []
            }
        },
        projectData : {
            onePieData:[],
            comProjectData:[],
            selectOne:"",
            selectTwo:""
        }
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
        },
        async getProjectData(params) {
            const res = await costStatisticsServices.getProjectData(params)
            if (res.code === 200) {
                if (params.group !=='project'){
                    const pie = []
                    const comUser = {}
                    for (const item in res.list) {
                        pie.push({
                            value: Object.keys(res.list[item]).reduce(function (all, key) {
                                return all + res.list[item][key];
                            }, 0), name: item })
                        comUser[item] = res.list[item]
                    }
                    this.data = {
                        pieData: pie,
                        comData: comUser,
                        select: pie[0].name,
                        title: params.group === 'user' ? '用户' : '部门'
                    }
                    this.searchType = params.group
                }
                else{
                    const data  = res.list
                    const onePieData = []
                    const comProjectData = {}
                    data.forEach(item => {
                        onePieData.push({
                            name: item.projectName,
                            value: item.totalCost || 0
                        })
                        comProjectData[item.projectName] = item.childrenList
                    })
                    //  comProjectData[onePieData[0].name].forEach(item=>{
                    //     towPieData.push({
                    //             name: item.projectName,
                    //             value: item.totalCost || 0
                    //         })
                    // })
                    // detailsByUser statistics
                    // this.oneBar = onePieData[0].childrenList
                    // this.towBar = onePieData[0].childrenList.map(item=>{
                        // 
                    // })
                    this.projectData.comProjectData = comProjectData
                    this.projectData.onePieData = onePieData
                    this.projectData.selectOne = onePieData[0].name
                    this.projectData.selectTwo = comProjectData[onePieData[0].name][0]?.projectName
                    // this.projectData.towPieData = towPieData
                    this.searchType = params.group
                }
            }
        }
    }
})