
// import { chainInfo } from "~~/helper/chainInfo"

import useGlobalData, { AppChainsInfo } from "~~/store/useGlobalData"
import useAppChainInfo from './appChainsInfo'
import useBeginETh from './beginEth'
import useBeginTron from './beginTron'
import { deepEqual } from "~~/helper/common"

export default defineNuxtPlugin(async (NuxtApp) => {
    const appChainsInfo = await useAppChainInfo()

    //拿到当前所处的链的环境，并判断是私钥还是助记词
    let presentChain:string, privateKey:boolean
    if(Object.keys(appChainsInfo).length>1){
      presentChain = 'bsc'
      privateKey = false
    } else {
      presentChain = Object.keys(appChainsInfo)[0]
      privateKey = true
    }

    //初始化当时类以太的交易环境
    const ownerAddress = await useBeginETh(presentChain)

    //默认获取tron的用户地址，并支持tron的交易
    const ownerTronAddress = await useBeginTron()

    //初始化默认的交易对
    const { getNowChain } = NuxtApp.$managerScheduler
    getNowChain(presentChain)

    const globalData = useGlobalData()
    //根据appChainsInfo 判断是否是同一个钱包不是的话清楚币种选择列表
    console.log(localStorage?.sr_globalData_appChainsInfo,appChainsInfo);
    const localAppChainsInfo = localStorage?.sr_globalData_appChainsInfo ? JSON.parse(localStorage?.sr_globalData_appChainsInfo) : {}
    if (deepEqual(localAppChainsInfo, appChainsInfo)) {
      console.log('enter');
      console.log(appChainsInfo);
      const allCoinList:any = {history:[], allChain:[],bsc:[],eth:[],polygon:[],tron:[],arbitrum:[],optimistic:[],heco:[],okex:[]}
      globalData.$patch({
        allCoinList
      })
    }
    globalData.$patch({
      appChainsInfo,
      presentChain,
      privateKey,
      ownerAddress,
      ownerTronAddress
    })
})