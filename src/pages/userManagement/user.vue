<template>
  <div class="user-page">
    <div class="flex justify-between w-full mb-2">
      <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input clearable v-model="searchForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input clearable v-model="searchForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog v-model="addDialogVisible" title="添加/修改" width="30%" destroy-on-close>
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入电话号码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <Grid :loading="userStore.loading" :fetchData="fetchData" :columns="columns" :list="userStore.userList" :edit="handleEdit"
      :delete="handleDelete" :actions="actions" />
  </div>
</template>

<script setup name="User" lang="jsx">
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import Grid from '@/components/grid/Grid.vue';

const userStore = useUserStore();
const addDialogVisible = ref(false);

const userForm = ref({
  id: '',
  userName: '',
  phone: '',
});

const userFormRef = ref(null);
const searchForm = ref({
  name: '',
  phone: '',
});
const rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
});

const handleDelete = (row) => {
  userStore.deleteUser(row.id);
}

const handleEdit = (row) => {
  addDialogVisible.value = true;
  userForm.value = {
    userName: row.userName,
    phone: row.phone,
    id: row.id,
  }
}

const handleAddUser = () => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      userStore.addUser(userForm.value, () => {
        addDialogVisible.value = false;
        userForm.value = {
          id: '',
          userName: '',
          phone: '',
        }
      })
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}

const handleResetPassword = (row) => {
  userStore.resetPassword(row.id);
}

const handleSearch = () => {
  const { pageNo, pageSize } = userStore.userList;
  userStore.getUserList({ pageNo, pageSize, filter:searchForm.value });
}
const columns = [
  { prop: 'id', label: '序号', align: 'center' },
  { prop: 'userName', label: '用户名', align: 'center' },
  { prop: 'phone', label: '电话', align: 'center' },
  {
    prop: 'admin',
    label: '权限',
    align: 'center',
    customRender: ({ row }) => (
      <el-tag type={row.admin ? 'success' : 'info'}>
        {row.admin ? '管理员' : '用户'}
      </el-tag>
    )
  },
  {
    prop: 'deptName',
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

const fetchData = async ({ pageNo, pageSize }) => {
    userStore.getUserList({ pageNo, pageSize, ...searchForm.value });
};
const actions = [
  {
    label: '重置',
    icon: 'Refresh',
    type: 'warning',
    onClick: handleResetPassword
  },
]
onMounted(() => {
  userStore.getUserList();
});
</script>

<style scoped>

</style>
