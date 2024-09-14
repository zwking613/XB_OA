<template>
  <div class="About">
    <div @click="add">点击</div>
  </div>
</template>

<script setup name="About">
  import { useAppStore } from "@/stores/app";
  const store = useAppStore();
  const add = () => {
    store.login({
      username: "xz",
      password: "xz",
    });  
  }
</script>

<style></style>
