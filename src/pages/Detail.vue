<template>
  <div class="Detail">
    <ul>
      <li>{{ id }}</li>
      <li>{{ name }}</li>
      <li>{{ age }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<script setup>
import { toRefs } from "vue";
// import { useRoute } from "vue-router";
// let route = useRoute()
// // let {query} = toRefs(route)
// console.log(route);

defineProps(['id','name','age'])
</script>

<style></style>
