import { defineStore } from "pinia"

export interface AppChainsInfo {
  [x:string]: Info
}

interface Info {
  rpc?: string,
  address?: string,
}

interface GlobalDataState {
  language: string,
  appChainsInfo: AppChainsInfo,
  presentChain: string,
  privateKey: boolean,
  ownerAddress: string,
  ownerTronAddress: string,
  allCoinList: any,
  searchCoinList: any,
}


export default defineStore<string,GlobalDataState>("globalData", {
  state: () =>  {
    return {
      language: '',
      appChainsInfo: {},
      presentChain: '',
      privateKey: false,
      ownerAddress: '',
      ownerTronAddress: '',
      allCoinList: {},
      searchCoinList: {},
    }
  },
  /** 需要缓存的state的key值 */
  persistentState: (names) => {
    return [names.allCoinList,names.appChainsInfo]
  },
})