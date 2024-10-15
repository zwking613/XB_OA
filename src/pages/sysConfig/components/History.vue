<template>
    <div class="history-page">
        <TableModule :column="columns" :data="sysStore.historyList" :tableConfig="tableConfig" @refresh="refresh">
        </TableModule>
    </div>
</template>

<script setup name="History" lang="jsx">
import { useSysStore } from "@/stores/sys";

const sysStore = useSysStore();


const columns = [
    { props: 'id', label: '序号', align: 'center' },
    { props: 'typeName', label: '费用类型', align: 'center' },
    { props: 'project', label: '所属项目', align: 'center' },
    { props: 'departmentName', label: '所属部门', align: 'center' },
    { props: 'reimbursementAmount', label: '报销金额', align: 'center' },
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
