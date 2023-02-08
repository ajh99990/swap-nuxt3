import { defineStore } from "pinia"

export default defineStore("globalData", {
  state: () => {
    return {
      appChainsInfo:[],
      presentChain: 'bsc',
      privateKey: false,
      ownerAddress: '',
      allCoinList: {},
      searchCoinList: {},
      
      test1: "1",
      test2: "2",
      stateNames:{
        test1: "1",
        test2: "2",
      }
    }
  },
  /** 需要缓存的state的key值 */
  persistentState: (names) => {
    return [names.test1, names.allCoinList]
  },
})