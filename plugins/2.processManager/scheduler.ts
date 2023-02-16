import type { ComputedRef, Ref, DefineComponent } from "vue"
import { chainInfo, Coins, } from "~~/helper/chainInfo"
import { trimCoin, changeChain, integrateParams, integrateDetails, defaultAddress, handleAmount } from "./core"
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
  slippage: number,
  receiveAddress: string
}

interface Detail {

}

export default function () {
  const baseApi = useBaseApi()

  const tradingPair:Ref<Coins[]> = ref([])
  const showDetail:Ref<boolean> = ref(false)
  const transactionDetails: Ref<Detail> = ref({})
  const slippage: Ref<number> = ref(0.01)
  const receiveAddress: Ref<string> = ref('')
  const operateType: Ref<string> = ref('')
  const crossIndex: Ref<number> = ref(0)

  //获取当前默认的交易对
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
    stopQuery()
    operateType.value = windowType
    receiveAddress.value = defaultAddress()
    if(windowType == 'pay'){
      if(order){
        tradingPair.value[0].amount = amount
      } else {
        tradingPair.value[1].amount = amount
      }
    } else {
      if(order){
        tradingPair.value[1].amount = amount
      } else {
        tradingPair.value[0].amount = amount
      }
    }
    console.log(tradingPair.value);
    if(Number(amount)){
      swapQuery()
    }
  }

  //<---开始请求接口流程
  let timer: ReturnType<typeof setTimeout>
  const swapQuery = ()=> {
    const timeout = tradingPair.value[0].chain == tradingPair.value[1].chain ? 10000 : 60000
    const params = integrateParams(tradingPair.value, operateType.value)
    params.slippage = slippage.value
    params.receiveAddress = receiveAddress.value
    params.fromAddress = defaultAddress()
    getQuery(params, timeout)
  }

  const getQuery = (params:Params, timeout:number)=> {
    baseApi.post(({ api }) => {
      return {
        api: api.queryRate,
        data:params,
        onlySend: true,
        success: (res) => {
          let data
          if(res instanceof Array){
            data = res[0]
          } else {
            data = res
          }
          crossIndex.value = 0
          transactionDetails.value = integrateDetails(data, slippage.value, receiveAddress.value)
          inputOtherFiled(data)
          showDetail.value = true
          timer = setTimeout(() => {
            getQuery(params, timeout)
          }, timeout);
        }
      }
    })
  }

  const inputOtherFiled = (data:any) => {
    if(tradingPair.value[0].type == 'pay'){
      if(operateType.value == 'pay'){
        tradingPair.value[1].amount = handleAmount(data, operateType.value, tradingPair.value[1].decimals)
      } else {
        tradingPair.value[0].amount = handleAmount(data, operateType.value, tradingPair.value[0].decimals)
      }
    } else {
      if(operateType.value == 'pay'){
        tradingPair.value[0].amount = handleAmount(data, operateType.value, tradingPair.value[0].decimals)
      } else {
        tradingPair.value[1].amount = handleAmount(data, operateType.value, tradingPair.value[1].decimals)
      }
    }
  }

  const stopQuery = () => {
    clearTimeout(timer)
  }
  //结束请求接口流程--->

  const editSlippage = (editSlippage:number) => {
    slippage.value = editSlippage
    swapQuery()
  }
  const editReceiveAddress = (editAddress:string) => {
    receiveAddress.value = editAddress
    swapQuery()
  }



  return {
    getNowChain,
    switchSingleCoin,
    giveAmount,
    stopQuery,
    editSlippage,
    editReceiveAddress,

    tradingPair,
    showDetail,
    transactionDetails
  }
}