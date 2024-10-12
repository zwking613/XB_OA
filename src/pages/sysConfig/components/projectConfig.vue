<template>
    <TableModule :column="columns" :data="{
        list: configStore.projectConfig
    }" @edit="edit" :editConfig="editConfig" @insert="insert" :insertConfig="editConfig" :tableConfig="tableConfig">
    </TableModule>
</template>
<script setup lang="jsx">
import { useConfigStore } from "@/stores/config"; 
const configStore = useConfigStore();
const props = defineProps({
    type: {
        type: String,
        default: 'project'
    }
})
const columns = [{
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
        label: "名称",
        prop: "name",
        type: "input"
    }],
    rules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
    },
});
const insert = ({ value, callback })=>{
    // let values = {
    //     name: configStore.type,
    //     value: value.name
    // }
    // if (configStore.projectConfig.length === 0){
    //     values.value = value.name 
    // }
    // else{
    //     values.value = value.name + ',' + configStore.projectConfig.map(item => item.name).join(',')
    // }
    configStore.updateProject(value, callback)
}
const edit = ({ value, callback }) => {
    // let values = {
    //     id: value.id,
    //     name: configStore.type,
    //     value: configStore.projectConfig.map(item => {
    //         if (item.id === value.id) {
    //             item.name = value.name
    //         }
    //         return item.name
    //     }).join(',')
    // }
    configStore.updateProject(value, callback)
};

onMounted(() => {
    // configStore.getProjectConfig(props.type);
    configStore.getProjectList();
});
</script>
