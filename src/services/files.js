import { post } from "@/utils/request";


/**
 * 上传文件
 * @author xz
 * @date 2024-09-13
 * @param {File} params.file 文件
 * @returns {Promise}
 */
export const uploadFile = (params) => post("/file/save", params);

/**
 * 获取文件列表
 * @param {Object} params
 * @param {string} params.type 文件类型
 * @returns {Promise}
 */
export const getFileList = (params) => post("/file/list", params);


/**
 * 彻底删除文件
 * @param {string} params // 文件id 多个用,隔开
 * @returns {Promise}
 */
export const deleteFile = (params) => post("/file/delete", {fileId:params});

/**
 * 移动文件到回收站
 * @param {Object} params
 * @returns {Promise}
 */
export const moveToRecycleBin = (params) => post("/file/drop", { fileId: params });



/**
 * 移动文件
 * @param {Object} params
 * @returns {Promise}
 */
export const moveFile = (params) => post("/file/move", params);

/**
 * 重命名文件
 * @param {Object} params
 * @returns {Promise}
 */
export const renameFile = (params) => post("/file/rename", params);

/**
 * 下载文件
 * @param {string} fileId 文件ID
 * @returns {Promise}
 */
export const downloadFile = (fileId) => post("/file/download", {fileId});



/**
 * 分享文件
 * @param {Object} params
 * @returns {Promise}
 */
export const shareFile = (params) => post("/file/share", params);

/**
 * 回收站文件还原
 * @param {Object} params
 * @returns {Promise}
 */
export const reDropFile = (params) => post("/file/reDrop", {fileIds:params});

