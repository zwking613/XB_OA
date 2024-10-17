<template>
  <div class="common-layout">
    <Header></Header>
    <el-container class="h-[calc(100vh-64px)]">
      <el-aside class="w-[16.25rem]">
        <Menu />
      </el-aside>
      <el-container >
        <el-main class="h-full box-border">
          <el-card class="h-[calc(100vh-110px)] el-main">
            <RouterView></RouterView>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>
<script setup name="Layout">
import Menu from "@/components/layout/Menu.vue";
import Header from "@/components/layout/Header.vue";
</script>
<style scoped>
.el-main::-webkit-scrollbar {
  width: 8px;
}
.el-main {
  overflow-y: auto;
}

.el-main::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 4px;
}

.el-main::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.el-main::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>

