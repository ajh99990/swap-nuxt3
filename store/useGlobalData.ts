import { defineStore } from "pinia"

export default defineStore("globalData", {
  state: () => {
    return {
      test1: "1",
      test2: "2",
    }
  },
  /** 需要缓存的state的key值 */
  persistentState: (names) => {
    return [names.test1,names.test2]
  },
})