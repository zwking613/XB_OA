<template>
<el-tree-select
  :data="treeData"
  :props="defaultProps"
  :render-after-expand="false"
  :placeholder="placeholder"
  :show-checkbox="showCheckbox"
  @change="handleChange"
/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { post } from '@/utils/request';
const props = defineProps({
  url: { type: String, required: true },
  placeholder: { type: String, default: '请选择' },
  showCheckbox: { type: Boolean, default: false },
  valueKey: { type: String, default: 'id' },
  labelKey: { type: String, default: 'name' },
  dataKey: { type: [String, Array], default: 'data' },
  childrenKey: { type: String, default: 'children' },
  customData: { type: Function, default: null }
});

const emit = defineEmits(['change']);

const treeData = ref([]);

const defaultProps = {
  children: props.childrenKey,
  label: props.labelKey,
  value: props.valueKey
};

const fetchTreeData = async () => {
  try {
    const response = await post(props.url);
    let data = Array.isArray(props.dataKey) ? props.dataKey.reduce((acc, key) => acc[key], response) : response[props.dataKey];
    treeData.value = props.customData ? props.customData(data) || [] : data || [];
    console.log(treeData.value)
  } catch (error) {
    console.error('Error fetching tree data:', error);
  }
};

const handleChange = (value) => {
  emit('change', value);
};

onMounted(() => {
  fetchTreeData();
});
</script>
<!-- <SelectTree v-model="formData.selectedConfig" url="/department/list" dataKey="list" labelKey="name" valueKey="id"
    placeholder="请选择系统配置项" :customData="customData" :multiple="true" /> -->