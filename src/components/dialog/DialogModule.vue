<template>
  <div>
    <el-dialog
      v-model="dialogParameters.visible"
      :title="dialogParameters.title"
      :draggable="dialogParameters.draggable"
      :before-close="onCancel"
      :width="dialogParameters.width"
      :showClose="dialogParameters.showClose"
      :modal="dialogParameters.dialogModal"
      destroy-on-close
    >
      <slot></slot>
      <template
        #footer
        v-if="dialogParameters.isFooter"
      >
        <div class="dialog-footer">
          <el-button @click="onCancel">{{dialogParameters.cancelTitle}}</el-button>
          <el-button
            type="primary"
            @click="onConfirm"
          >{{dialogParameters.okTitle}}</el-button>
        </div>
</template>
</el-dialog>
</div>
</template>
<script>
import { ref, reactive, onBeforeMount, watch } from "vue";
export default {
  props: {
    dialogConfig: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { attrs, emit, slots }) {
    const dialogParameters = reactive({
      visible: false,
      title: "",
      okTitle: "确定",
      cancelTitle: "取消",
      draggable: false,
      isFooter: true,
      width: 600,
      dialogModal: true,
      showClose: true
    });

    // 初始化dialog参数
    let initDialog = () => {
      const dialogKeys = Object.keys(dialogParameters);
      for (const key in props.dialogConfig) {
          if(dialogKeys.includes(key)){
            dialogParameters[key] = props.dialogConfig[key];
          }
      }
    };
    onBeforeMount(() => {
      initDialog();
    });
    const onCancel = () => {
      if (attrs.onOnCancel) {
        emit("onCancel");
      }
    };
    const onConfirm = () => {
      if (attrs.onOnConfirm) {
        emit("onConfirm");
      }
    };
    watch(
      () => props.dialogConfig.visible,
      newVisible => {
        dialogParameters.visible = newVisible;
      }
    );
    return {
      dialogParameters,
      onCancel,
      onConfirm
    };
  }
};
</script>

