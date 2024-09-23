<template>
  <el-select
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="search"
    :loading="loading"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :clearable="true"
    :collapse-tags-tooltip="collapseTagsTooltip"
    @change="handleChange"
    @visible-change="handleVisibleChange"
    @remove-tag="handleRemoveTag"
    @clear="handleClear"
    @blur="handleBlur"
    @focus="handleFocus"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { post } from '@/utils/request'; // 假设封装的post请求在这个路径

const props = defineProps({
  // API请求的URL
  url: {
    type: String,
    required: true
  },
  // 选择框的占位文本
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否允许多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 多选时是否将选中值按文字的形式展示
  collapseTags: {
    type: Boolean,
    default: false
  },
  // 多选时是否显示折叠标签的提示
  collapseTagsTooltip: {
    type: Boolean,
    default: false
  },
  // 搜索时使用的键名
  searchKey:{
    type: String,
    default: 'name'
  },
  // 选项值的键名
  valueKey:{
    type: String,
    default: 'id'
  },
  // 选项标签的键名
  labelKey:{
    type: String,
    default: 'name'
  },
  // 响应数据中包含选项的键名或键名路径
  dataKey: {
    type: [String, Array],
    default: 'data'
  },
  // 请求参数
  params:{
    type: Object,
    default: () => {
        return {
            pageNo: 1,
            pageSize: 100,
        }
    }
  }
});

const options = ref([]);
const loading = ref(false);
const query = ref(props.params);
// 防抖函数
const throttle = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const search=(e)=>{
  const throttledSearch = throttle((e) => {
    remoteSearch(e);
  }, 300);

  // 搜索函数
  if (e) {
    throttledSearch(e);
  } else {
    remoteSearch();
  }
}
const remoteSearch = async (e) => {
    loading.value = true;
    try {
      const response = await post(props.url, { ...query.value, [props.searchKey]: e });
      let data 
      if(Array.isArray(props.dataKey)){
        data = props.dataKey.reduce((acc, key) => acc[key], response);
      }else{
        data = response[props.dataKey]
      }
      options.value = data && data.map(item => ({
        value: item[props.valueKey],
        label: item[props.labelKey]
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loading.value = false;
    }
};

const handleChange = (value) => {
  if (props.change) {
    props.change(value);
  }
};

const handleVisibleChange = (visible) => {
  if (props.visibleChange) {
    props.visibleChange(visible);
  }
};

const handleRemoveTag = (tag) => {
  if (props.removeTag) {
    props.removeTag(tag);
  }
};

const handleClear = () => {
  if (props.clear) {
    props.clear();
  }
};

const handleBlur = (event) => {
  if (props.blur) {
    props.blur(event);
  }
};

const handleFocus = (event) => {
  if (props.focus) {
    props.focus(event);
  }
};




onMounted(() => {
  remoteSearch();
});
</script>

<!-- <SelectLimit v-model="formData.selectedConfig" url="/user/page" :dataKey="['list','list']" labelKey="userName"
  valueKey="id" searchKey="userName" :change="onChange" placeholder="请选择系统配置项" :multiple="true" :collapse-tags="false"
  :collapse-tags-tooltip="true" /> -->