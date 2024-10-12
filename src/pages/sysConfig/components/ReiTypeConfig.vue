<template>
    <TableModule 
    :column="columns" 
    :data="{
        list: configStore.reiTypeConfig
    }" 
    @edit="edit" 
    :editConfig="editConfig" 
    @insert="insert" 
    :insertConfig="editConfig" 
    :tableConfig="tableConfig">
    </TableModule>
</template>
<script setup lang="jsx">
import { useConfigStore } from "@/stores/config"; 
const configStore = useConfigStore();
const columns = [{
    props: "type",
    label: "类型",
    customRender: ({ row })=>{
        return row.type === "TRAVEL_EXPENSES" ? "差旅费" : "日常开支"
    }
},{
    props: "name",
    label: "项目名称",
}]
const tableConfig = reactive({
    isPaging: false,
    tableStyle: {
        width: "100%",
        height: "100%",
    },
});
const editConfig = reactive({
    fields: [{
        label: "类型",
        prop: "type",
        type: "select",
        options: [
            { label: '差旅费', value: 'TRAVEL_EXPENSES' },
            { label: '日常开支', value: 'DAILY_EXPENSES' }
        ]
    },{
        label: "名称",
        prop: "name",
        type: "input"
    }],
    rules: {
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
    },
});
const insert = ({ value, callback })=>{
    configStore.updateReiType(value, callback)
}
const edit = ({ value, callback }) => {
    configStore.updateReiType(value, callback)
};

onMounted(() => {
    configStore.getReiTypeList();
});
</script>
