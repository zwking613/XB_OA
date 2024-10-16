<template>
    <div id="costStatistics">
        <div id="main"></div>
    </div>
</template>
<script setup name="costStatistics">
import * as echarts from 'echarts';
import { useCostStatisticsStore } from '@/stores/costStatistics'
import { watch } from 'vue';
const costStatisticsStore = useCostStatisticsStore()
let myChart;

const initChart = () => {
    const chartDom = document.getElementById('main');
    myChart = echarts.init(chartDom, 'dark');
    const projectData = costStatisticsStore.comProject[costStatisticsStore.projectType] ? (costStatisticsStore.comProject[costStatisticsStore.projectType].paid || {}):{}
    const projectDataAll = costStatisticsStore.comProject[costStatisticsStore.projectType] ? (costStatisticsStore.comProject[costStatisticsStore.projectType].all || 0):0

    const userData = costStatisticsStore.comUser[costStatisticsStore.userType] || {}
    const userDataAll = Object.keys(userData).reduce(function (all, key) {
        return all + userData[key];
    }, 0)
   
    const waterMarkText = '雄博';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 100;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.08;
    ctx.font = '20px Microsoft Yahei';
    ctx.translate(50, 50);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(waterMarkText, 0, 0);

    const option = {
        backgroundColor: {
            type: 'pattern',
            image: canvas,
            repeat: 'repeat'
        },
        tooltip: {},
        
        title: [
            {
                text: costStatisticsStore.projectType + '明细',
                subtext: '总计 ' + projectDataAll,
                left: '56%',
                top: '25%',
                textStyle: {
                    color: "#000"
                },
                textAlign: 'center',
            },
            {
                text: costStatisticsStore.userType + '明细',
                subtext: '总计 ' + userDataAll,
                left: '56%',
                top: '75%',
                textStyle: {
                    color: "#000"
                },
                textAlign: 'center'
            },
            {
                text: '项目统计',
                subtext:'总计 ' + Object.keys(costStatisticsStore.pieProject).reduce(function (all, key) {
                        return all + costStatisticsStore.pieProject[key];
                    }, 0),
                left: '75%',
                textStyle: {
                    color: "#000"
                },
                textAlign: 'center'
            },
            {
                text: '用户统计',
                subtext:'总计 ' + Object.keys(costStatisticsStore.pieUser).reduce(function (all, key) {
                        return all + costStatisticsStore.pieUser[key];
                    }, 0),
                left: '75%',
                top: '50%',
                textStyle: {
                    color: "#000"
                },
                textAlign: 'center' 
            }
        ],
        grid: [
            {
                top: 50,
                width: '50%',
                bottom: '45%',
                left: 10,
                containLabel: true
            },
            {
                top: '55%',
                width: '50%',
                bottom: 0,
                left: 10,
                containLabel: true
            }
        ],
        xAxis: [
            {
                type: 'value',
                max: projectDataAll,
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                max: userDataAll,
                gridIndex: 1,
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: Object.keys(projectData),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                },
                splitLine: {
                    show: false
                }
            },
            {
                gridIndex: 1,
                type: 'category',
                data: Object.keys(userData),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                type: 'bar',
                stack: 'chart',
                z: 3,
                label: {
                    position: 'right',
                    show: true
                },
                data: Object.keys(projectData).map(function (key) {
                    return projectData[key];
                })
            },
            {
                type: 'bar',
                stack: 'chart',
                silent: true,
                itemStyle: {
                    color: '#eee'
                },
                data: Object.keys(projectData).map(function (key) {
                    return projectDataAll - projectData[key];
                })
            },
            {
                type: 'bar',
                stack: 'component',
                xAxisIndex: 1,
                yAxisIndex: 1,
                z: 3,
                label: {
                    position: 'right',
                    show: true
                },
                data: Object.keys(userData).map(function (key) {
                    return userData[key];
                })
            },
            {
                type: 'bar',
                stack: 'component',
                silent: true,
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    color: '#eee'
                },
                data: Object.keys(userData).map(function (key) {
                    return userDataAll - userData[key];
                })
            },
            {
                type: 'pie',
                radius: [0, '30%'],
                center: ['75%', '25%'],
                data: Object.keys(costStatisticsStore.pieProject).map(function (key) {
                    return {
                        name: key,
                        value: costStatisticsStore.pieProject[key]
                    };
                })
            },
            {
                type: 'pie',
                radius: [0, '30%'],
                center: ['75%', '75%'],
                data: Object.keys(costStatisticsStore.pieUser).map(function (key) {
                    return {
                        name: key,
                        value: costStatisticsStore.pieUser[key]
                    };
                })
            }
        ]
    };

    option && myChart.setOption(option);
    myChart.on('click', (params) => {
        if (params.componentSubType !== 'pie') return;
        console.log(params.data); // 打印点击的数据项信息
        if (Object.keys(costStatisticsStore.pieProject).includes(params.data.name)) {
            costStatisticsStore.projectType = params.data.name
        }
        else{
            costStatisticsStore.userType = params.data.name
        }

    });
}

onMounted(() => {
    costStatisticsStore.getProjectStatistics()
    costStatisticsStore.getUserStatistics()
    initChart()
});
watch([
    () => costStatisticsStore.pieProject, 
    () => costStatisticsStore.projectType,
    () => costStatisticsStore.pieUser,
    () => costStatisticsStore.userType
    ], () => {
    initChart()
})
</script>
<style scoped>
#costStatistics {
    width: 100%;
    height: calc(100vh - 200px);
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
#costStatistics {
    width: 100%;
    height: calc(100vh - 200px);
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
#costStatistics::-webkit-scrollbar {
    width: 8px;
}

#costStatistics {
    overflow-y: auto;
}

#costStatistics::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 4px;
}

#costStatistics::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
}

#costStatistics::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}
#main {
    width: 100%;
    height: 100%;
}
</style>