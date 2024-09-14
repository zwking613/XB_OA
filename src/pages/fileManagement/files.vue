<template>
  <div>
    <el-container class="h-[calc(100vh-120px)]">
      <el-aside width="300px" class="border-r">
        <!-- 上传文件 -->
        <el-upload :action="upload" :data="{ model: 'CLOUD' }" :headers="{
          token: headers
        }" :on-error="handleError" :on-success="handleSuccess" :show-file-list="false">
          <el-button type="primary" class="w-[275px]">上传文件</el-button>
        </el-upload>

        <!-- 目录 -->
        <el-menu :default-active="defaultActive" class="h-[calc(100vh-200px)] el-menu-vertical-demo"
          @select="handleSelect">
          <el-menu-item v-for="(item, index) in directory" :key="index" :index="(index + 1).toString()">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>

      </el-aside>

      <el-main oncontextmenu="return false;">
        <!-- 文件操作栏 -->
        <div class="flex items-center justify-between w-full mb-4 border-b-2 border-indigo-[#e3e3e3] border-solid h-8">
          <div>
            <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
            <el-button type="danger" class="ml-4" :disabled="!selectedFiles.length" @click="handleDelete">删除</el-button>
            <el-button type="primary" class="ml-4" @click="refreshFiles">刷新</el-button>
          </div>
          <div>
            <el-radio-group v-model="viewMode" class="ml-4 float-end" @change="handleViewModeChange">
              <el-radio value="list">列表视图</el-radio>
              <el-radio value="grid">网格视图</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 文件列表 -->
        <ul :class="[viewMode === 'grid' ? 'flex flex-wrap file-list' : '','file-list-container']">
          <li @dblclick="(e) => handleDoubleClick(e, file)" @contextmenu.prevent="handleContextMenu($event, file)"
            v-for="file in fileStore.fileList" :key="file.id" :class="[
              viewMode === 'grid' ? 'w-[190px] h-16 block' : 'w-[100%]',
              'p-2  hover:bg-gray-100 break-words cursor-pointer'
            ]" oncontextmenu="return false;">
            <el-checkbox v-model="file.selected" @change="(e) => updateSelectedFiles(e, file)"></el-checkbox>
            <el-icon class="ml-2">
              <Folder v-if="file.type === 'folder'" />
              <Files v-else />
            </el-icon>
            <!-- <el-tooltip class="box-item" effect="dark" :content="file.fileName" placement="bottom"> -->
            <span v-if="renameFile.fileId === file.fileId" class="w-auto">
              <el-input class="w-auto" v-model="renameFile.fileName" @blur="handleRenameBlur(file)"></el-input>
            </span>
            <span v-else :class="[
              viewMode === 'grid' ? 'mt-2 block w-full truncate text-[14px]' : 'ml-2 inline-block truncate text-[14px]'
            ]">{{ file.fileName }}</span>
            <!-- </el-tooltip> -->
          </li>
        </ul>
        <!-- 右键菜单 -->
        <ul v-if="contextMenu.visible" :style="{ top: contextMenu.top + 'px', left: contextMenu.left + 'px' }"
          class="absolute z-50 bg-white shadow-xl rounded-md list-none w-[100px]">
          <li v-for="item in contextMenuList" :key="item.action" @click="handleContextMenuAction(item.action)"
            class="p-2 text-[14px] text-center cursor-pointer hover:bg-gray-100">
            {{ item.label }}
          </li>
        </ul>
      </el-main>
    </el-container>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, computed, onUnmounted } from 'vue';
import { useFileStore } from "@/stores/files";
import { ElMessage } from 'element-plus';
import { upload, download } from '@/services/upload.js';
import { allMenu, recycleMenu } from './contextMenu.js';
const fileStore = useFileStore();
const selectedFiles = ref([])
const defaultActive = ref('1')
const selectAll = ref(false)
const viewMode = ref('list')
const contextMenu = reactive({
  visible: false,
  top: 0,
  left: 0,
  file: null
});
const contextMenuList = ref(allMenu)
const directory = [{ label: '所有文件', icon: 'Folder' },
{ label: '报销附件', icon: 'Document' },
{ label: '共享文件夹', icon: 'Share' },
{ label: '回收站', icon: 'DeleteFilled' }]
const renameFile = reactive({
  fileId: '',
  fileName: ''
})
const handleRenameBlur = (file) => {
  fileStore.renameFileAction({ fileId: file.fileId, fileName: renameFile.fileName }, directory[defaultActive.value - 1].label)
  renameFile.fileId = ''
  renameFile.fileName = ''
}
const handleSelect = (index) => {
  defaultActive.value = index
  if (directory[index - 1].label === '回收站') {
    contextMenuList.value = recycleMenu
  } else {
    contextMenuList.value = allMenu
  }
  fileStore.fetchFileList({ type: directory[index - 1].label })
}
const handleViewModeChange = (e) => {
  viewMode.value = e
}
const handleSuccess = (response, file, fileList) => {
  if (response.code === 200) {
    getList()
    return ElMessage.success('文件上传成功！')
  }
  ElMessage.error(file.name + response.list)
}
const handleError = (error, file, fileList) => {
  console.log(error, file, fileList)
  ElMessage.error(file.name + error.list)
}

const updateSelectedFiles = (e, file) => {
  const selected = []
  fileStore.$patch({
    fileList: fileStore.fileList.map(item => {
      if (item.fileId === file.fileId) {
        item.selected = e
      }
      if (item.selected) selected.push(item.fileId)
      return item
    }),
  });
  selectedFiles.value = selected
  selectAll.value = selected.length === fileStore.fileList.length
}
const handleSelectAll = (e) => {
  const selected = []
  fileStore.$patch({
    fileList: fileStore.fileList.map(item => {
      if (e) selected.push(item.fileId);
      return {
        ...item,
        selected: e
      }
    }),
  });
  selectedFiles.value = selected
  selectAll.value = e
}
const handleDelete = () => {
  fileStore.removeFile(selectedFiles.value.join(','), () => {
    selectedFiles.value = []
    selectAll.value = false
  })
}
const refreshFiles = () => {
  getList()
  selectedFiles.value = []
  selectAll.value = false
}

const headers = computed(() => {
  return localStorage.getItem('token') || '';
});


const handleContextMenu = (e, file) => {
  e.preventDefault();
  contextMenu.visible = true;
  contextMenu.top = e.clientY;
  contextMenu.left = e.clientX;
  contextMenu.file = file;
}

const handleContextMenuAction = (action) => {
  const type = directory[defaultActive.value - 1].label
  switch (action) {
    case 'move':
      console.log('Move file:', contextMenu.file);
      break;
    case 'delete':
      fileStore.removeFile(contextMenu.file.fileId, type)
      break;
    case 'rename':
      renameFile.fileId = contextMenu.file.fileId
      renameFile.fileName = contextMenu.file.fileName
      break;
    case 'recycle':
      fileStore.moveFileToRecycleBin(contextMenu.file.fileId, type)
      break;
    case 'share':
      console.log('Rename file:', contextMenu.file);
      break;
    case 'download':
      
      window.open(`${download}?fileId=${contextMenu.file.fileId}`,'_self')
      // fileStore.downloadFileAction(contextMenu.file)
      break;
    case 'restore':
      fileStore.restoreFile(contextMenu.file.fileId, type)
      break;
  }
  contextMenu.visible = false;
};
const closeContextMenu = () => {
  if (contextMenu.visible) {
    contextMenu.visible = false;
  }
};
const handleDoubleClick = (e, file) => {
  if (directory[defaultActive.value - 1].label === '回收站') return;
  e.preventDefault()
  console.log(file)
}
const getList = () => {
  fileStore.fetchFileList({ type: directory[defaultActive.value - 1].label })
}
onMounted(() => {
  getList()
  document.addEventListener('click', closeContextMenu);
})
onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu);
});
</script>
<style scoped>
.file-list-container {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

/* Webkit browsers (Chrome, Safari) */
.file-list-container::-webkit-scrollbar {
  width: 8px;
}

.file-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.file-list-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.file-list-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox */
.file-list-container {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>