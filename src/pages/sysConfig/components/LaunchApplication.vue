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
