<template>
    <div class="grid-container">
        <el-table :data="list.list" :border="border" :stripe="stripe" :height="height" :max-height="maxHeight"
            :row-key="rowKey" @selection-change="handleSelectionChange" v-loading="props.loading"
            header-cell-class-name="table-header" :cell-class-name="cellClassName">
            <el-table-column v-if="showSelection" :selectable="selectable" type="selection" width="55" />
            <el-table-column v-if="showIndex" type="index" width="50" label="#" />
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label"
                :width="column.width" :fixed="column.fixed" :sortable="column.sortable">
                <template #default="scope">
                    <slot :name="column.prop" :row="scope.row">
                        <template v-if="column.customRender">
                            <component :is="column.customRender" :row="scope.row" :column="column" />
                        </template>
                        <template v-else>
                            {{ scope.row[column.prop] }}
                        </template>
                    </slot>
                </template>
            </el-table-column>
            <el-table-column v-if="showOperations" label="操作" :width="operation.length * 80" :fixed="operationFixed">
                <template #default="scope">
                    <div class="flex items-center justify-between w-full">
                        <div v-for="(item, index) in operation" :key="index + item.label">
                            <template v-if="item.name">
                                <el-popconfirm confirm-button-text=" 确定" cancel-button-text="取消" :title="item.name"
                                    @confirm="item.onClick(scope.row)">
                                    <template #reference>
                                        <el-button size="small" :type="item.type" :icon="item.icon">
                                            {{ item.label }}
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                            <el-button v-else size="small" :type="item.type" :icon="item.icon"
                                @click="item.onClick(scope.row)">
                                {{ item.label }}
                            </el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="showPagination" class="flex justify-end w-full mt-4 ">
            <el-pagination :default-page-size="pageSize" layout="prev, pager, next" background :total="list.totalCount"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
    list: {
        type: Object,
        required: true,
        default: () => ({ list: [], totalCount: 0, pageNo: 1, pageSize: 1 }),
    },
    columns: {
        type: Array,
        required: true,
    },
    fetchData: {
        type: Function,
        required: false,
    },
    border: {
        type: Boolean,
        default: true,
    },
    stripe: {
        type: Boolean,
        default: true,
    },
    height: {
        type: [String, Number],
        default: null,
    },
    maxHeight: {
        type: [String, Number],
        default: null,
    },
    rowKey: {
        type: String,
        default: "id",
    },
    showSelection: {
        type: Boolean,
        default: false,
    },
    showIndex: {
        type: Boolean,
        default: false,
    },
    showOperations: {
        type: Boolean,
        default: true,
    },
    operationFixed: {
        type: String,
        default: "right",
    },
    showPagination: {
        type: Boolean,
        default: true,
    },
    actions: {
        type: Array,
        default: [],
    },
    edit: {
        type: Function,
        default: null,
    },
    delete: {
        type: Function,
        default: null,
    },
    loading:{
        type: Boolean,
        default:()=>false,
    },
    selectable: {
        type: Function,
        default: () => true,
    },
});

const emit = defineEmits(["selection-change", "size-change", "current-change"]);

const currentPage = ref(1);
const pageSize = ref(1);
const operation = ref([]);

const loadData = async () => {
    props.fetchData({ pageNo: currentPage.value, pageSize: pageSize.value });
};

const handleSelectionChange = (selection) => {
    emit("selection-change", selection);
};


const handleCurrentChange = (val) => {
    currentPage.value = val;
    loadData();
};

const cellClassName = () => {
    return "table-cell";
};


onMounted(() => {
    operation.value = []
    if(props.edit){
        operation.value.push({
            label: '编辑',
            icon: 'edit',
            onClick: props.edit
        })
    }
    if(props.delete){
        operation.value.push({
            label: '删除',
            type: 'danger',
            name: '确定删除吗?',
            icon: 'DeleteFilled',
            onClick: props.delete
        })
    }
    operation.value = [...operation.value, ...props.actions]
});
</script>

<style scoped>
.grid-container {
    width: 100%;
}

:deep(.table-header) {
    background-color: #f5f7fa !important;
    color: #606266;
    font-weight: bold;
    text-align: center;
}

:deep(.table-cell) {
    text-align: center;
}
</style>
