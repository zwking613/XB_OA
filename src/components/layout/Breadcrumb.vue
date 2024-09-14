<template>
  <el-breadcrumb
    :separator-icon="ArrowRight"
    class="p-4 bg-gray-100 rounded-md shadow-sm"
  >
    <el-breadcrumb-item
      :to="{ path: '/' }"
      class="text-blue-600 hover:text-blue-800"
    >
      <el-icon class="mr-1"><HomeFilled /></el-icon>
      Homepage
    </el-breadcrumb-item>
    <el-breadcrumb-item class="text-gray-600">
      <el-icon class="mr-1"><Promotion /></el-icon>
      Promotion Management
    </el-breadcrumb-item>
    <el-breadcrumb-item class="text-gray-600">
      <el-icon class="mr-1"><List /></el-icon>
      Promotion List
    </el-breadcrumb-item>
    <el-breadcrumb-item class="font-semibold text-gray-800">
      <el-icon class="mr-1"><Document /></el-icon>
      Promotion Detail
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup name="Breadcrumb">
import { ArrowRight } from "@element-plus/icons-vue";
</script>
