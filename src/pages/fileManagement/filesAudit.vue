<template>
  <div>
    <el-radio-group class="mb-4" v-model="params.searchType" @change="handleSearchTypeChange">
      <el-radio value="1" border>我分享的</el-radio>
      <el-radio value="2" border>由我审核</el-radio>
    </el-radio-group>
    <el-table :data="fileAuditStore.auditList.list" style="width: 100%" border>
      <el-table-column prop="id" label="序号" width="80" align="center" />
      <el-table-column prop="fileName" label="文件名" align="center" />
      <el-table-column prop="submitUserName" label="提交用户" align="center" />
      <el-table-column prop="submitTime" label="提交时间" align="center" />
      <el-table-column prop="personInChargeName" label="审核人" align="center" />
      <el-table-column prop="auditTime" label="审核时间" align="center" />
      <el-table-column prop="result" label="状态" align="center">
        <template #default="scope">
          <el-tag :type="
              scope.row.result === '待审核'
                ? 'warning'
                : scope.row.result === '已通过'
                ? 'success'
                : 'danger'
            ">
            {{ scope.row.result }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleAudit(scope.row.id, 1)">通过</el-button>
          <el-popconfirm title="确定删除吗?" @confirm="handleDelete(scope.row)" confirm-button-text=" 确定"
            cancel-button-text="取消">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end w-full mt-4 ">
      <el-pagination layout="prev, pager, next" background :total="fileAuditStore.auditList.totalCount"
        @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="userDialogVisible" title="分享人" width="400px" destroy-on-close :before-close="userHandleClose">
      <el-form :model="formUser"  ref="formUserRef">
        <el-form-item label="分享人" prop="sharePerson">
          <el-select v-model="formUser.sharePerson" placeholder="请选择分享人">
            <el-option v-for="user in fileAuditStore.userList" :key="user.id" :label="user.userName" :value="user.id" />
          </el-select>
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
  </div>
</template>
<script setup>
import { ref, onMounted, reactive,watch } from "vue";
import { useFileAuditStore } from "@/stores/filesAudit";

const fileAuditStore = useFileAuditStore();
const params = ref({
  pageNo: 1,
  pageSize: 10,
  searchType: '1',
});

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


const fetchAuditList = async () => {
    fileAuditStore.fetchAuditList(params.value);
};

const handleCurrentChange = (pageNo) => {
    params.pageNo = pageNo;
};

const handleSearchTypeChange=(e)=>{
    params.searchType = e;
}

const handleAudit = async (id, status) => {
  fileAuditStore.fetchUserList(() => {
    userDialogVisible.value = true
    formUser.value.id = id
  });
   
};


const handleDelete = (row)=>{
    console.log(row)
  fileAuditStore.deleteAudit(row.id);
}

onMounted(() => {
  fetchAuditList();
});

watch(
  () => ({ ...params.value }),
  () => {
    fetchAuditList();
  },
  { deep: true }
);


</script>
