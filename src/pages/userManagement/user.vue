<template>
  <div class="user-page">
    <TableModule :column="columns" :data="userStore.userList" @edit="edit" @del="handleDelete" :editConfig="editConfig"
      :tableConfig="tableConfig" @insert="insert" :insertConfig="editConfig" @refresh="refresh" :actions="actions">
    </TableModule>
  </div>
</template>

<script setup name="User" lang="jsx">
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const editConfig={
  rules: {
    userName: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话号码', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
  },
  fields:[{
    label: "用户名",
    prop: "userName",
    type:"input"
  },{
    label: "电话",
    prop: "phone",
    type:"input"
  }]
}

const columns = [
  { props: 'id', label: '序号', align: 'center' },
  { props: 'userName', label: '用户名', align: 'center' },
  { props: 'phone', label: '电话', align: 'center' },
  {
    props: 'admin',
    label: '权限',
    align: 'center',
    customRender: ({ row }) => (
      <el-tag type={row.admin ? 'success' : 'info'}>
        {row.admin ? '管理员' : '用户'}
      </el-tag>
    )
  },
  {
    props: 'deptName',
    label: '所属部门',
    align: 'center',
    customRender: ({ row }) => (
      <>
        {row.deptName && row.deptName.split(',').map(deptName => (
          <el-tag class="mr-1" key={deptName}>
            {deptName}
          </el-tag>
        ))}
      </>
    )
  },
];

const edit = ({ value, callback })=>{
  userStore.addUser(value, callback.onSuccess)
}

const handleDelete = ({id}) => {
  userStore.deleteUser(id);
}

const insert=({value,callback})=>{
  userStore.addUser(value, callback.onSuccess)
}

const refresh=(params)=>{
  userStore.getUserList(params);
}


const handleResetPassword = (row) => {
  userStore.resetPassword(row.id);
}


const tableConfig = {
  filterItem: [{
    label: "用户名",
    prop: "name",
    type: "input",
    clearable: true
  },
  {
    label: "电话",
    prop: "phone",
    type: "input",
    clearable: true
  }],
  
}

const actions = ref([
  {
    title: '重置',
    icon: 'Refresh',
    color: "#F67777",
    confirmTitle: "确定要重置吗？",
    handler: handleResetPassword
  }
])

onMounted(() => {
  userStore.getUserList();
});
</script>

<style scoped></style>
