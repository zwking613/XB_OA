<template>
  <div class="demo">
    <h2>This is a Demo Of Pinia To Used</h2>

    <p class="store">store数据：{{ store.counter }}</p>

    <!--下面了使用了pinia里面的计算属性 -->
    <p class="store">双倍数据：{{ store.doubleCount }}</p>
    <!-- 下面是传参的 getter -->
    <p class="store">传参的计算属性：{{ store.receiveParams("我的") }}</p>
    <!-- 下面是使用了其他模块数据的 getter -->
    <p class="store">
      使用其他模块数据的计算属性：{{ store.useOtherStateOfModules }}
    </p>

    <div class="btnContent">
      <button class="btn" @click="add">点击加一</button>
      <button class="btn" @click="reduce">点击减一</button>
      <button class="btn" @click="reset">重置Pinia状态</button>
      <button class="btn" @click="patch">同时修改多个数据</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, createApp, onMounted } from "vue";
/*  为了从 Store 中提取属性同时保持其响应式，您需要使用storeToRefs()。 它将为任何响应式属性创建 refs。 */
import { storeToRefs } from "pinia";

/* 1，引入对应的store模块 */
import { useStore } from "@/stores/counter";
/* 2，实例化 */
let store = useStore();
/* 3，使用 直接改变状态 */
const add = () => {
  // 此处可以直接通过赋值语句改变 state的值；不需要向vuex那样调用actions
  store.name = "Wendi";
  store.counter++;
  console.log("name：", store.name); //改动成功
};

/* 4，通过acions改变状态 */
const reduce = () => {
  // 每次点击 就减一
  store.induce();
  // console.log(store.induce);
  console.log("counter:", store.counter);
};

/* 点击重置状态 
如果想要将数据重置到最开始更新数据的时候，pinia提供了一个方法：$reset()
*/
const reset = () => {
  store.$reset(); // 重置成功
};

/* 6，使用内置的 $patch 同时修改多个属性 */
const patch = () => {
  // 第一种 直接修改
  store.$patch({
    counter: store.counter + 1,
    name: "Abalam",
  });

  // 第二种 再回调函数中修改  可以拿到state 推荐使用这种
  store.$patch((state) => {
    state.items.push({ name: "shoes", quantity: 1 }); // push属性
    state.hasChanged = true;
  });
};

/* 7,订阅状态 使用 $subscribe 内置方法可以监听到状态的变化 */
store.$subscribe(
  () => {
    console.log("subscribe监听到了数据改变");
  },
  { detached: true }
);
</script>

<style scoped>
.btnContent {
  margin-top: 10px;
}

.btn {
  margin-left: 10px;
}

.store {
  margin-left: 10px;
}
</style>
