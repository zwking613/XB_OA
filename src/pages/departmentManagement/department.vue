<template>
  <div class="department-page">
    <div class="mb-4">
      <el-button type="primary" @click="openInsertDialog" :loading="loading">
        添加部门
      </el-button>
    </div>
    <!-- 添加部门 -->
    <el-dialog v-model="dialogVisible" title="添加部门" width="30%" :before-close="handleClose">
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门主管" prop="managerId">
          <el-select v-model="form.managerId" placeholder="请选择部门主管">
            <el-option v-for="user in departmentStore.userList" :key="user.id" :label="user.userName"
              :value="user.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>


    <el-tree :data="departmentStore.departmentList" node-key="id" default-expand-all :expand-on-click-node="false">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>
            <el-icon v-if="data.type === 'department'">
              <Folder />
            </el-icon>
            <el-icon size="16" v-else>
              <User />
            </el-icon>
            {{ data.label }}
            <el-tag v-if="data.isManager" class="ml-2" size="small" type="success">主管</el-tag>
          </span>
          <span>
            <el-button v-if="data.type === 'department'" type="primary" size="small" @click.stop="handleAddUser(data)">
              添加用户
            </el-button>
            <el-popconfirm title="确定删除吗?" @confirm="deleteDepartment(node, data, data.type)"
              confirm-button-text="确定" cancel-button-text="取消">
              <template #reference>
                <el-button type="danger" size="small">
                  删除
                </el-button>
              </template>
            </el-popconfirm>

          </span>
        </span>
      </template>
    </el-tree>

    <!-- 添加用户 -->
    <el-dialog v-model="userDialogVisible" title="添加用户" width="500px" destroy-on-close :before-close="userHandleClose">
      <el-form :model="formUser" :rules="userRules" ref="formUserRef">
        <el-form-item label="用户" prop="users">
          <!-- <el-select v-model="formUser.users" placeholder="请选择用户" multiple>
            <el-option v-for="user in departmentStore.userList" :key="user.id" :label="user.userName"
              :value="user.id" />
          </el-select> -->
          <SelectLimit v-model="formUser.users" url="/user/page" :dataKey="['list', 'list']" labelKey="userName"
            valueKey="id" searchKey="userName" :change="onChange" placeholder="请选择用户" :multiple="true"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="User">
import { useDepartmentStore } from "@/stores/department";
import SelectLimit from '@/components/from/SelectLimit.vue';
import { onMounted, ref } from "vue";
const departmentStore = useDepartmentStore();
const dialogVisible = ref(false);
const formRef = ref(null);
const loading = ref(false);
const form = ref({
  name: '',
  managerId: '',
});
const userDialogVisible = ref(false);
const formUserRef = ref(null);
const formUser = ref({
  users: '',
  deptId: '',
});
const userRules = {
  users: [
    { required: true, message: '请选择用户', trigger: 'change' },
  ],
};
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
  ],
  managerId: [
    { required: true, message: '请选择部门主管', trigger: 'change' },
  ],
};

const handleClose = () => {
  dialogVisible.value = false;
  form.value = {
    name: '',
    managerId: '',
  };
};


// 删除部门
const deleteDepartment = (node, { id, fatherId },type) => {
  if(type === 'department'){
    departmentStore.removeDepartment(id);
  }else{
    departmentStore.deleteUserFromDept({
      deptId: fatherId,
      userId: id,
    });
  }
};

const openInsertDialog = () => {
  departmentStore.fetchUserList(()=>{
    dialogVisible.value = true;
  });
}

const handleAddUser = (data) => {
  departmentStore.fetchUserList(() => {
    formUser.value.deptId = data.id;
    userDialogVisible.value = true;
  });
}

const userHandleClose = () => {
  userDialogVisible.value = false;
  formUser.value = {
    users: '',
    deptId: '',
  };
}

const submitUserForm = () => {
  formUserRef.value.validate((valid) => {
    if (valid) {
      departmentStore.assignDepartmentUser({
        users: formUser.value.users.join(','),
        deptId: formUser.value.deptId,
      }, userHandleClose)
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      try {
        departmentStore.addDepartment(form.value,()=>{
          dialogVisible.value = false;
        })
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false;
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}

onMounted(async () => {
  await departmentStore.fetchDepartmentList();
});

</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 500;
    padding-right: 20px;
  }
</style>
