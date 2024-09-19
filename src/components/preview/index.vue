<template>
    <div class="file-preview">
        <!-- 预览docx -->
        <vue-office-docx v-if="fileType === 'docx' " :src="fileUrl" :style="comStyle" />
        <!-- 预览excel -->
        <vue-office-excel v-else-if="fileType === 'xlsx'" :src="fileUrl" :style="comStyle" />
        <!-- 预览txt -->
        <div v-else-if="fileType === 'txt'" class="txt-content">
            <pre>{{ previewData.content }}</pre>
        </div>
        <!-- 预览pdf-->
        <PdfPreview v-else-if="fileType === 'pdf'" page-scale="page-fit" :width="1000" theme="light"
            :src="previewData.src" />
        <!-- 预览图片 -->
        <img v-else-if="fileType === 'png' || fileType === 'jpg'" :src="previewData.src" />
        <!-- 预览doc -->
        <!-- <doc-viewer v-else-if="fileType === 'doc'" :src="fileUrl" /> -->
        <!-- 预览xls -->
        <div v-else class="unsupported-preview">
            <p>预览不支持该文件类型，请下载后查看。</p>
            <el-button @click="downloadFile">下载文件</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import { getPreviewFile } from '@/services/files'
import PdfPreview from './PdfPreview.vue'
// import { DocViewer } from 'vue-doc-viewer'
// import 'vue-doc-viewer/dist/vue-doc-viewer.css'
const { url, type, callback ,id} = defineProps({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    callback: {
        type: Function,
        required: false
    },
    id: {
        type: Number,
        required: true
    }
});
const fileType = ref(type);
const fileUrl = ref(url);
const comStyle = ref({
    width: '100%',
    height: '100%'
})
const previewData = ref({
    pdfPages: 0,
    src: ''
})
const downloadFile = () => {
    callback && callback()
    window.open(fileUrl.value, '_self')
};
// 处理txt文件
const handleTxtFilePreview = (blob) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = (evt) => {
        let ints = new Uint8Array(evt.target.result); //要使用读取的内容，所以将读取内容转化成Uint8Array
        ints = ints.slice(0, blob.size); //截取一段读取的内容
        let text = new TextDecoder('utf-8').decode(ints); //二进制缓存区内容转化成中文（即也就是读取到的内容）
        console.log(text,123123)
        previewData.value.content = text;
    };
}

const handlePdfFilePreview = (blob) => {
    console.log(blob)
    previewData.value.src = URL.createObjectURL(blob);
}   
const handleImageFilePreview = (blob) => {
    previewData.value.src = URL.createObjectURL(blob);
}

onMounted(() => {
    if (fileType.value === 'xlsx' || fileType.value ==='docx')return;
    getPreviewFile(id).then(res => {
        let blob = new Blob([res]);
        //通过switch，调用不同类型文件的处理函数
        switch (fileType.value) {
            case 'txt':
                handleTxtFilePreview(blob);
                break;
            case 'png':
                handleImageFilePreview(blob);
                break;
            case 'jpg':
                handleImageFilePreview(blob);
                break;
            case 'xlsx':
                handleExcelFilePreview(blob);
                break;
            case 'docx':
                handleWrodFilePreview(blob);
                break;
            case 'pdf':
                handlePdfFilePreview(blob);
                break;
            // case 'doc':
            //     handleTxtFilePreview(blob);
            //     break;
            // case 'xls':
            //     handleExcelFilePreview(blob);
            //     break;
        }
    })
})
</script>

<style scoped>
.file-preview {
    width: 100%;
    display: flex;
    height: calc(100vh - 400px);
    overflow-y: auto;
    justify-content: center;
    align-items: center;
}

/* Webkit browsers (Chrome, Safari) */
.file-preview::-webkit-scrollbar {
    width: 8px;
}

.file-preview::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.file-preview::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.file-preview::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Firefox */
.file-preview {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}
.txt-content{
    display: flex;
    width: 100%;
    height: 100%;
}
.unsupported-preview {
    text-align: center;
    padding: 20px;
}

.unsupported-preview p {
    margin-bottom: 15px;
    color: #666;
}
</style>