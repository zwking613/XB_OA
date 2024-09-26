<template>
  <div class="processed">
    <div class="processed-header">
      <h2>已处理</h2>
    </div>
  </div>
</template>

<script setup>
import { useSysStore } from '@/stores/sys';

const sysStore = useSysStore();
</script>

<style scoped>
.processed {
  padding: 20px;
}
</style>
