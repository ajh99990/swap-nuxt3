import { judgePlatform, postMessageAppCallback } from "~~/helper/postMessage"
import { getOwnerAddress } from "~~/modules/web3"
import { chainInfo } from "~~/helper/chainInfo"
import useGlobalData from "~~/store/useGlobalData"
export default defineNuxtPlugin((NuxtApp) => {
  const startApp = async ()=>{
    const globalData = useGlobalData()
    let appChainsInfo, presentChain, privateKey
    if (judgePlatform('getChainsInfo')) {
      appChainsInfo = await postMessageAppCallback('getChainsInfo')
    } else {
      const chainInfoArray = Object.values(chainInfo)
      const chainKeysArray = Object.keys(chainInfo)
      appChainsInfo = chainInfoArray.map((item:any,index )=>{
        return { [chainKeysArray[index]]: item.rpc}
      })
    }
    if(Object.keys(appChainsInfo).length>1){
      presentChain = 'bsc'
      privateKey = false
    } else {
      presentChain = Object.keys(appChainsInfo)[0]
      privateKey = true
    }
    const ownerAddress = await getOwnerAddress(presentChain)
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
      ownerAddress
    })
  }
  startApp()
})