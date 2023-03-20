import { defineStore } from "pinia"
interface GlobalDataState {
  test1: string,
  test2: string,
  zobjtest:AppChainsInfo,
  zstrtest:string
}
interface AppChainsInfo {
  [x:string]: Info
}
interface Info {
  rpc?: string,
  address?: string,
}
export default defineStore<string,GlobalDataState>("globalData", {
  state: () => {
    return {
      test1: "1",
      test2: "2",
      zobjtest:{},
      zstrtest:"",
    }
  },
  /** 需要缓存的state的key值 */
  persistentState: (names) => {
    return [names.zobjtest,names.zstrtest]
  },
})