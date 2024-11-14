<template>
  <el-form ref="formRef" :label-width="formParameter.labelWidth" class="demo-ruleForm" :rules="formParameter.rules"
    :model="formParameter.form" :label-position="formParameter.labelPosition" :size="formParameter.size"
    label-suffix=":" scroll-to-error :inline="formParameter.inline">
    <el-row :justify="formParameter.isSpan ? 'end':'start'">
      <el-col v-for="item in formParameter.fields" :key="item.label+item.prop"
        :span="formParameter.inline ? ((24 - 3) / (formParameter.layout - 1)) : 24 / formParameter.layout">
        <el-form-item :offset="0" :label="item.label" :prop="item.prop" :label-width="formParameter.formItemLabelWidth">
          <component v-if="item.component && !item.check" :is="item.component" :item="item"
            :formParameter="formParameter" v-model="formParameter.form[item.prop]" />
          <!-- input -->
          <el-input v-if="item.type==='input'&& !item.check" :style="item.style" type="text" autocomplete="off"
            :placeholder="`请输入${item.label}`" v-model="formParameter.form[item.prop]" @change="item.onChange">

            <template v-if="item.append" #append>
              <el-select v-model="formParameter.form[item.append.prop]" placeholder="请选择" style="width: 115px">
                <el-option v-for="i in item.append.options" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </template>

          </el-input>

          <!-- input数字输入框 -->
          <el-input v-if="item.type==='inputNumber'&& !item.check" type="number" :style="item.style" autocomplete="off"
            :placeholder="`请输入${item.label}`" v-model="formParameter.form[item.prop]" @change="item.onChange" />
          <!-- input只读框 -->
          <el-input v-if="item.type==='inputReadOnly'&& !item.check" type="text" :style="item.style" autocomplete="off"
            :placeholder="`请输入${item.label}`" disabled v-model="formParameter.form[item.prop]" />
          <!-- 文本域 -->
          <el-input v-if="item.type==='textarea'&& !item.check" type="textarea" :style="item.style" autocomplete="off"
            :placeholder="`请输入${item.label}`" v-model="formParameter.form[item.prop]" @change="item.onChange" />
          <!-- select下拉框 -->
          <el-select :style="item.style" v-if="item.type==='select'&& !item.check"
            v-model="formParameter.form[item.prop]" filterable :placeholder="`请选择${item.label}`" @change="item.onChange"
            fit-input-width :multiple="item.multiple">
            <el-option v-for="i in item.options" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
          <!-- select-tree -->
          <el-tree-select v-if="item.type==='selectTree'&& !item.check" v-model="formParameter.form[item.prop]"
            :data="item.options" :multiple="item.multiple" :render-after-expand="false"
            :show-checkbox="item.showCheckbox" />
          <!-- switch -->
          <el-switch v-if="item.type==='switch'&& !item.check" v-model="formParameter.form[item.prop]"
            :disabled="item.disabled" />
          <!-- radio -->
          <el-radio-group v-if="item.type==='radio'&& !item.check" v-model="formParameter.form[item.prop]"
            :disabled="item.disabled" @change="item.onChange">
            <el-radio v-for="i in item.options" :label="i.label" :border="item.border"
              :key="i.label">{{i.title}}</el-radio>
          </el-radio-group>
          <!-- checkbox -->
          <el-checkbox-group v-if="item.type==='checkbox'&& !item.check" v-model="formParameter.form[item.prop]"
            @change="item.onChange">
            <el-checkbox v-for="i in item.options" :key="i.label" :label="i.label" :name="i.title"
              :disabled="item.disabled" />
          </el-checkbox-group>
          <!-- colorPicker -->
          <el-color-picker v-if="item.type==='colorPicker'&& !item.check" v-model="formParameter.form[item.prop]"
            @change="item.onChange" :disabled="item.disabled" :show-alpha="item.showAlpha"
            :predefine="item.predefineColors" />


          <UploadFile  :data="item" v-if="item.type==='upload'&& !item.check" v-model="formParameter.form[item.prop]" :formData ="formParameter" :filed="item.prop" :success="(data)=>{
            formParameter.form[item.prop] = data
          }"/>

          <!-- date-->
          <el-date-picker v-if="item.type==='datePick'&& !item.check" v-model="formParameter.form[item.prop]"
            @change="item.onChange" :readonly="item.readonly" :disabled="item.disabled" :type="item.dateType"
            :start-placeholder="`请选择开始${item.label}`" :end-placeholder="`请选择结束${item.label}`"
            :placeholder="`请选择${item.label}`" :format="item.format?item.format :'YYYY/MM/DD'"
            :value-format="item.valueFormat ? item.valueFormat :'YYYY-MM-DD'" />
          <!-- Upload 上传 -->
          <!-- Cascader 级联选择器 -->
          <!-- Rate 评分 -->
          <el-rate v-if="item.type==='rate'&& !item.check" v-model="formParameter.form[item.prop]"
            :disabled="item.disabled" @change="item.onChange" :allow-half="item.allowHalf" />
          <!-- Slider 滑块 -->
          <el-slider v-if="item.type==='slider'&& !item.check" v-model="formParameter.form[item.prop]"
            :disabled="item.disabled" @change="item.onChange" :range="item.range" :marks="item.marks"
            :vertical="item.vertical" :show-input="item.showInput" />
        </el-form-item>
      </el-col>
      <el-col :span=" formParameter.isSpan ? 3 : 24">
        <el-form-item v-if="formParameter.isFormBtn">
          <el-button v-if="formParameter.isCancel" @click="onCancel">{{formParameter.cancelTitle}}</el-button>
          <el-button v-if="formParameter.isReset" @click="resetForm(formRef)">重置</el-button>
          <el-button type="primary" @click="submitForm(formRef)">{{formParameter.okTitle}}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>


<script>
import { reactive, onBeforeMount, ref, watchEffect, watch } from "vue";
export default {
  props: {
    fromConfig: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { attrs, emit, slots }) {
    const formRef = ref();
    const formParameter = reactive({
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
      formItemLabelWidth:"120px",
      isReset:false,
      isCancel:true,
      isSpan:false
    });
    let submitForm = formRef => {
      if (formRef) {
        formRef.validate(valid => {
          if (valid) {
            emit('submit',formParameter.form)
          } else {
            return false;
          }
        });
      }
    };

    let resetForm = formRef => {
      if (formRef) {
        formRef.resetFields();
      }
    };

    let onCancel = () => {};
    watch(
      [
        () => props.fromConfig.labelPosition,
        () => props.fromConfig.size,
        () => props.fromConfig.layout
      ],
      ([newLabelPosition, newSize, newLayout]) => {
        formParameter.labelPosition = newLabelPosition;
        formParameter.size = newSize;
        formParameter.layout = newLayout;
      }
    );
    // 计算请求头
    const getToken = computed(() => {
      return localStorage.getItem("token") || "";
    });
    const initForm = () => {
      const formKeys = Object.keys(formParameter);
      for (const key in props.fromConfig) {
        if (formKeys.includes(key)) {
          formParameter[key] = props.fromConfig[key];
        }
      }
      formParameter.fields.forEach(element => {
        // if (element.value) {
        //   formParameter.form[element.prop] = element.value;
        //   if (element.append) {
        //     formParameter.form[element.append.prop] = element.append.value || element.append.label;
        //   }
        // } else {
          if (element.type === "checkbox") {
            formParameter.form[element.prop] = [];
          } else {
            formParameter.form[element.prop] = element.value;
            if (element.append) {
              formParameter.form[element.append.prop] = element.append.value || element.append.label;
            } 
          }
        // }
      });
    };
    // 初始化form数据
    onBeforeMount(() => {
      initForm();
    });

    return {
      formRef,
      formParameter,
      submitForm,
      resetForm,
      onCancel,
      initForm,
      getToken
    };
  }
};
</script>

<style>
</style>
