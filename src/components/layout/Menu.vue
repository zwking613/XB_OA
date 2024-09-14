<template>
  <el-menu :default-active="defaultActive" class="h-[calc(100vh-64px)] el-menu-vertical-demo dark-mode" :router="true"
    background-color="rgb(35 46 51)" text-color="#fff" :collapse="isCollapse" active-text-color="#fff">
    <template v-for="route in routes">
      <el-sub-menu :key="route.name" v-if="route.children && route.children.length" :index="route.path">
        <template #title>
          <el-icon v-if="route.meta && route.meta.icon">
            <component :is="route.meta.icon" />
          </el-icon>
          <span>{{ route.name }}</span>
        </template>
        <el-menu-item v-for="child in route.children" :key="child.path" :index="child.path">
          <el-icon v-if="child.meta && child.meta.icon">
            <component :is="child.meta.icon" />
          </el-icon>
          <span>{{ child.name }}</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="route.path" :key="route.path">
        <el-icon v-if="route.meta && route.meta.icon">
          <component :is="route.meta.icon" />
        </el-icon>
        <span>{{ route.name }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup name="Menu">
import { useRouter } from "vue-router";
import { routes } from "@/router";
import { ref } from "vue";
const isCollapse = ref(false);
const router = useRouter();
const defaultActive = ref(router.currentRoute.value.path);
</script>

<style scoped>
.el-menu-item.is-active {
  background-color: #409eff !important;
}
</style>
