<template>
  <Layout />
</template>
<script setup name="Home">
import Layout from '@/components/layout/index.vue'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'
const userStore = useAppStore()
onMounted(() => {
  userStore.getUserInfo()
})
</script>