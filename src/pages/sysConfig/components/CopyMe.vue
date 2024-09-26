<template>
    
  <div class="copy-me">
    <div class="copy-me-header">
      <h2>抄送我的</h2>
    </div>
  </div>
</template>

<script setup>
import { useSysStore } from '@/stores/sys';

const sysStore = useSysStore();
</script>

<style scoped>
.copy-me {
  padding: 20px;
}
</style>
