<template>
    <div>
        <TableModule :insertConfig="insertConfig" :editConfig="editConfig" :column="columns" :data="ppsStore.pps"
            @refresh="refresh" @del="deletePps" @insert="saveOrUpdate" :tableConfig="tableConfig" :actions="actions"
            @edit="saveOrUpdate" />

        <DialogModule :dialogConfig="dialogParameters" @onCancel="onCancel">
            <el-descriptions :column="3" border>
                <el-descriptions-item label="项目名称" label-align="center" align="center" label-class-name="my-label"
                    class-name="my-content" width="150px">{{ ppsStore.details.projectName }}</el-descriptions-item>
                <el-descriptions-item label="预计金额" label-align="center" align="center">{{ ppsStore.details.totalAmount
                    }}</el-descriptions-item>
                <el-descriptions-item label="提出时间" label-align="center" align="center">{{ ppsStore.details.createTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="归属单位/部门" label-align="center" align="center"> {{ ppsStore.details.deptName
                    }}
                </el-descriptions-item>
                <el-descriptions-item label="联系人" label-align="center" align="center"> {{ ppsStore.details.contact }}
                </el-descriptions-item>
                <el-descriptions-item label="联系电话" label-align="center" align="center"> {{
                    ppsStore.details.contactnumber }}</el-descriptions-item>
                <el-descriptions-item label="项目跟踪(负责)人" label-align="center" align="center"> {{
                    ppsStore.details.headName }}
                </el-descriptions-item>
            </el-descriptions>

            <el-divider>项目进度描述</el-divider>

                <TableModule :insertConfig="insertConfigItem" :column="columnsItem" :data="{
                list: ppsStore.ppsItemList
            }" @del="deleteItem" @insert="insertItem" :tableConfig="{ isPaging: false, fixedHeaderHeight:'200px'}" />
        </DialogModule>
    </div>
</template>

<script setup name="Pps" lang="jsx">
import { usePpsStore } from '@/stores/pps'

const ppsStore = usePpsStore()
const dialogParameters = ref({
    visible: false,
    title: '项目详情',
    width: '60%',
    draggable: true,
    showClose: true,
    dialogModal: true, 
    isFooter:false,
})
const tableConfig = {
    operationFixed: 'right',
    filterItem:[
        {
            label: "项目名称",
            prop: "projectName",
            type: "input"
        }
    ]
}
const columns = [
    {
        props: 'id',
        label: '序号'
    },
    {
        props: 'projectName',
        label: '项目名称'
    },
    {
        props: 'totalAmount',
        label: '预计金额(元)'
    },
    {
        props: 'createTime',
        label: '创建时间'
    },
    {
        props: 'createUser',
        label: '创建人'
    },
    {
        props: 'createUserName',
        label: '创建人名称'
    },
    {
        props: 'deptName',
        label: '归属单位名称'
    },
    {
        props: 'contact',
        label: '联系人'
    },
    {
        props: 'contactnumber',
        label: '联系电话'
    },
    {
        props: 'headName',
        label: '项目追踪负责人'
    },
    {
        props: 'invalid',
        label: '是否作废',
        customRender: (row) => {
            return <el-tag class="ml-2" type={row.invalid ? 'danger' : 'success'}>{row.invalid ? '是' : '否'}</el-tag>
        }
    }
];
const columnsItem = [{
    props: 'info',
    label: '进度描述'
},{
    props: 'createTime',
    label: '进度更新时间'
},{
    props: 'createUserName',
    label: '进度更新人'
} ]
const insertConfig = {
    rules: {
        projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        totalAmount: [
            { required: true, message: '请输入预计金额', trigger: 'blur' },
            { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: '请输入正确的金额格式', trigger: 'blur' }
        ],
        deptId: [
            { required: true, message: '请选择归属单位', trigger: 'blur' },
        ],
        contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        contactnumber: [
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        headId: [
            { required: true, message: '请选择项目追踪负责人', trigger: 'blur' },
        ],
    },
    fields: [{
        label: "项目名称",
        prop: "projectName",
        type: "input"
    }, {
        label: "预计金额",  
        prop: "totalAmount",
        type: "input",
        append: {
            prop: "totalAmountUnit",
            label: "Y",
            options: [
                { label: "元", value: "Y" },
                { label: "万元", value: "WY" },
            ]
        }
    },
    {
        label: "归属单位",
        prop: "deptId",
        component: <SelectLimit url="/department/list" dataKey='list' labelKey="name"
            valueKey="id" searchKey="name" placeholder="请选择归属单位" />
    },
    {
        label: "联系人",
        prop: "contact",
        type: "input"
    },
    {
        label: "联系电话",
        prop: "contactnumber",
        type: "input"
    },
    {
        label: "追踪负责人",
        prop: "headId",
        component: <SelectLimit url="/user/page" dataKey={['list', 'list']} labelKey="userName"
            valueKey="id" searchKey="name" placeholder="请选择项目追踪负责人"  />
    }]
}

const insertConfigItem = {
    rules: {
        info: [
            { required: true, message: '请输入进度描述', trigger: 'blur' },
        ],
    },
    fields: [{
        label: "进度描述",
        prop: "info",
        type: "textarea"
    }]
}

const onCancel = () => {
    dialogParameters.value.visible = false
}

const editConfig = {
    rules: {
        projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        totalAmount: [
            { required: true, message: '请输入预计金额', trigger: 'blur' },
            { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: '请输入正确的金额格式', trigger: 'blur' }
        ],
        deptId: [
            { required: true, message: '请选择归属单位', trigger: 'blur' },
        ],
        contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        contactnumber: [
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        headId: [
            { required: true, message: '请选择项目追踪负责人', trigger: 'blur' },
        ],
    },
    fields: [{
        label: "项目名称",
        prop: "projectName",
        type: "input"
    }, {
        label: "预计金额",
        prop: "totalAmount",
        type: "input",
        append: {
            prop: "totalAmountUnit",
            label: "Y",
            options: [
                { label: "元", value: "Y" },
                { label: "万元", value: "WY" },
            ]
        }
    },
    {
        label: "归属单位",
        prop: "deptId",
        component: <SelectLimit url="/department/list" dataKey='list' labelKey="name"
            valueKey="id" searchKey="name" placeholder="请选择归属单位" />
    },
    {
        label: "联系人",
        prop: "contact",
        type: "input"
    },
    {
        label: "联系电话",
        prop: "contactnumber",
        type: "input"
    },
    {
        label: "追踪负责人",
        prop: "headId",
        component: <SelectLimit url="/user/page" dataKey={['list', 'list']} labelKey="userName"
            valueKey="id" searchKey="name" placeholder="请选择项目追踪负责人" />
    }]
}
const handleDetail = async (row) => {
    ppsStore.details = row
    dialogParameters.value.visible = true
    await ppsStore.getItemList(row)
}
const actions = ref([
    {
        title: '详情',
        icon: 'Monitor',
        color: "#E67888",
        handler: handleDetail
    }
])

const refresh = async ({pageNo, pageSize,filter}) => {
    await ppsStore.fetchPps({pageNo, pageSize,filter})
}
const deletePps = async ({id}) => {
    await ppsStore.deletePps(id)
}
const saveOrUpdate = async ({ value,callback}) => {
    value.totalAmount = value.totalAmountUnit === "Y" ? value.totalAmount : value.totalAmount * 10000
    delete value.totalAmountUnit
    await ppsStore.saveOrUpdate(value, callback.onSuccess)
}

const insertItem = async ({ value,callback}) => {
    value.ppsId = ppsStore.details.id
    await ppsStore.saveItem(value, callback.onSuccess)
}
const deleteItem = async ({id}) => {
    await ppsStore.deleteItem(id)
}
onMounted(async () => {
    await ppsStore.fetchPps()
})
</script>
<style scoped>

</style>
