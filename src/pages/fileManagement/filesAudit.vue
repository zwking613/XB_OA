<template>
    <div>
        <el-radio-group class="mb-4" v-model="params.searchType" @change="handleSearchTypeChange">
            <el-radio value="1" border>我分享的</el-radio>
            <el-radio value="2" border>由我审核</el-radio>
        </el-radio-group>
        <el-table :data="fileAuditStore.auditList.list" style="width: 100%" border>
            <el-table-column prop="id" label="序号" width="80" align="center" />
            <el-table-column prop="fileName" label="文件名" align="center" />
            <el-table-column prop="fileSize" label="文件大小" align="center" />
            <el-table-column prop="shareUser" label="分享用户" align="center" />
            <el-table-column prop="shareTime" label="分享时间" align="center" />
            <el-table-column prop="status" label="状态" align="center">
                <template #default="scope">
                    <el-tag :type="
              scope.row.status === 0
                ? 'warning'
                : scope.row.status === 1
                ? 'success'
                : 'danger'
            ">
                        {{
                        scope.row.status === 0
                        ? "待审核"
                        : scope.row.status === 1
                        ? "已通过"
                        : "已拒绝"
                        }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button v-if="scope.row.status === 0" type="success" size="small"
                        @click="handleAudit(scope.row.id, 1)">通过</el-button>
                    <el-button v-if="scope.row.status === 0" type="danger" size="small"
                        @click="handleAudit(scope.row.id, 2)">拒绝</el-button>
                    <el-button v-if="scope.row.status === 0" type="info" size="small"
                        @click="handleCancel(scope.row.id)">取消审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-end w-full mt-4 ">
            <el-pagination layout="prev, pager, next" background :total="fileAuditStore.auditList.totalCount"
                @current-change="handleCurrentChange" />
        </div>
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
  try {
    await ElMessageBox.confirm("确定要执行此操作吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await fileAuditStore.auditFileShare({ id, status });
    await fetchAuditList();
  } catch (error) {
    console.error("审核操作失败", error);
  }
};

const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm("确定要取消审核吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await fileAuditStore.cancelAudit(id);
    await fetchAuditList();
  } catch (error) {
    console.error("取消审核失败", error);
  }
};

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
