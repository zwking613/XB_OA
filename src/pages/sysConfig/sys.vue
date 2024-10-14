<template>
  <TechnologicalProcess v-if="sysStore.flowDiagramUrl && sysStore.selected" :flowDiagramUrl="sysStore.flowDiagramUrl"
    :processDefinitionId="sysStore.selected.id" />
  <el-tabs v-else style="height: 100%;" v-model="activeName" tab-position="top"  class="demo-tabs h-[calc(100vh-250px)] el-menu-vertical-demo"
    @tab-click="handleTabsClick">
    <el-tab-pane label="发起申请" name="first">
      <LaunchApplication />
    </el-tab-pane>
    <el-tab-pane label="待处理" name="second">
      <ToBeProcessed />
    </el-tab-pane>
    <!-- <el-tab-pane label="已处理" name="third">
      <Processed />
    </el-tab-pane>
    <el-tab-pane label="抄送我的" name="fourth">
      <CopyMe />
    </el-tab-pane>
    <el-tab-pane label="已提交" name="five">
      <Submitted />
    </el-tab-pane> -->
  </el-tabs>

</template>

<script setup>
import { useSysStore } from '@/stores/sys';
import LaunchApplication from './components/LaunchApplication.vue'
import TechnologicalProcess from './components/TechnologicalProcess.vue';
import Submitted from './components/Submitted.vue';
import ToBeProcessed from './components/ToBeProcessed.vue';
import Processed from './components/Processed.vue';
import CopyMe from './components/CopyMe.vue';
const sysStore = useSysStore();
const activeName = ref('first');

const handleTabsClick = ({props: {name}}) => {
  // 已提交
  if(name === 'five'){
    sysStore.getSubmittedList();
  }
  // 待处理
  else if(name === 'second'){
    console.log('待处理');
    sysStore.getTodoList();
  }
  // // 待处理
  // if(name === 'second'){
  //   sysStore.getSubmittedList();
  // }
  // // 已处理
  // if(name === 'third'){
  //   sysStore.getSubmittedList();
  // }
  // // 抄送我的
  // if(name === 'fourth'){
  //   sysStore.getSubmittedList();
  // }
}
onUnmounted(() => {
  sysStore.flowDiagramUrl = '';
  sysStore.selected= {};
})
</script>

<style scoped>
.sys-config-page {
  padding: 20px;
}

.category {
  margin-bottom: 20px;
}

.tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.sys-config-page {
  padding: 20px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #f56c6c;
  font-size: 14px;
}

.category {
  margin-bottom: 20px;
}

.category h3 {
  margin-bottom: 10px;
}
</style>
