<template>
  <div >
    <iframe :src="src" frameborder="0" class="w-full h-[calc(100vh-150px)]"></iframe>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const src = ref(process.env.NODE_ENV === 'development' ? 'http://192.168.3.129:8088/#/processes' : 'http://192.168.3.251:8809/api/#/processes');

</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: calc(100vh - 200px);
  overflow: hidden;
}
</style>
