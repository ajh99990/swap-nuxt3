import type { ComputedRef, Ref, DefineComponent } from "vue"
import { chainInfo, Coins, } from "~~/helper/chainInfo"
import { trimCoin, changeChain, integrateParams, integrateDetails } from "./core"
import useBaseApi from "~~/api/useBaseApi";

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
interface Params {
  amount0In: string|number, 
  amount1Out: string|number,
  chain_token0: string,
  chain_token1: string,
  token0: string,
  token1: string,
  userSymbol0: string,
  userSymbol1: string,
}

interface Detail {

}

export default function () {
  const baseApi = useBaseApi()

  const tradingPair:Ref<Coins[]> = ref([])
  const transactionDetails: Ref<Detail> = ref({})

  const getNowChain = (appChainsInfo:string) => {
    tradingPair.value = chainInfo[appChainsInfo].defaultTrade
  } 

  //更换交易对中的代币
  const switchSingleCoin = (coin:Coin , order:boolean, windowType:string) => {
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
        if(Number(amount)){
          swapQuery(tradingPair.value[0],tradingPair.value[1], windowType)
        }
      } else {
        tradingPair.value[1].amount = amount
        if(Number(amount)){
          swapQuery(tradingPair.value[1],tradingPair.value[0], windowType)
        }
      }
    } else {
      if(order){
        tradingPair.value[1].amount = amount
        if(Number(amount)){
          swapQuery(tradingPair.value[0],tradingPair.value[1], windowType)
        }
      } else {
        tradingPair.value[0].amount = amount
        if(Number(amount)){
          swapQuery(tradingPair.value[1],tradingPair.value[0], windowType)
        }
      }
    }
  }

  let timer: ReturnType<typeof setTimeout>

  const swapQuery = (payCoin:Coins, receiveCoin:Coins, windowType:string)=> {
    const timeout = payCoin.chain == receiveCoin.chain ? 10000 : 60000
    const params = integrateParams(payCoin, receiveCoin, windowType)
    startQuery(params, timeout)
  }

  const getQuery = (params:Params)=> {
    baseApi.post(({ api }) => {
      return {
        api: api.queryRate,
        data:params,
        onlySend: true,
        success: (res, config) => {
          console.log(res);
          integrateDetails(res)
          // transactionDetails.value = 
        }
      }
    })
  }

  const startQuery = (params:Params, timeout:number) => {
    getQuery(params)
    timer = setTimeout(() => {
      startQuery(params, timeout)
    }, timeout);
  }

  const stopQuery = () => {
    clearTimeout(timer)
  }



  return {
    getNowChain,
    switchSingleCoin,
    giveAmount,
    stopQuery,

    tradingPair
  }
}