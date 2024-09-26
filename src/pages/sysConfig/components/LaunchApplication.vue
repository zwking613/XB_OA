<template>

    <div class="sys-config-page">
        <el-row :gutter="20">
            <el-col :span="24">
                <div class="flex flex-wrap gap-2">
                    <div v-for="(tag, tagIndex) in sysStore.procdefList"
                        class="flex items-center w-[170px] h-[60px] cursor-pointer rounded-lg category" :key="tagIndex"
                        @click="handleClick(tag.id,tag.key)" style="border: 1px solid #E6E6E8;">
                        <el-icon class="ml-[15px]" :style="{ color: getRandomColor() }">
                            <CreditCard />
                        </el-icon>
                        <span style="color: #10141A; font-size: 14px; margin-left: 15px;">{{ tag.description}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script setup>
import { useSysStore } from '@/stores/sys';

const sysStore = useSysStore();
const categories = [
    {
        name: '客服',
        tags: [
            { name: '客服中心排班', id: "project_process:4:12504" },
            { name: '加班', id: "project_process:4:12504" },
            { name: '客服中心外呼', id: "project_process:4:12504" },
            { name: '开卡补卡', id: "project_process:4:12504" }
        ]
    },
    {
        name: '行政',
        tags: [
            { name: '中控室报修', id: 'project_process:5:12505' },
            { name: '物资领用', id: 'project_process:6:12506' },
            { name: '物资报废', id: 'project_process:7:12507' },
            { name: '用印', id: 'project_process:8:12508' },
            { name: '用车', id: 'project_process:9:12509' },
            { name: '办公用品领用', id: 'project_process:10:12510' }
        ]
    },
    {
        name: '财务',
        tags: [
            { name: '报销', id: 'project_process:11:12511' },
            { name: '预算', id: 'project_process:12:12512' },
            { name: '付款', id: 'project_process:13:12513' },
            { name: '门店收款', id: 'project_process:14:12514' },
            { name: '退款', id: 'project_process:15:12515' },
            { name: '成本凭证', id: 'project_process:16:12516' }
        ]
    },
    {
        name: '人事',
        tags: [
            { name: '离职', id: 'project_process:17:12517' },
            { name: '招聘录用', id: 'project_process:18:12518' }
        ]
    },
    {
        name: '采购',
        tags: [
            { name: '物资采购', id: 'project_process:19:12519' },
            { name: '入库申请', id: 'project_process:20:12520' },
            { name: '物资调拨', id: 'project_process:21:12521' },
            { name: '物资盘点', id: 'project_process:22:12522' },
            { name: '采购申请', id: 'project_process:23:12523' }
        ]
    }
];

const getRandomColor = () => {
    let hex = '#';
    for (let i = 0; i < 6; i++) {
        hex += Math.floor(Math.random() * 16).toString(16);
    }
    return hex;
};

const handleClick = (tag,key) => {
    sysStore.fetchFlowDiagram(tag,key);
}

onMounted(() => {
    sysStore.getProcdefList();
});
</script>

<style scoped>
.sys-config-page {
    padding: 20px;
}

.category {
    margin-bottom: 20px;
}

.tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.sys-config-page {
    padding: 20px;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #f56c6c;
    font-size: 14px;
}

.category {
    margin-bottom: 20px;
}

.category h3 {
    margin-bottom: 10px;
}
</style>
