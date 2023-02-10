
// import { chainInfo } from "~~/helper/chainInfo"

import useGlobalData from "~~/store/useGlobalData"
import useAppChainInfo from './appChainsInfo'
import useBeginETh from './beginEth'
import useBeginTron from './beginTron'

export default defineNuxtPlugin((NuxtApp) => {
  const startApp = async ()=>{
    const globalData = useGlobalData()
    const appChainsInfo = await useAppChainInfo()

    let presentChain:string, privateKey:boolean
    if(Object.keys(appChainsInfo).length>1){
      presentChain = 'bsc'
      privateKey = false
    } else {
      presentChain = Object.keys(appChainsInfo)[0]
      privateKey = true
    }
    
    const ownerAddress = await useBeginETh(presentChain)
    const ownerTronAddress = await useBeginTron()
    //根据appChainsInfo 判断是否是同一个钱包不是的话清楚币种选择列表
    if (localStorage.appChainsInfo != appChainsInfo) {
      // Object.keys(JSON.parse(appChainsInfo)).map(item => {
      //   store.commit("editAllList", {
      //     [item]: []
      //   });
      // })
    }
    
    globalData.$patch({
      appChainsInfo,
      presentChain,
      privateKey,
      ownerAddress,
      ownerTronAddress
    })

  }
  startApp()
})