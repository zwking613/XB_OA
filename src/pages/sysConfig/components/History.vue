<template>
    <div class="history-page">
        <TableModule :actions="actions" :column="columns" :data="sysStore.historyList" :tableConfig="tableConfig"
            @refresh="refresh">
        </TableModule>
        <el-dialog v-model="dialogVisible" width="800" destroy-on-close @close="dialogVisible = false">
            <el-descriptions title="详情" :column="2" border label-align="center" align="center">
                <el-descriptions-item label-align="center" align="center" label="费用类型">{{
                    copyInfo.typeName
                    }}</el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="报销金额">
                    {{ copyInfo.reimbursementAmount }} 元
                    <span style="font-size: 12px;margin-left: 10px;"
                        v-if="copyInfo.type !== 'IMPLEMENTATION_FEE'">实际报销:{{
                        copyInfo.actualAmount }}元</span>
                </el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="地点">
                    {{ copyInfo.place }}
                </el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="所属项目">
                    {{ copyInfo.project }}
                </el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="拜访单位">
                    {{ copyInfo.company }}
                </el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="关联工单">
                    {{ copyInfo.businessTravel }}
                </el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="开始时间">
                    {{ copyInfo.startTime.split(" ")[0] }} - {{ copyInfo.startPeriod }}
                </el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="结束时间">
                    {{ copyInfo.endTime.split(" ")[0] }} - {{ copyInfo.endPeriod }}
                </el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="部门">{{
                    copyInfo.departmentName
                    }}</el-descriptions-item>
                <el-descriptions-item label-align="center" align="center" label="附件">
                    <div v-for="item in copyInfo.fileList" :key="item.fileId">
                        <el-link type="success" :href="`${download}?fileId=${item.fileId
                            }`">{{ item.fileName }}</el-link>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item label="费用明细" :span="2">
                    <el-table :data="copyInfo.details" border style="width: 100%;">
                        <el-table-column
                            :prop="copyInfo.type === 'IMPLEMENTATION_FEE' ? 'participants' : 'type'"
                            :label="copyInfo.type === 'IMPLEMENTATION_FEE' ? '参与人' : '项目名称'" width="180">
                        </el-table-column>
                        <el-table-column :prop="copyInfo.type === 'IMPLEMENTATION_FEE' ? 'days' : 'cost'"
                            :label="copyInfo.type === 'IMPLEMENTATION_FEE' ? '参与天数' : '费用占比(元)'"
                            width="180"></el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                    </el-table>
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup name="History" lang="jsx">
import { useSysStore } from "@/stores/sys";

const sysStore = useSysStore();
const dialogVisible = ref(false);
const copyInfo = ref({});

const columns = [
    { props: 'id', label: '序号', align: 'center' },
    { props: 'typeName', label: '费用类型', align: 'center' },
    { props: 'project', label: '所属项目', align: 'center' },
    { props: 'departmentName', label: '所属部门', align: 'center' },
    { props: 'reimbursementAmount', label: '报销金额', align: 'center' },
    { props: 'actualAmount', label: '实际金额', align: 'center' },
    { props: 'place', label: '地点', align: 'center' },
    { props: 'company', label: '拜访单位', align: 'center' },
    { props: 'businessTravel', label: '关联工单', align: 'center' },
    {
        props: 'startTime', label: '开始时间', align: 'center',
        customRender: ({ row }) => {

            return <>
                {row.startTime} - {row.startPeriod}
            </>
        }
    },
    {
        props: 'endTime', label: '结束时间', align: 'center',
        customRender: ({ row }) => (
            <>
                {row.endTime}-{row.endPeriod}
            </>
        )
    },
    { props: "statusName", label: '状态', align: 'center' },
];

const refresh = (params) => {
    sysStore.getHistoryList(params);
}
const handleDetail = (row) => {
    copyInfo.value = row;
    dialogVisible.value = true;
}
const actions = ref([
    {
        title: '详情',
        icon: 'Postcard',
        color: "#F67777",
        handler: handleDetail,
    }
])
const tableConfig = {
    filterItem: [
    //     {
    //     label: "开始时间",
    //     prop: "startTime",
    //     type: "datePick",
    // }, {
    //     label: "结束时间",
    //     prop: "endTime",
    //     type: "datePick",
    //     style: { width: "173px" },
    // }, 
    {
        label: "类型",
        prop: "searchType",
        type: "select",
        value: sysStore.historyList.filter.searchType,
        style: { width: "173px" },
        options: [{
            label: "我审核的",
            value: 0,
        }, {
            label: "我发起的",
            value: 1,
        }]
    }, {
        label: "项目",
        prop: "project",
        component: <SelectLimit style="width: 173px;" url="/sys/getProjectList" dataKey="list" labelKey="name"
            valueKey="name" searchKey="name" placeholder="请选择所属项目" tag-type="warning" />
    }]
}

onMounted(() => {
    sysStore.getHistoryList();
});
</script>

<style scoped></style>
