<template>
  <div>
    <!-- 表格Header -->
    <div class="card-header">
      <template v-if="tableHeaderBtn.length !== 0">
        <el-button v-for="(item, index) in tableHeaderBtn" v-bind="{ ...item }"
          :style="{ color: '#FFF', background: item.color }" @click="item.handler" :key="index + item.title"
          :icon="item.icon">{{ item.title }}</el-button>
      </template>
      <div class="query" v-if="tableData.filterItem && tableData.filterItem.length !== 0">
        <FormModule ref="queryRefForm" :fromConfig="filterItem" @submit="query"></FormModule>
      </div>
    </div>

    <!-- 表格 -->
    <el-table border :row-key="tableData.rowKey ? tableData.rowKey : 'id'" empty-text="暂无数据" :data="data.list"
      :style="tableData.tableStyle" :row-class-name="tableRowClassName" :height="tableData.fixedHeaderHeight"
      :table-layout="tableData.tableLayout" @selection-change="selectChange">
      <!-- 多选框 -->
      <el-table-column v-if="tableData.selection" type="selection" width="55" :align="tableData.align" />

      <el-table-column type="expand" v-if="tableData.columnExpand">
        <slot name="expand"></slot>
      </el-table-column>
      <!-- 数据 -->
      <el-table-column v-for="item in column" v-bind="{ ...item }" :prop="item.props" :label="item.label" :key="item.id + item.props"
        :align="tableData.align" :filters="item.columnFilters" :sortable="item.sortable" :filter-method="
            item.columnFilters && item.columnFilters.length !== 0
              ? filterHandler
              : null
          " :fixed="item.fixedColumn">
        <template #default="scope">
          <slot :name="item.props" :row="scope.row">
            <template v-if="item.customRender">
              <component :is="item.customRender" :row="scope.row" :column="item" />
            </template>
            <template v-else>
              {{ scope.row[item.props] }}
            </template>
          </slot>
          <el-table-column v-bind="{ ...i }" v-if="item.children && item.children.length !== 0" v-for="i in item.children" :prop="i.props"
            :label="i.label" :key="i.id + i.props" :align="tableData.align" :filters="i.columnFilters" :filter-method="item.columnFilters && item.columnFilters.length !== 0
              ? filterHandler
              : null
              ">
            <template #default="scope" v-if="i.columnType === 'slot'">
              <slot :columnData="scope.row" :name="i.slotName"></slot>
            </template>
          </el-table-column>
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column label="操作" :align="tableData.align" :fixed="tableData.operationFixed ? 'right' : null"
        :width="tableOperation.length * 50 + 10" v-if="tableOperation.length !== 0">
        <!-- 渲染按钮 -->
        <template #default="scope">
          <template v-for="(item, index) in tableOperation">
            <el-popconfirm v-if="item.confirmTitle" :title="item.confirmTitle" :key="index + item.title"
              @confirm="item.handler(scope.row)" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <span>
                  <el-tooltip class="box-item" effect="dark" :content="item.title" placement="bottom">
                    <el-button v-bind="{ ...item }" :style="{ color: '#FFF', background: item.color || '#409EFF' }" :icon="item.icon"
                      color="#FFFF" circle />
                  </el-tooltip>
                </span>
              </template>
            </el-popconfirm>
            <el-tooltip v-else class="box-item" effect="dark" :content="item.title" placement="bottom"
              :key="item.title">
              <el-button v-bind="{ ...item }" :style="{ color: '#FFF', background: item.color }" :icon="item.icon" color="#FFFF"
                @click="item.handler(scope.row)" circle />
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-if="tableData.isPaging" :currentPage="data.pageNo" background :page-size="data.pageSize"
      layout="total, prev, pager, next  " :total="data.totalCount || 0" @current-change="handleCurrentChange" />
    <!-- 编辑dialog -->
    <DialogModule :dialogConfig="editDialogConfig" @onCancel="editCancel" @onConfirm="editSubmit" ref="dialogModule">
      <FormModule ref="editRefForm" :fromConfig="editFormConfig"></FormModule>
    </DialogModule>
    <DialogModule  :dialogConfig="insertDialogConfig" @onCancel="insertCancel" @onConfirm="insertSubmit"
      ref="dialogModule">
      <FormModule ref="insertRefForm" :fromConfig="insertFormConfig"></FormModule>
    </DialogModule>
  </div>
</template>
<script>
export default {
  name: "tableModule",
  props: {
    tableConfig: {
      type: Object,
      default: () => {},
    },
    column: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => ({ list: [], totalCount: 0, pageNo: 1, pageSize: 10 }),
    },
    insertConfig: {
      type: Object,
      default: () => {},
    },
    editConfig: {
      type: Object,
      default: () => {},
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
  /**
   *  context:上下文对象,{attrs,slots,emit}
   *  attrs:获取当前组件标签上所有没有通过props接收的属性的对象,相当于this.$attrs
   *  slots:包含所有传入的插槽内容的对象,相当于this.$slots
   *  emit:用来分发自定义事件的函数,相当于this.$emit
   */
  setup(props, { attrs, slots, emit }) {
    const editRefForm = ref();
    const insertRefForm = ref();
    const tableData = reactive({
      align: "center",
      selection: false,
      columnExpand: false,
      tableLayout: "auto",
      fixedHeaderHeight: "auto",
      // operation: [],
      headerBtn: [],
      operationFixed: false,
      isPaging: true,
      tableStyle: {
        width: "100%",
        height: "auto",
      },
      filterItem: [],
    });
    const insertFormConfig = reactive({
      form: {},
      fields: [],
      rules: {},
      inline: false,
      okTitle: "确认",
      cancelTitle: "取消",
      size: "default",
      labelPosition: "right",
      isFormBtn: true,
      layout: 1,
      labelWidth: "auto",
      formItemLabelWidth: "120px",
      isReset: false,
      isFormBtn: false,
    });
    const editFormConfig = reactive({
      form: {},
      fields: [],
      rules: {},
      inline: false,
      okTitle: "确认",
      cancelTitle: "取消",
      size: "default",
      labelPosition: "right",
      isFormBtn: true,
      layout: 1,
      labelWidth: "auto",
      formItemLabelWidth: "120px",
      isReset: false,
      isFormBtn: false,
    });
    const filterItem = reactive({
      fields: [],
      isCancel: false,
      inline: true,
      okTitle: "查询",
      labelPosition: "right",
      formItemLabelWidth: "auto",
      isSpan: true,
    });
    const tableOperation = ref([]);

    const tableHeaderBtn = ref([]);
    const queryValues = ref({});
    let query = (values) => {
      emit("refresh", {pageNo:1,pageSize:props.data.pageSize,filter:values});
      queryValues.value = values;
    };
   

    let handleCurrentChange = (pageNum) => {
      emit("refresh", { pageNo: pageNum, pageSize: props.data.pageSize ,filter:queryValues.value});
    };

    let handleSizeChange = (pageSize) => {
      emit("refresh", { pageNo: 1, pageSize, filter:queryValues.value });
    };

    // select事件
    let selectChange = (data) => {
      emit("selectionChange", data);
    };

    // 隔行变色 类名/样式可自定义
    let tableRowClassName = ({ row, rowIndex }) => {
      if (rowIndex % 2 === 0) {
        return "success-row";
      } else if (rowIndex % 2 !== 0) {
        return "warning-row";
      }
    };

    //表头筛选
    let filterHandler = (value, row, column) => {
      const property = column["property"];
      return row[property] === value;
    };

    //  初始化表格数据
    let initTable = () => {
      const tableKeys = Object.keys(tableData);
      const insertKeys = Object.keys(insertFormConfig);
      const editKeys = Object.keys(editFormConfig);
      for (const key in props.tableConfig) {
        if (tableKeys.includes(key)) {
          tableData[key] = props.tableConfig[key];
        }
      }
      for (const key in props.insertConfig) {
        if (insertKeys.includes(key)) {
          insertFormConfig[key] = props.insertConfig[key];
        }
      }
      for (const key in props.editConfig) {
        if (editKeys.includes(key)) {
          editFormConfig[key] = props.editConfig[key];
        }
      }
      filterItem.fields = tableData.filterItem;
      filterItem.layout = tableData.filterItem.length + 1;
      tableData.column = props.column
      tableData.data = props.data

    };

    // 编辑参数
    const editDialogConfig = reactive({
      visible: false,
      title: "编辑",
      okTitle: "编辑",
      cancelTitle: "取消",
      draggable: true,
      isFooter: true,
      width: 800,
      dialogModal: false,
      showClose: true,
    });
    // 编辑
    let editOpenDialog = (rowData) => {
      editFormConfig.form.id = rowData.id;
      const rowDataKeys = Object.keys(rowData);
      editFormConfig.fields.forEach((item) => {
        if (item.append) {
          item.append.value = rowData[item.appendProp];
        }
        if (rowDataKeys.includes(item.prop)) {
          item.value = rowData[item.prop];
        }
      });
      editDialogConfig.visible = true;
    };
    // 编辑关闭dialog
    let editCancel = () => {
      editFormConfig.fields.forEach((item) => {
        if (item.append) {
          item.append.value = null;
        }
        item.value = null;
      });
      editDialogConfig.visible = false;
    };
    // 编辑提交方法
    let editSubmit = () => {
      editRefForm.value.formRef.validate((valid) => {
        if (valid) {
          emit("edit", {
            value: editRefForm.value.formParameter.form,
            callback: { onSuccess: editCancel },
          });
        } else {
          return false;
        }
      });
    };

    // 添加参数
    const insertDialogConfig = reactive({
      visible: false,
      title: "添加",
      okTitle: "添加",
      cancelTitle: "取消",
      draggable: true,
      isFooter: true,
      width: 800,
      dialogModal: false,
      showClose: true,
    });

    // 添加
    let insertOpenDialog = () => {
      insertDialogConfig.visible = true;
    };
    // 添加关闭dialog
    let insertCancel = () => {
      insertDialogConfig.visible = false;
    };
    // 添加提交方法
    let insertSubmit = () => {
      insertRefForm.value.formRef.validate((valid) => {
        if (valid) {
          emit("insert", {
            value: insertRefForm.value.formParameter.form,
            callback: { onSuccess: insertCancel },
          });
        } else {
          return false;
        }
      });
    };

    // 删除
    let delHandler = (rowData) => {
      emit("del", rowData);
    };

    // 初始化表格操作栏,表格头部按钮
    let initTableOperation = () => {
      tableOperation.value = []
      // 判断表格操作
      if (props.actions.length !== 0) {
        tableOperation.value.push(...props.actions);
      }
      // 父组件传过来的方法都会默认在前面加上on
      if (attrs.onDel) {
        tableOperation.value.push({
          title: "删除",
          icon: "Delete",
          color: "#F67777",
          handler: delHandler,
          confirmTitle: "确定删除吗?",
        });
      }
      if (attrs.onEdit) {
        tableOperation.value.push({
          title: "编辑",
          icon: "Edit",
          color: "#409EFF",
          handler: editOpenDialog,
        });
      }

      // 判断表格头部功能按钮
      if (tableData.headerBtn.length !== 0) {
        tableHeaderBtn.value.push(...tableData.headerBtn);
      }
      if (attrs.onInsert) {
        tableHeaderBtn.value.push({
          title: "添加",
          icon: "Plus",
          color: "#FF8040",
          handler: insertOpenDialog,
        });
      }
    };

    onBeforeMount(() => {
      initTable();
      initTableOperation();
    });
    onUnmounted(()=>{
      queryValues.value = {}
    })
    watch(()=>props.actions,(newVal,oldVal)=>{
      initTable();
      initTableOperation();
    })
    return {
      tableData,
      filterHandler,
      tableRowClassName,
      editOpenDialog,
      delHandler,
      insertOpenDialog,
      tableOperation,
      tableHeaderBtn,
      selectChange,
      handleCurrentChange,
      handleSizeChange,
      props,

      // 添加dialog
      insertDialogConfig,
      insertCancel,
      insertSubmit,
      // 编辑dialog
      editDialogConfig,
      editCancel,
      editSubmit,
      insertFormConfig,
      editFormConfig,
      editRefForm,
      insertRefForm,
      filterItem,
      query,
    };
  },
};
</script>
<style scoped>
.card-header {
  margin-bottom: 20px;
}
.el-pagination {
  margin: 20px 0px;
  float: right !important;
}

.query {
  width: "100%";
  float: right !important;
}
</style>
