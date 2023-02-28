import type { ComputedRef, Ref, DefineComponent } from "vue"
import { chainInfo, Coins, } from "~~/helper/chainInfo"
import { trimCoin, changeChain, integrateParams, integrateDetails, defaultAddress, handleAmount, assembRouteList } from "./core"
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
  receiveAddress: string
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
  const operateType: Ref<string> = ref('')
//底部展示相关的数据
  const showDetail:Ref<boolean> = ref(false)
  const transactionDetails:Ref<Detail> = ref({})
  const defaultSlippage: Ref<number> = ref(0)
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
    loading.value = true
    stopQuery()
    const timeout = tradingPair.value[0].chain == tradingPair.value[1].chain ? 30000 : 60000
    const params = integrateParams(tradingPair.value, operateType.value)
    receiveAddress.value = receiveAddress.value ? receiveAddress.value : defaultAddress(tradingPair.value, 'receive')
    params.receiveAddress = receiveAddress.value
    params.slippage = slippage.value == defaultSlippage.value ? defaultSlippage.value/100 : slippage.value/100
    getQuery(params, timeout)
  }

  const getQuery = (params:Params, timeout:number)=> {
    baseApi.post(({ api }) => {
      return {
        api: api.queryRate,
        data:params,
        onlySend: true,
        success: (res) => {
          if(isNotClear.value){
          let data
          //当前单链会返回对象，跨链返回路由的数组
          if(res instanceof Array){
            showRouteArray.value = assembRouteList(res)
            tradeRouteArray.value = res
            //跨链每次返回取第一个
            data = res[0]
            crossIndex.value = 0
          } else {
            data = res
          }
          transactionDetails.value = integrateDetails(data, params.receiveAddress)
          slippage.value = transactionDetails.value.slippage != defaultSlippage.value ? transactionDetails.value.slippage : slippage.value
          defaultSlippage.value = transactionDetails.value.slippage
          inputOtherFiled(data)
          showDetail.value = true
          showHistory.value = false
          timer = setTimeout(() => {
            getQuery(params, timeout)
          }, timeout);
          }
        },
        fail:(err)=>{
          if(err.code.toString() === '301'){
            loading.value = false
            isStatus.value = 'error'
            showDetail.value = false
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
    const payTotalAmount = getStringNum(
      await useJudgeFun(payCoin.chain, payCoin.token)
    );
    if(Number(payCoin.amount) < Number(payTotalAmount)){
      isStatus.value = 'normal'
    } else {
      isStatus.value = 'noMoney'
    }
    loading.value = false
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
    replaceTradingPair,
    switchSingleCoin,
    giveAmount,
    stopQuery,
    editSlippage,
    editReceiveAddress,
    initData,

    tradingPair,
    showHistory,
    showDetail,
    transactionDetails,
    defaultSlippage,
    slippage,
    receiveAddress,
    loading,
    isStatus
  }
}