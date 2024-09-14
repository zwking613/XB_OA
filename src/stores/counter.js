import { ref, computed } from "vue";
import { defineStore } from "pinia";
// 可以引入其他模块并使用
import { useRootStore } from "@/stores/rootState";

// Store 是使用 defineStore() 定义的，并且它需要一个唯一名称，作为第一个参数传递："myStore""
export const useStore = defineStore("myStore", {

    /* =================================State================================ */
    state: () => { // state 推荐用箭头函数的方式 利于类型推断
        return {
            counter: 100,
            name: "Eula", //尤菈
            isAdmin: true,
            items: []
        };
    },

    /* =================================Getters================================ */
    getters: {
        /* 1,第一种使用 参数的方式访问 state */
        doubleCount: (state) => {
            return state.counter * 2;
        },
        /* 2,第二种使用 常规函数用this访问整个store的实例，不能使用箭头函数 因为箭头函数绑定的是外部this */
        trebleCount() {
            return this.counter * 3;
        },

        /* 3,需要将参数传递给getter 因为getter是计算属性 只能返回一个函数以接收任何参数*/
        receiveParams: (state) => {
            // params 是你调用的时候传进来的值
            return (params) => {
                return String(params) + state.name; // 我的优菈
            };
        },

        /* 4,可以访问其他store模块的 state 上面先引用 再使用*/
        useOtherStateOfModules: (state) => {
            // 实例化其他模块
            const root = useRootStore();
            return state.name + "-" + root.age;
        },
    },

    /* =================================Actions================================ */
    actions: {  //  这里使用常规函数 可以通过this进行访问store实例
        /* 自减函数 */
        induce() {
            this.counter--;
        },
        /* 随机数*/
        randomizeCounter() {
            this.counter = Math.round(100 * Math.random());
        },
    },
},{
    persist: true // 开启持久化存储
});



