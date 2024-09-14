import { defineStore } from "pinia";
import * as filesServices from "@/services/files";

export const useFileStore = defineStore("file", {
  state: () => ({
    fileList: [],
  }),

  getters: {},

  actions: {
    // 获取文件列表
    async fetchFileList(params = {}) {
      try {
        const result = await filesServices.getFileList(params);
        if (result.code === 200) {
          this.fileList =
            result.list.file &&
            result.list.file.map((item) => {
              item.selected = false;
              return item;
            });
        } else {
          ElMessage.error(result.message || "获取文件列表失败");
        }
      } catch (error) {
        console.error(result.list, error);
      }
    },

    // 删除文件
    async removeFile(params, callback, type) {
      try {
        const result = await filesServices.deleteFile(params);
        if (result.code === 200) {
          ElMessage.success("删除文件成功");
          this.fetchFileList({ type });
          callback && callback();
        } else {
          ElMessage.error(result.message || "删除文件失败");
        }
      } catch (error) {
        console.error("删除文件失败", error);
        ElMessage.error("删除文件失败");
      }
    },

    // 移动文件到回收站
    async moveFileToRecycleBin(params, type) {
      try {
        const result = await filesServices.moveToRecycleBin(params);
        if (result.code === 200) {
          ElMessage.success("文件已移至回收站");
          await this.fetchFileList({ type });
        } else {
          ElMessage.error(result.message || "移动文件到回收站失败");
        }
      } catch (error) {
        console.error("移动文件到回收站失败", error);
        ElMessage.error("移动文件到回收站失败");
      }
    },

    // 移动文件
    async moveFileToLocation(params) {
      try {
        const result = await filesServices.moveFile(params);
        if (result.code === 200) {
          ElMessage.success("移动文件成功");
          await this.fetchFileList();
        } else {
          ElMessage.error(result.message || "移动文件失败");
        }
      } catch (error) {
        console.error("移动文件失败", error);
        ElMessage.error("移动文件失败");
      }
    },

    // 重命名文件
    async renameFileAction(params, type) {
      try {
        const result = await filesServices.renameFile(params);
        if (result.code === 200) {
          ElMessage.success("重命名文件成功");
          await this.fetchFileList({ type });
        } else {
          ElMessage.error(result.message || "重命名文件失败");
        }
      } catch (error) {
        console.error("重命名文件失败", error);
        ElMessage.error("重命名文件失败");
      }
    },

    // 上传文件
    async uploadFileAction(params) {
      try {
        const result = await filesServices.uploadFile(params);
        if (result.code === 200) {
          ElMessage.success("上传文件成功");
          await this.fetchFileList();
        } else {
          ElMessage.error(result.message || "上传文件失败");
        }
      } catch (error) {
        console.error("上传文件失败", error);
        ElMessage.error("上传文件失败");
      }
    },

   

    // 回收站文件还原
    async restoreFile(params, type) {
      try {
        const result = await filesServices.reDropFile(params);
        if (result.code === 200) {
          ElMessage.success("回收站文件还原成功");
          await this.fetchFileList({ type });
        } else {
          ElMessage.error(result.message || "回收站文件还原失败");
        }
      } catch (error) {
        console.error("回收站文件还原失败", error);
        ElMessage.error("回收站文件还原失败");
      }
    },

    // 下载文件
    async downloadFileAction(file) {
      try {
        const result = await filesServices.downloadFile(file.fileId);
        // 创建一个blob对象
        if (result instanceof Blob) {
          // 如果已经是 Blob 对象，直接使用
          const url = window.URL.createObjectURL(result);
          triggerDownload(url, file.fileName);
        } else if (typeof result === 'object' && result.data) {
          // 如果是包含数据的对象，创建新的 Blob
          const blob = new Blob([result.data], { type: result.type || 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          triggerDownload(url, file.fileName);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error("文件下载失败", error);
      }
    },


    // 分享文件
    async shareFileAction(params) {
      try {
        const result = await filesServices.shareFile(params);
        if (result.code === 200) {
          ElMessage.success("分享文件成功");
          return result.list; // 返回分享链接或其他相关信息
        } else {
          ElMessage.error(result.message || "分享文件失败");
        }
      } catch (error) {
        console.error("分享文件失败", error);
        ElMessage.error("分享文件失败");
      }
    },
  },
});


const triggerDownload = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
