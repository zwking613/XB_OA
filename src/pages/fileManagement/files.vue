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
        <div class="flex items-center justify-between w-full mb-4  border-indigo-[#e3e3e3] border-solid h-8">
          <div>
            <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
            <el-button type="danger" class="ml-4" :disabled="!selectedFiles.length" @click="handleDelete">删除</el-button>
            <el-button type="primary" class="ml-4" @click="refreshFiles">刷新</el-button>
            <el-button type="primary" class="ml-4" @click="newFolder">{{isNewFolder ? '取消新建' : '新建文件夹'}}</el-button>
            <el-button v-if="nowPath.length > 0" type="primary" icon="el-icon-back" @click="handleGoBack" class="ml-4">
              返回上一级
            </el-button>
          </div>
          <div>
            <el-radio-group v-model="viewMode" class="ml-4 float-end" @change="handleViewModeChange">
              <el-radio value="list">列表视图</el-radio>
              <el-radio value="grid">网格视图</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 文件列表 -->
        <div class="file-list-container">
          <el-empty description="暂无文件" v-if="fileStore.fileList.length === 0" />
          <!-- 返回按钮 -->

          <ul v-else :class="[viewMode === 'grid' ? 'flex flex-wrap' : '' ]">
            <li v-if="isNewFolder" :class="[
              viewMode === 'grid' ? 'w-[120px] h-16 inline-block' : 'w-[100%] flex',
              'p-2  hover:bg-gray-100 break-words cursor-pointer'
            ]" oncontextmenu="return false;">
              <el-input
                ref="newFolderInput"
                v-model="newFolderName"
                class="w-auto"
                @blur="handleNewFolderBlur"
                v-focus
              ></el-input>
              <!-- <el-input autofocus class="w-auto" v-model="newFolderName" @blur="handleNewFolderBlur"></el-input> -->
            </li>
            <!-- 文件项 -->
            <li :checked="file.selected" @click="(e) => updateSelectedFiles(e, file,'li')"
              @contextmenu.prevent="handleContextMenu($event, file)" v-for="file in fileStore.fileList" :key="file.id"
              :class="[
                viewMode === 'grid' ? 'w-[120px] h-16 inline-block' : 'w-[100%] flex',
                'p-2  hover:bg-gray-100 break-words cursor-pointer'
              ]" oncontextmenu="return false;">
              <div class="flex items-center">
                <div :class="[
                  viewMode === 'list' ? 'w-8 h-8' : 'w-3 h-3'
                ]">
                  <el-icon size="20" v-if="file.selected" color="#00FF40">
                    <SuccessFilled />
                  </el-icon>
                </div>
                <img :src="getFileIcon(file.type)" alt="file icon" class="w-8 h-8 ml-3 ">
              </div>
              <!-- 文件重命名输入框 -->
              <div v-if="renameFile.fileId === file.fileId" class="w-auto">
                <el-input :key="renameFile.fileId" :autofocus="true" class="w-auto" v-model="renameFile.fileName"
                  @blur="handleRenameBlur(file)"></el-input>
              </div>
              <!-- 文件名显示 -->
              <div v-else :class="[
  viewMode === 'grid' ? 'mt-2 w-full truncate text-[14px]' : 'ml-2 w-[200px] truncate text-[14px] flex items-center','text-center'
              ]">{{ file.fileName }}</div>
              <!-- 列表视图下显示上传时间 -->
              <div v-if="viewMode === 'list'" class="flex items-center ml-5 w-full truncate text-[14px]">
                {{ file.uploadTime }}
              </div>
            </li>

          </ul>
        </div>

        <!-- 右键菜单 -->
        <ul v-if="contextMenu.visible" :style="{ top: contextMenu.top + 'px', left: contextMenu.left + 'px' }"
          class="absolute z-50 bg-white shadow-xl rounded-md list-none w-[100px]">
          <li v-for="item in contextMenuList" :key="item.action" @click="handleContextMenuAction(item.action)"
            class="p-2 text-[12px] text-center cursor-pointer hover:bg-gray-100">

            <el-dropdown v-if="item.action === 'move'" @command="handleMoveFile" trigger="hover" placement="right">
              <span
                class="el-dropdown-link p-2 text-[12px] text-center cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                {{ item.label }}
                <el-icon class="el-icon--right">
                  <arrow-right />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(folder, index) in moveFileList()" :key="folder.fileId +'' + index"
                    :command="folder.fileId">
                    {{ folder.fileName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span v-else>{{ item.label }}</span>
          </li>
        </ul>
      </el-main>
    </el-container>
    <!-- 文件预览 Modal -->
    <el-dialog v-model="previewDialogVisible" title="文件预览" destroy-on-close :before-close="handleClosePreview">
      <Preview :id="previewId" :url="previewUrl" :type="previewFileType" :callback="handleClosePreview" />
    </el-dialog>
    <el-dialog v-model="userDialogVisible" title="分享文件" width="400px" destroy-on-close :before-close="userHandleClose">
      <el-form :model="formUser" :rules="userRules" ref="formUserRef">
        <el-form-item label="分享人" prop="sharePerson">
          <el-select v-model="formUser.sharePerson" placeholder="请选择分享人">
            <el-option v-for="user in fileStore.userList" :key="user.id" :label="user.userName" :value="user.id" />
          </el-select>
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
<script setup>
import { ref, onMounted, reactive, computed, onUnmounted } from 'vue';
import { useFileStore } from "@/stores/files";
import { useAppStore } from "@/stores/app";
import { ElMessage } from 'element-plus';
import { upload, download, preview } from '@/services/upload.js';
import { allMenu, recycleMenu, getFileIcon, noSelectMenu } from './contextMenu.js';
import Preview from '@/components/preview/index.vue';

// 使用文件存储
const fileStore = useFileStore();

// 使用用户存储
const userApp = useAppStore();
// 选中的文件列表
const selectedFiles = ref([])

// 默认激活的菜单项
const defaultActive = ref('1')

// 是否全选
const selectAll = ref(false)

// 视图模式（列表/网格）
const viewMode = ref(localStorage.getItem('viewMode') || 'list')

const userRules = {
  sharePerson: [
    { required: true, message: '请选择用户', trigger: 'change' },
  ],
};
const userDialogVisible = ref(false);
const formUserRef = ref(null);
const formUser = ref({
  sharePerson: '',
});
// 右键菜单状态
const contextMenu = reactive({
  visible: false,
  top: 0,
  left: 0,
  file: null
});

// 右键菜单列表
const contextMenuList = ref(allMenu)

// 目录列表
const directory = [
  { label: '所有文件', icon: 'Folder' },
  { label: '报销附件', icon: 'Document' },
  { label: '共享文件夹', icon: 'Share' },
  { label: '回收站', icon: 'DeleteFilled' }
]

// 重命名文件状态
const renameFile = reactive({
  fileId: '',
  fileName: '',
  oldName: ''
})

// 文件预览对话框状态
const previewDialogVisible = ref(false)
const previewUrl = ref('')
const previewFileType = ref('')
const previewId = ref(0)

// 处理新建文件夹
const isNewFolder = ref(false)
const newFolderName = ref('')

// 当前路径
const nowPath = reactive([])

// 返回上一级
const handleGoBack = () => {
  fileStore.fetchFileList({ type: directory[defaultActive.value - 1].label, nowPath: nowPath[nowPath.length - 2] || ''})
  nowPath.pop()
}

// 移动文件
const handleMoveFile = (fileId) => {
  if(fileId === contextMenu.file.fileId){
    ElMessage.error('不能移动到自己')
    return
  }
  fileStore.moveFileToLocation({
    fileId: contextMenu.file.fileId,
    newFatherId: fileId
  }, directory[defaultActive.value - 1].label)
}
// 处理重命名失去焦点事件
const handleRenameBlur = (file) => {
  if(renameFile.oldName !== renameFile.fileName){
    fileStore.renameFileAction({ fileId: file.fileId, newName: renameFile.fileName }, directory[defaultActive.value - 1].label)
  }
  renameFile.fileId = ''
  renameFile.fileName = ''
  renameFile.oldName = ''
}



const newFolder = () => {
  isNewFolder.value = !isNewFolder.value
}

// 处理新建文件夹失去焦点事件
const handleNewFolderBlur = () => {
  if(!newFolderName.value){
    ElMessage.error('请输入文件夹名称')
  }else{
    fileStore.createFolderAction({name:newFolderName.value},directory[defaultActive.value - 1].label)
  }
  isNewFolder.value = false
  newFolderName.value = ''
}

// 处理菜单选择事件
const handleSelect = (index) => {
  defaultActive.value = index
  // 初始化当前路径
  nowPath.length = 0;
  fileStore.fetchFileList({ type: directory[index - 1].label },)
}

// 处理视图模式变更
const handleViewModeChange = (e) => {
  viewMode.value = e
  localStorage.setItem('viewMode', e)
}

// 处理文件上传成功
const handleSuccess = (response, file, fileList) => {
  if (response.code === 200) {
    getList()
    return ElMessage.success('文件上传成功！')
  }
  ElMessage.error(file.name + response.list)
}

// 处理文件上传错误
const handleError = (error, file, fileList) => {
  console.log(error, file, fileList)
  ElMessage.error(file.name + error.list)
}

// 更新选中的文件
const updateSelectedFiles = (e, file,type) => {
  if(renameFile.fileId) return;
  let isChecked
  const selected = []
  if(type === 'li'){
    isChecked = !(e.target.closest('li').getAttribute('checked') === 'true')
  }else{
    isChecked = e
  }
  fileStore.$patch({
    fileList: fileStore.fileList.map(item => {
      if (item.fileId === file.fileId) {
        item.selected = isChecked
      }
      if (item.selected) selected.push(item.fileId)
      return item
    }),
  });
  selectedFiles.value = selected
  selectAll.value = selected.length === fileStore.fileList.length
}

// 处理全选
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

// 处理删除文件
const handleDelete = () => {
  fileStore.removeFile(selectedFiles.value.join(','), () => {
    selectedFiles.value = []
    selectAll.value = false
  })
}

// 刷新文件列表
const refreshFiles = () => {
  getList()
  selectedFiles.value = []
  selectAll.value = false
}

// 计算请求头
const headers = computed(() => {
  return localStorage.getItem('token') || '';
});

const moveFileList = () => {
  return fileStore.fileFolder
}

// 处理右键菜单
const handleContextMenu = (e, file) => {
  e.preventDefault();
  if (directory[defaultActive.value - 1].label === '回收站') {
    contextMenuList.value = recycleMenu
  } else {
    contextMenuList.value = allMenu
  }
  contextMenu.visible = true;
  contextMenu.top = e.clientY;
  contextMenu.left = e.clientX;
  contextMenu.file = file;
}

// 处理右键菜单操作
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
      renameFile.oldName = contextMenu.file.fileName
      break;
    case 'recycle':
      fileStore.moveFileToRecycleBin(contextMenu.file.fileId, type)
      break;
    case 'share':
      if (userApp.userInfo.manager){
        fileStore.shareFileAction({
          fileId: contextMenu.file.fileId,
        })
      }else{
        fileStore.fetchUserList(() => {
          userDialogVisible.value = true;
        });
      }
      break;
    case 'download':
      window.open(`${download}?fileId=${contextMenu.file.fileId}`,'_self')
      break;
    case 'restore':
      fileStore.restoreFile(contextMenu.file.fileId, type)
      break;
    case 'view':
      if (contextMenu.file.type ==='folder'){
        nowPath.push(contextMenu.file.fileId)
        fileStore.fetchFileList({ type: directory[defaultActive.value - 1].label, nowPath: contextMenu.file.fileId})
          return
        }
      previewUrl.value = `${preview}?fileId=${contextMenu.file.fileId}`
      previewFileType.value = contextMenu.file.type
      previewId.value = contextMenu.file.fileId
      previewDialogVisible.value = true
      break;
    case 'refresh':
      refreshFiles()
      break;
    case 'newFolder':
      isNewFolder.value = true
      break;
  }
  contextMenu.visible = false;
};
const userHandleClose = () => {
  userDialogVisible.value = false;
  formUser.value = {
    sharePerson: '',
  };
}
const submitUserForm = () => {
  formUserRef.value.validate((valid) => {
    if (valid) {
      fileStore.shareFileAction({
        sharePerson: formUser.value.sharePerson,
        fileId: contextMenu.file.fileId,
      }, userHandleClose)
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}

// 关闭文件预览对话框
const handleClosePreview = () => {
  previewDialogVisible.value = false
  previewUrl.value = ''
  previewFileType.value = ''
  previewId.value = 0
}

// 关闭右键菜单
const closeContextMenu = () => {
  if (contextMenu.visible) {
    contextMenu.visible = false;
  }
};

// 获取文件列表
const getList = () => {
  fileStore.fetchFileList({ type: directory[defaultActive.value - 1].label })
}

// 组件挂载时
onMounted(() => {
  getList()
  document.addEventListener('click', closeContextMenu);
})

// 组件卸载时
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