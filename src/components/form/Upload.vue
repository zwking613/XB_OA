<template>
  <el-upload ref="upload" :action="data.action" :multiple="data.multiple" :on-preview="handlePreview"
    :limit="data.limit || 1" :on-success="handleSuccess" :on-remove="handleRemove" :data="data.data" :headers="{
      token: getToken,
    }"  :on-exceed="handleExceed">
    <el-button type="primary" icon="upload">文件上传</el-button>
    <template #tip v-if="data.tip">
      <div class="el-upload__tip">
        {data.tip}
      </div>
    </template>
  </el-upload>
</template>
<script setup>
import { genFileId } from 'element-plus'
const { data, success } = defineProps({
  data: {
    type: Object,
    required: true,
    default: {}
  },
  success: {
    type: Function,
    required: true,
    default: () => {}
  }
})
const upload = ref()
const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0] 
  file.uid = genFileId()
  upload.value.handleStart(file)
}
const getFileId =(fileList)=> {
  return fileList.map(item => item.response.list).join(',')
}
const handleSuccess = function (response, file, fileList) {
  if (response.code === 200) {
    success(getFileId(fileList))
  }
  else {
    ElMessage.error(response.list)
  }
}
const handleRemove = function (file, fileList) {
  success(getFileId(fileList))
}
const handlePreview = function (file) {
  console.log(file)
}


const getToken = computed(() => {
  return localStorage.getItem("token") || "";
});
</script>