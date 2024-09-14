<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="flex flex-col items-center justify-center">
            <img src="/src/assets/404.png" alt="">
        </div>
        <h1 class="mb-4 text-4xl font-bold">404 - 页面不存在</h1>
        <p class="text-xl bottom-8">抱歉，您要查找的页面不存在。</p>
        <router-link to="/" >返回首页</router-link>
    </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<script setup>
</script>

<style scoped>

a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>
