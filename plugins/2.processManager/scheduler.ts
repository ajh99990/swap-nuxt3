import type { ComputedRef, Ref, DefineComponent } from "vue"
import { chainInfo, Coins, } from "~~/helper/chainInfo"
import { trimCoin, changeChain, swapsQuery } from "./core"

export interface Coin {
  balance: string | number,
  chain: string,
  coinName: string,
  decimals: number,
  logo: string,
  token: string,
  totalAmount: string | number,
  userAdd: boolean,
}

export default function () {
  const tradingPair:Ref<Coins[]> = ref([])

  const getNowChain = (appChainsInfo:string) => {
    tradingPair.value = chainInfo[appChainsInfo].defaultTrade
  } 

  //更换交易对中的代币
  const switchCoin = (coin:Coin , order:boolean, windowType:string) => {
    const newCoin = trimCoin(coin, windowType)
    if(windowType == 'pay'){
      if(order){
        tradingPair.value[0] = newCoin
      } else {
        tradingPair.value[1] = newCoin
      }
      changeChain(coin.chain)
    } else {
      if(order){
        tradingPair.value[1] = newCoin
      } else {
        tradingPair.value[0] = newCoin
      }
    }
  }

   //更换交易对中代币的amount,并请求接口获取信息
   const giveAmount = (order:boolean, windowType:string, amount:string|number) => {
    if(windowType == 'pay'){
      if(order){
        tradingPair.value[0].amount = amount
        swapsQuery(tradingPair.value[0],tradingPair.value[1])
      } else {
        tradingPair.value[1].amount = amount
        swapsQuery(tradingPair.value[1],tradingPair.value[0])
      }
    } else {
      if(order){
        tradingPair.value[1].amount = amount
        swapsQuery(tradingPair.value[0],tradingPair.value[1])
      } else {
        tradingPair.value[0].amount = amount
        swapsQuery(tradingPair.value[1],tradingPair.value[0])
      }
    }
  }

  return {
    getNowChain,
    switchCoin,
    giveAmount,

    tradingPair
  }
}