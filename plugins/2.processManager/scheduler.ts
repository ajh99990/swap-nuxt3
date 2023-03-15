import type { ComputedRef, Ref, DefineComponent } from "vue"
import { chainInfo, Coins, } from "~~/helper/chainInfo"
import { trimCoin, changeChain, integrateParams, integrateDetails, defaultAddress, handleAmount, assembRouteList, getConfirmDom } from "./core"
import useBaseApi from "~~/api/useBaseApi";
import { getUseCoin } from "~~/modules/homePage/windowes/common";
import { getStringNum } from "~~/helper/common";
import useJudgeFun from "~~/modules/homePage/switchChain/judgeFun";

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
  slippage: number|string,
  toAddress: string
}

interface Detail {
  routeLogo?: string,
  routeName?:string,
  platform?: string,
  GasFee?: string|number,
  swapTime?: string|number,
  slippage?: any,
  youSave?: string|number,
  priceImpact?: string|number,
  TXFee?: string|number,
  receiveAddress?: string,
}

export default function () {
  const baseApi = useBaseApi()


//输入框内相关的数据
  const tradingPair:Ref<Coins[]> = ref([])
  const operateType: Ref<string> = ref('pay')
  const availableMainAmount: Ref<number> = ref(0)
//底部展示相关的数据
  const showDetail:Ref<boolean> = ref(false)
  const transactionDetails:Ref<Detail> = ref({})
  const defaultSlippage: Ref<number> = ref(1)
  const slippage:Ref<number> = ref(1)
  const receiveAddress:Ref<string> = ref('')
  const isNotClear:Ref<boolean> = ref(true)
//交易按钮相关的数据
  const loading:Ref<boolean> = ref(false)
  const isStatus:Ref<string> = ref('empty')
//历史记录展示情况
  const showHistory:Ref<boolean> = ref(true)
//跨链情况当前所选的路由
  const crossIndex: Ref<number> = ref(0)
//路由列表展示用的数组
  const showRouteArray: Ref<any[]> = ref([])
//从API获取的的数组 用于交易
  const tradeRouteArray: Ref<any[]> = ref([])
//当前选中要使用的路由
  const originalData: Ref<any> = ref({})

  const confirmPartial: Ref<string> = ref('EthPartial')

  //获取当前默认的交易对
  const getNowChain = (appChainsInfo:string) => {
    // console.log(window.location.hash);
    // 可能需要根据isMarket判断是否需要从windows取值
    tradingPair.value = chainInfo[appChainsInfo].defaultTrade
  } 

  //使用获取到的交易对
  const replaceTradingPair = (newTradingPair:Coins[])=>{
    tradingPair.value = newTradingPair
    initData()
  }

  //将界面初始化
  const initData = () => {
    stopQuery()
    loading.value = false
    isStatus.value = 'empty'
    isNotClear.value = false
    tradingPair.value[0].amount = '' 
    tradingPair.value[1].amount = ''
    showDetail.value = false
    showHistory.value = true
    transactionDetails.value = {}
    receiveAddress.value = defaultAddress(tradingPair.value, 'receive')
    slippage.value = 1
  }

  //更换交易对中的代币
  const switchSingleCoin = (coin:Coin , tradingPairIndex:number, windowType:string) => {
    stopQuery()
    const newCoin = trimCoin(coin, windowType)
    tradingPair.value[tradingPairIndex] = newCoin
    if(windowType == 'pay'){
      changeChain(getUseCoin(tradingPair.value, 'pay').chain)
    }
    confirmPartial.value = getConfirmDom(tradingPair.value)
    initData()
  }

   //更换交易对中代币的amount,并请求接口获取信息
  const giveAmount = (tradingPairIndex:number, windowType:string, amount:string|number) => {
    isNotClear.value = true
    operateType.value = windowType
    tradingPair.value[tradingPairIndex].amount = amount
    if(amount){
      if(Number(amount)) swapQuery()
    } else {
      initData()
    }
  }

  //<---开始请求接口流程
  let timer: ReturnType<typeof setTimeout>
  const swapQuery = ()=> {
    const amount = tradingPair.value.filter(item => item.type == operateType.value)[0].amount
    if(amount){
      loading.value = true
      stopQuery()      
      const timeout = tradingPair.value[0].chain == tradingPair.value[1].chain ? 30000 : 60000
      const params = integrateParams(tradingPair.value, operateType.value)
      receiveAddress.value = receiveAddress.value ? receiveAddress.value : defaultAddress(tradingPair.value, 'receive')
      params.toAddress = receiveAddress.value
      params.slippage = slippage.value == defaultSlippage.value ? defaultSlippage.value/100 : slippage.value/100
      getQuery(params, timeout)
    }
  }

  const getQuery = (params:Params, timeout:number)=> {
    baseApi.post(({ api }) => {
      return {
        api: api.queryRate,
        data:params,
        onlySend: true,
        success: async (res) => {
          if(isNotClear.value){
            //当前单链会返回对象，跨链返回路由的数组
            if(res instanceof Array){
              //组装需要在路由列表展示的数据
              showRouteArray.value = await assembRouteList(res, tradingPair.value)
              //所有原始的路由
              tradeRouteArray.value = res
              //跨链每次返回取第一个
              originalData.value = res[0]
              crossIndex.value = 0
            } else {
              originalData.value = res
            }
            transactionDetails.value = await integrateDetails(originalData.value, params.toAddress)
            slippage.value = transactionDetails.value.slippage != defaultSlippage.value ? transactionDetails.value.slippage : slippage.value
            if(transactionDetails.value.slippage != defaultSlippage.value){
              defaultSlippage.value = transactionDetails.value.slippage
            }
            inputOtherFiled(originalData.value)
            showDetail.value = true
            showHistory.value = false
            timer = setTimeout(() => {
              getQuery(params, timeout)
            }, timeout);
          }
        },
        fail:(err)=>{
          console.log(err);
          if(err.code.toString() === '301'){
            loading.value = false
            isStatus.value = 'error'
            showDetail.value = false
            showHistory.value = true
          } else if(err.code.toString() === '999') {
            loading.value = false
            isStatus.value = 'empty'
            showDetail.value = false
            showHistory.value = true
          }
        }
      }
    })
  }
  //根据不同的方式需要判断获取的方法
  const inputOtherFiled = async (data:any) => {
    const type = operateType.value == 'pay' ? 'receive' : 'pay'
    const useCoin = getUseCoin(tradingPair.value, type)
    const pairIndex = tradingPair.value.findIndex(item => item.type == useCoin.type)
    tradingPair.value[pairIndex].amount = handleAmount(data, operateType.value, useCoin.decimals)
    const payCoin = tradingPair.value.filter( item => item.type == 'pay')[0]
    const receiveCoin = tradingPair.value.filter( item => item.type == 'receive')[0]
    const payTotalAmount = getStringNum(
      await useJudgeFun(payCoin.chain, payCoin.token)
    );

    if(payCoin.token == '0x000' && payCoin.chain == receiveCoin.chain){
      judegMinMainCost(payCoin.amount)
    } else {
      const judgeBoolem = Number(payCoin.amount) <= Number(payTotalAmount)
      isStatus.value  = judgeBoolem ? 'normal' : 'noMoney'
      loading.value = false
    }
  }

  const judegMinMainCost = (payAmount:number|string)=>{
    if(availableMainAmount.value){
      const judgeBoolem = Number(payAmount) <= availableMainAmount.value
      isStatus.value  = judgeBoolem ? 'normal' : 'noMoney'
      loading.value = false
    } else {
      setTimeout(() => {
        judegMinMainCost(payAmount)
      }, 800);
    }
  }

  const stopQuery = () => {
    clearTimeout(timer)
  }
  //结束请求接口流程--->

  const designatedStatus = ()=>{
    isStatus.value = 'noMoney'
  }
  const designatedLoading = () => {
    loading.value = true
  }
  const getAvailableMainAmount = (val:number)=>{
    availableMainAmount.value = val
  }

  const editSlippage = (editSlippage:number) => {
    slippage.value = editSlippage
    swapQuery()
  }
  const editReceiveAddress = (editAddress:string) => {
    receiveAddress.value = editAddress
    swapQuery()
  }

  const addSwapTime = (val:string) => {
    transactionDetails.value.swapTime = val
  }

  const changeRoute = async (index:number) => {
    let receiveAddress = tradingPair.value.filter(item => item.type == 'receive')[0].token
    crossIndex.value = index
    originalData.value = tradeRouteArray.value[crossIndex.value]
    transactionDetails.value = await integrateDetails(originalData.value, receiveAddress)
    inputOtherFiled(originalData.value)
  }



  return {
    getNowChain,
    replaceTradingPair,
    switchSingleCoin,
    giveAmount,
    swapQuery,
    stopQuery,
    editSlippage,
    editReceiveAddress,
    initData,
    changeRoute,
    designatedStatus,
    getAvailableMainAmount,
    designatedLoading,
    addSwapTime,

    tradingPair,
    showHistory,
    showDetail,
    transactionDetails,
    defaultSlippage,
    slippage,
    receiveAddress,
    loading,
    isStatus,
    showRouteArray,
    crossIndex,
    originalData,
    operateType,
    confirmPartial
  }
}