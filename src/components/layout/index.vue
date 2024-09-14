<template>
  <div class="common-layout">
    <Header></Header>
    <el-container class="h-[calc(100vh-64px)]">
      <el-aside class="w-[16.25rem]">
        <Menu />
      </el-aside>
      <el-container class="h-full">
        <el-main>
          <el-card class="h-full">
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
