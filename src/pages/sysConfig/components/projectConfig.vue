<template>
    <div>
      <TableModule :actions="actions" :column="columns" :data="{list: projectConfig}" @edit="edit" :editConfig="editConfig" @insert="insert" :insertConfig="editConfig" :tableConfig="tableConfig">
      </TableModule>
      <DialogModule  :dialogConfig="dialogConfig" @onCancel="cancelInsertDialog" @onConfirm="insertFather">
        <FormModule ref="refForm" :fromConfig="formConfig"></FormModule>
      </DialogModule>
    </div>
</template>
<script setup lang="jsx">
import { useConfigStore } from "@/stores/config";
import { storeToRefs } from 'pinia'
const configStore = useConfigStore();
const  {projectConfig} = storeToRefs(configStore)
const refForm = ref()
const columnsData = ref({})
const dialogConfig = reactive({
  visible: false,
  title: "添加",
  okTitle: "添加",
  cancelTitle: "取消",
  draggable: true,
  isFooter: true,
  width: 500,
  dialogModal: false
});
const formConfig = reactive({
  form: {},
  fields: [{
    label:"名称",
    type:"input",
    prop:"name",
  }],
  rules: {name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
    ]},
  inline: false,
  okTitle: "确认",
  cancelTitle: "取消",
  size: "default",
  labelPosition: "right",
  layout: 1,
  labelWidth: "auto",
  formItemLabelWidth: "120px",
  isReset: false,
  isFormBtn: false,
});
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
    configStore.updateProject(value, callback)
}
const edit = ({ value, callback }) => {
    configStore.updateProject(value, callback)
};
const openInsertDialog = (columns) => {
  dialogConfig.visible = true;
  columnsData.value = columns;
}
const cancelInsertDialog = () => {
  dialogConfig.visible = false;
  columnsData.value={}
}
const insertFather = ()=>{
  refForm.value.formRef.validate((valid) => {
    if (valid) {
      console.log(refForm.value.formParameter.form)
      const value  = {
       ...refForm.value.formParameter.form,
        father:columnsData.value.id
      }
      configStore.updateProject(value, {
        onSuccess:cancelInsertDialog
      })
    } else {
      return false;
    }
  });
}

const actions = [
  {
    title: "添加",
    icon: "Plus",
    color: "#ff406d",
    handler: openInsertDialog,
  }
]
onMounted(() => {
    configStore.getProjectList();
});
</script>
