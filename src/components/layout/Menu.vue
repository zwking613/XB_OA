<template>
  <el-menu :unique-opened="true" :default-active="defaultActive" class="h-[calc(100vh-64px)] el-menu-vertical-demo dark-mode" :router="true"
    background-color="rgb(35 46 51)" text-color="#fff" :collapse="isCollapse" active-text-color="#fff">
    <template v-for="route in routes">
      <el-sub-menu :key="route.name" v-if="route.children && route.children.length" :index="route.path">
        <template #title>
          <el-icon v-if="route.meta && route.meta.icon">
            <component :is="route.meta.icon" />
          </el-icon>
          <span>{{ route.name }}</span>
        </template>
        <el-menu-item v-for="child in route.children" :key="route.path + child.path" :index="route.path + child.path">
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
console.log(router.currentRoute.value.path)
const defaultActive = ref(router.currentRoute.value.path);
</script>

<style scoped>
.el-menu-item.is-active {
  background-color: #597999 !important;
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
}
</style>
