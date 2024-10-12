<template>
  <div>
    <el-radio-group class="mb-4" v-model="searchType" @change="handleSearchTypeChange">
      <el-radio value="1" border>我分享的</el-radio>
      <el-radio value="2" border>由我审核</el-radio>
    </el-radio-group>

    <el-dialog v-model="userDialogVisible" title="分享人" width="400px" destroy-on-close :before-close="userHandleClose">
      <el-form :model="formUser" ref="formUserRef">
        <el-form-item label="分享人" prop="sharePerson">
          <SelectTree v-model="formUser.sharePerson" url="/department/list" dataKey="list" labelKey="name" valueKey="id"
            placeholder="请选择分享人" :customData="customData" :multiple="true" />
          <!-- <el-select v-model="formUser.sharePerson" placeholder="请选择分享人">
            <el-option v-for="user in fileAuditStore.userList" :key="user.id" :label="user.userName" :value="user.id" />
          </el-select> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false" size="small">取消</el-button>
          <el-button @click="submitUserForm(false)" type="danger" size="small">不通过</el-button>
          <el-button type="success" @click="submitUserForm(true)" size="small">
            通过
          </el-button>
        </span>
      </template>
    </el-dialog>
    <TableModule :loading="fileAuditStore.loading" :column="columns" :data="fileAuditStore.auditList"
      @del="handleDelete" @refresh="fetchData" :actions="actions">
    </TableModule>
    <!-- <Grid :loading="fileAuditStore.loading" :fetchData="fetchData" :columns="columns" :list="fileAuditStore.auditList"
      :delete="handleDelete" :actions="actions" /> -->
  </div>
</template>
<script setup lang="jsx">
import { useFileAuditStore } from "@/stores/filesAudit";

const fileAuditStore = useFileAuditStore();
const searchType = ref('1');

const userDialogVisible = ref(false);
const formUserRef = ref(null);

const formUser = ref({
  sharePerson: '',
});
const userHandleClose = () => {
  userDialogVisible.value = false;
  formUser.value = {
    sharePerson: '',
  };
}

const customData = (data) => {
  return data.map(item => {
    return {
      ...item,
      value: item.id,
      name: item.name || item.userName,
      children: item.users ? customData(item.users) : []
    }
  })
}
const submitUserForm = (type) => {
  if (!type && !(formUser.value.sharePerson === '')){
    ElMessage.error("请选择审核人");
    return;
  }
  fileAuditStore.auditFileShare({
      id: formUser.value.id,
      sharePeople: formUser.value.sharePerson,
      result: type,
    }, userHandleClose)
}


const handleSearchTypeChange=(e)=>{
  if(e === '2'){
    actions.value = [
      {
        title: '审核',
        icon: 'Compass',
        color: "#FF8040",
        handler: handleAudit
      }
    ]
  }else{
    actions.value = []
  }
  searchType.value = e;
}

const handleAudit = async ({id}) => {
  fileAuditStore.fetchUserList(() => {
    userDialogVisible.value = true
    formUser.value.id = id
  });
   
};

const handleDelete = (row)=>{
  fileAuditStore.deleteAudit(row.id);
}
const fetchData = async ({ pageNo=1, pageSize=10 }={}) => {
  fileAuditStore.fetchAuditList({ pageNo, pageSize, searchType:searchType.value });
};

const columns = [
  { props: 'id', label: '序号', width: 80, align: 'center' },
  { props: 'fileName', label: '文件名', align: 'center' },
  { props: 'submitUserName', label: '提交用户', align: 'center' },
  { props: 'submitTime', label: '提交时间', align: 'center' },
  { props: 'personInChargeName', label: '审核人', align: 'center' },
  { props: 'auditTime', label: '审核时间', align: 'center' },
  {
    props: 'result',
    label: '状态',
    align: 'center',
    customRender: ({ row }) => (
      <el-tag
        type={
          row.result === '待审核'
            ? 'warning'
            : row.result === '已通过'
              ? 'success'
              : 'danger'
        }
      >
        {row.result}
      </el-tag>
    ),
  },
];
const actions = ref()

onMounted(() => {
  fetchData();
});

watch(
  () => searchType.value,
  () => {
    fetchData();
  },
  { immediate: true, deep: true }
  
);


</script>
