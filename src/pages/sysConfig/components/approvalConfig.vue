<template>
  <TableModule
  :column="columns"
  :data="{
    list:approvalConfigStore.approvalConfig
  }"
  @edit="edit"
  :editConfig="editConfig"
  :tableConfig="tableConfig"
  >
  </TableModule>
</template>
<script setup lang="jsx">
import { useApprovalConfigStore } from "@/stores/approvalConfig";
const approvalConfigStore = useApprovalConfigStore();
const columns = [{
    props: "name",
    label: "部门名称",
  },{
    props: "approver",
    label: "审核人",
    customRender: ({ row }) => {
        return (row && row.approver) ? <el-tag type="danger">{row.approver.split('%')[1]}</el-tag> : ''
    }
  },{
    props: "ccPerson",
    label: "抄送人",
    customRender: ({ row }) => {
        if(row&&row.ccPerson){
            return row.ccPerson.map(item => {
                return <el-tag type="warning" class="mr-1" key={item}>{item.split('%')[1]}</el-tag>
            })
        }
        return ''
    }
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
      label: "部门名称",
      prop: "name",
      component: <SelectLimit url="/department/list" dataKey='list' labelKey="name"
          valueKey="name" searchKey="name" placeholder="请选择部门"  />
    },{
      label: "审核人",
      prop: "approver",
      component: <SelectLimit url="/user/page" dataKey={['list', 'list']} labelKey="userName"
          valueKey={['id', 'userName']} searchKey="name" placeholder="请选择用户"/>
    },{
      label: "抄送人",
      prop: "ccPerson",
      component: <SelectLimit url="/user/page" dataKey={['list', 'list']} labelKey="userName"
          valueKey={['id', 'userName']} searchKey="name" placeholder="请选择用户" multiple={true} />
    }],
  rules: {
    name: [{required: true,message: "请输入部门名称",trigger: "blur"}],
    approver: [{required: true,message: "请输入审核人", trigger: "blur"}],
    ccPerson: [{required: true,message: "请输入抄送人",trigger: "blur"}],
  },
});
const edit = ({ value, callback }) => {
value.value = {
    approver: value.approver,
    ccPerson: value.ccPerson.join(","),
}
delete value.approver
delete value.ccPerson
  approvalConfigStore.updateApprovalConfig(value, callback);
};

onMounted(() => {
    approvalConfigStore.getApprovalConfig();
});
</script>
