import { defineStore } from "pinia";
/* 这里是rootState的仓库 */
export const useRootStore = defineStore("rootId", {
    state: () => {
        return {
            age: 18,
        };
    },
 })
