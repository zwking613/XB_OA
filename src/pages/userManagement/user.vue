<template>
  <div class="user-page">
    <div class="flex justify-between w-full mb-2">
      <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input clearable v-model="searchForm.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input clearable v-model="searchForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog v-model="addDialogVisible" title="添加用户" width="30%" destroy-on-close>
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
    <el-table :loading="userStore.loading" :data="userStore.userList.list" style="width: 100%" border>
      <el-table-column prop="id" label="序号" align="center" />
      <el-table-column prop="userName" label="用户名" align="center" />
      <el-table-column prop="phone" label="电话" align="center" />
      <el-table-column prop="admin" label="权限" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.admin ? 'success' : 'info'">
            {{scope.row.admin ? "管理员" : "用户"}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" align="center">
        <template #default="scope">
          <el-tag class="mr-1" v-if="scope.row.deptName" v-for="deptName in scope.row.deptName.split(',')"
            :key="deptName">
            {{ deptName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250">
        <template #default="scope">
          <!-- 编辑 -->
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>

          <!-- 重置密码 -->
          <el-popconfirm title="确定重置密码吗?" @confirm="handleResetPassword(scope.row)" confirm-button-text=" 确定"
            cancel-button-text="取消">
            <template #reference>
              <el-button size="small" type="warning">重置</el-button>
            </template>
          </el-popconfirm>

          <!-- 删除 -->
          <el-popconfirm title="确定删除吗?" @confirm="handleDelete(scope.row)" confirm-button-text=" 确定"
            cancel-button-text="取消">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>

      </el-table-column>
    </el-table>
    <div class="flex justify-end w-full mt-4 ">
      <el-pagination layout="prev, pager, next" background :total="userStore.userList.totalCount"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup name="User">
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
const userStore = useUserStore();
const addDialogVisible = ref(false);

const userForm = ref({
  id: '',
  userName: '',
  phone: '',
});

const userFormRef = ref(null);
const searchForm = ref({
  userName: '',
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
const handleCurrentChange = (pageNo) => {
  userStore.getUserList({ pageNo });
}
const handleSearch = () => {
  const { pageNo, pageSize } = userStore.userList;
  userStore.getUserList({ pageNo, pageSize, filter:searchForm.value });
}
onMounted(() => {
  userStore.getUserList();
});
</script>

<style scoped>

</style>
