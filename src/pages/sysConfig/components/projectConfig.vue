<template>
    <TableModule :column="columns" :data="{
        list: projectConfigStore.projectConfig
    }" @edit="edit" :editConfig="editConfig" @insert="insert" :insertConfig="editConfig" :tableConfig="tableConfig">
    </TableModule>
</template>
<script setup lang="jsx">
import { useProjectConfigStore } from "@/stores/projectConfig"; 
const projectConfigStore = useProjectConfigStore();
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
    let values = {
        name: projectConfigStore.type,
        value: value.name
    }
    if (projectConfigStore.projectConfig.length === 0){
        values.value = value.name 
    }
    else{
        values.value = value.name + ',' + projectConfigStore.projectConfig.map(item => item.name).join(',')
    }
    projectConfigStore.updateProjectConfig(values, callback)
}
const edit = ({ value, callback }) => {
    let values = {
        id: value.id,
        name: projectConfigStore.type,
        value: projectConfigStore.projectConfig.map(item => {
            if (item.id === value.id) {
                item.name = value.name
            }
            return item.name
        }).join(',')
    }
    projectConfigStore.updateProjectConfig(values, callback)
};

onMounted(() => {
    projectConfigStore.getProjectConfig(props.type);
});
</script>
