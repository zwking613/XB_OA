<template id="costStatistics">
    <div>
        <div class="search">
            <FormModule ref="queryRefForm" :fromConfig="filterItem" @submit="query"></FormModule>
        </div>
        <div>

            <el-row v-show="costStatisticsStore.searchType === 'project'">
                <el-col :span="12">
                    <div id="projectOnePie" style="width: 100%;height: 350px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="projectTwoPie" style="width: 100%;height: 350px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="projectOneBar" style="width: 100%;height: 350px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="projectTwoBar" style="width: 100%;height: 350px;"></div>
                </el-col>
            </el-row>
            <el-row v-show="costStatisticsStore.searchType !== 'project'" class="user-dept-chart">
                <el-col :span="12">
                    <div id="userPie" style="width: 100%; height: 100%"></div>
                </el-col>
                <el-col :span="12">
                    <div id="userBar" style="width: 100%; height: 100%"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script setup name="costStatistics" lang="jsx">
import * as echarts from "echarts";
import { useCostStatisticsStore } from "@/stores/costStatistics";
import { nextTick, ref, watch } from "vue";
const costStatisticsStore = useCostStatisticsStore();
const filterItem = {
    fields: [
        {
            label: "类型",
            prop: "group",
            type: "select",
            value: costStatisticsStore.searchType,
            options: [
                { label: "项目", value: "project" },
                { label: "用户", value: "user" },
                { label: "部门", value: "dept" },
            ],
            style: { width: "170px" },
            clearable: true,
        },
        // {label: '职员', prop: 'userId',component: <SelectLimit url="/user/page" dataKey={['list', 'list']} labelKey="userName" valueKey="id" style={{width: '170px'}} searchKey="name" placeholder="请选择职员" />},
        //  {label: '项目', prop: 'project',component: <SelectLimit url="/sys/getProjectList" dataKey="list" labelKey="name" valueKey="name" style={{width: '170px'}} searchKey="name" placeholder="请选择项目" />},
        // {label:'时间',prop:'time',type:'datePick',clearable: true,dateType:'daterange'},
    ],
    rules: {
        group: [
            { required: true, message: "请选择类型", trigger: "blur" },
            { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
        ],
    },
    formItemLabelWidth: "auto",
    inline: true,
    isCancel: false,
    isSpan: true,
    layout: 3,
    okTitle: "查询",
};
let chartUserPie = ref(null);
let chartUserBar = ref(null);
let chartProjectOnePie = ref(null);
let chartProjectTwoPie = ref(null);
let chartProjectOneBar = ref(null);
let chartProjectTwoBar = ref(null);
const initUserPieChart = () => {
    nextTick(() => {
        if (!chartUserPie.value) {
            chartUserPie.value = echarts.init(document.getElementById("userPie"));
        }
        var option;

        option = {
            title: {
                text: (costStatisticsStore.data.title || "") + "统计",
                subtext:
                    "总计：" +
                    costStatisticsStore.data.pieData.reduce(
                        (sum, item) => sum + item.value,
                        0
                    ),
                left: "center",
            },
            legend: {
                orient: "vertical",
                left: "left",
            },
            tooltip: {
                trigger: "item",
            },
            series: [
                {
                    type: "pie",
                    radius: "50%",
                    data: costStatisticsStore.data.pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };

        option && chartUserPie.value.setOption(option);
        chartUserPie.value.on("click", (params) => {
            costStatisticsStore.data.select = params.data.name;
        });
    })
};
const initUserBarChart = () => {
    nextTick(() => {
        if (!chartUserBar.value) {
            chartUserBar.value = echarts.init(document.getElementById("userBar"));
        }
        const data = costStatisticsStore.data.comData[costStatisticsStore.data.select] || {};
        const xAxis = Object.keys(data);
        const yAxis = Object.values(data);
        var option = {
            title: {
                text: (costStatisticsStore.data.select || "") + "   明细",
                subtext: "总计：" + yAxis.reduce((a, b) => a + b, 0),
                left: "center",
            },
            xAxis: {
                type: "category",
                data: xAxis,
            },
            tooltip: {
                trigger: "item",
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: yAxis,
                    type: "bar",
                },
            ],
        };

        option && chartUserBar.value.setOption(option);
    })
};

const initProjectOnePie = () => {

    nextTick(() => {
        if (!chartProjectOnePie.value) {
            chartProjectOnePie.value = echarts.init(document.getElementById("projectOnePie"));
        }
        var option = {
            title: {
                text: "统计",
                subtext:
                    "总计：" +
                    costStatisticsStore.projectData.onePieData.reduce(
                        (sum, item) => sum + item.value,
                        0
                    ),
                left: "center",
            },
            legend: {
                orient: "vertical",
                left: "left",
            },
            tooltip: {
                trigger: "item",
            },
            series: [
                {
                    type: "pie",
                    radius: "50%",
                    data: costStatisticsStore.projectData.onePieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };

        chartProjectOnePie.value.setOption(option);
        chartProjectOnePie.value.on("click", (params) => {
            costStatisticsStore.projectData.selectOne = params.data.name;
        });
    })
}
const initProjectTwoPie = () => {
    nextTick(() => {
        if (!chartProjectTwoPie.value) {
            chartProjectTwoPie.value = echarts.init(document.getElementById("projectTwoPie"));
        }
        const comProjectData = costStatisticsStore.projectData.comProjectData[costStatisticsStore.projectData.selectOne];
        const data = comProjectData.map((item) => {
            return {
                name: item.projectName,
                value: item.totalCost || 0
            };
        })
        var option = {
            title: {
                text: "统计",
                subtext:
                    "总计：" +
                    data.reduce(
                        (sum, item) => sum + item.value,
                        0
                    ),
                left: "center",
            },
            legend: {
                orient: "vertical",
                left: "left",
            },
            tooltip: {
                trigger: "item",
            },
            series: [
                {
                    type: "pie",
                    radius: "50%",
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };

        chartProjectTwoPie.value.setOption(option);
        chartProjectTwoPie.value.on("click", (params) => {
            costStatisticsStore.projectData.selectTwo = params.data.name;
        });
    })
}

const initProjectOneBar = () => {
    nextTick(() => {
        if (!chartProjectOneBar.value) {
            chartProjectOneBar.value = echarts.init(document.getElementById("projectOneBar"));
        }
        const comProjectData = costStatisticsStore.projectData.comProjectData[costStatisticsStore.projectData.selectOne];
        const data = comProjectData.find(item => item.projectName === costStatisticsStore.projectData.selectTwo)?.statistics
            ;
        const xAxis = Object.keys(data);
        const yAxis = Object.values(data);
        var option = {
            title: {
                text: "明细",
                subtext: "总计：" + yAxis.reduce((a, b) => a + b, 0),
                left: "center",
            },
            xAxis: {
                type: "category",
                data: xAxis,
            },
            tooltip: {
                trigger: "item",
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: yAxis,
                    type: "bar",
                },
            ],
        };

        option && chartProjectOneBar.value.setOption(option);
    })
};
const initProjectTwoBar = () => {
    nextTick(() => {
        if (!chartProjectTwoBar.value) {
            chartProjectTwoBar.value = echarts.init(document.getElementById("projectTwoBar"));
        }
        const comProjectData = costStatisticsStore.projectData.comProjectData[costStatisticsStore.projectData.selectOne];
        const data = comProjectData.find(item => item.projectName === costStatisticsStore.projectData.selectTwo)?.detailsByUser
        console.log(data)
        const dataset = [];
        for (const [product, values] of Object.entries(data)) {
            const entry = { product };
            for (const [key, value] of Object.entries(values)) {
                entry[key] = value;
            }
            dataset.push(entry);
        }
        const dimensions = []
        Object.values(data).forEach(item=>{
            dimensions.push(...Object.keys(item))
        })
        var option = {
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', ...dimensions],
                source: dataset,
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: dimensions.map(function (item) {
                return { type: 'bar' }
            })
        };

        option && chartProjectTwoBar.value.setOption(option);
    })
};

watch(
    () => costStatisticsStore,
    () => {
        if (costStatisticsStore.searchType === 'project') {
            initProjectOnePie();
            initProjectTwoPie()
            initProjectOneBar();
            initProjectTwoBar();
        }
        else {
            initUserPieChart();
            initUserBarChart();
        }

    },
    { deep: true }
);

const query = (params) => {
    const { group, userId, project, time } = params;
    let startDate = null;
    let endDate = null;
    try {
        if (time) {
            startDate = new Date(time[0]);
            endDate = new Date(time[1]);
        }
        costStatisticsStore.getProjectData({
            group,
            userId,
            project,
            startDate,
            endDate,
        });
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    query({ group: 'project' })
});
</script>
<style scoped>
.search {
    width: 100%;
    height: 50px;
}

.user-dept-chart {
    width: 100%;
    height: calc(100vh - 300px);
}

#userBar {
    width: 100%;
    height: 400px;
}

#deptBar {
    width: 100%;
    height: 400px;
}

#main {
    width: 100%;
    height: 400px;
}
</style>
