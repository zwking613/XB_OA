import folder from '@/assets/file_icons/folder.png'
import txt from '@/assets/file_icons/txt.png'
import png from '@/assets/file_icons/png.png'
import jpeg from '@/assets/file_icons/jpeg.png'
import jpg from '@/assets/file_icons/jpeg.png'
import ppt from '@/assets/file_icons/ppt.png'
import pdf from '@/assets/file_icons/pdf.png'
import xls from '@/assets/file_icons/xls.png'
import word from '@/assets/file_icons/word.png'
import excel from '@/assets/file_icons/excel.png'
import defaultIcon from '@/assets/file_icons/default.png'

export const allMenu = [
    // {
    //     label: '查看',
    //     action: 'view',
    // },
    {
        label: '移动',
        action: 'move',
    },
    {
        label: '删除',
        action: 'recycle',
    },
    {
        label: '重命名',
        action: 'rename'
    },
    // {
    //     label: '回收站',
    //     action: 'recycle'
    // },

    {
        label: '分享',
        action: 'share'
    },
    {
        label: '下载',
        action: 'download'
    }]

export const recycleMenu = [{
    label: '还原',
    action: 'restore'
}, {
    label: '删除',
    action: 'delete',
},]
export const noSelectMenu = [{
    label: '新建文件夹',
    action: 'newFolder'
}, {
    label: '刷新',
    action: 'refresh',
},]

export const fileTypeIcons = {
    'txt': txt,
    'word': word,
    'doc': word,
    'docx': word,
    'pdf': pdf,
    'xls': xls,
    'ppt': ppt,
    'pptx': ppt,
    'pdf': pdf,
    'xlsx': excel,
    'jpeg': jpeg,
    'jpg': jpg,
    'png': png,
    'folder': folder,
    'default': defaultIcon
}

export const getFileIcon = (fileType) => {
    return fileTypeIcons[fileType] || fileTypeIcons['default']
}
