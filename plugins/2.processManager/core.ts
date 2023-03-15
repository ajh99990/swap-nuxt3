import { Coin } from "./scheduler";
import { Coins, } from "~~/helper/chainInfo"
import useGlobalData from "~~/store/useGlobalData"
import { addChain, approve } from "~~/helper/eth";
import BigNumber from "bignumber.js";
import { scientificString, getAmountToUsdt } from "~~/helper/common";
import { ETHChain, TRONChain } from "~~/helper/chainInfo";
import { simplifyToken, getStringNum } from "~~/helper/common";
import { getSwftAllowance, swftEthEstimateGas, approveSwftEstimateGas } from '~~/helper/swftBridge'
import useBaseApi from "~~/api/useBaseApi";

export function trimCoin (coin:Coin, windowType:string){
  return {
    type: windowType,
    chain: coin.chain,
    symbol: coin.coinName,
    token: coin.token,
    decimals: coin.decimals,
    logo: coin.logo,
    amount: "",
  }
}

export function changeChain (chain:string) {
  const globalData = useGlobalData()
  if(chain != globalData.presentChain && chain != 'tron'){
    addChain(chain)
  }
  globalData.$patch({
    presentChain: chain
  })
}

export function integrateParams (tradingPair:Coins[], windowType:string) {
  const payCoin = tradingPair[0].type == 'pay' ? tradingPair[0] : tradingPair[1]
  const receiveCoin = tradingPair[0].type == 'receive' ? tradingPair[0] : tradingPair[1]
  const params = {
    amount0In: windowType == 'pay' ? scientificString(BigNumber(payCoin.amount).shiftedBy(payCoin.decimals).toNumber()) : "", 
    amount1Out: windowType == 'receive' ? scientificString(BigNumber(receiveCoin.amount).shiftedBy(receiveCoin.decimals).toNumber()) : "",
    chain_token0: payCoin.chain,
    chain_token1: receiveCoin.chain,
    token0: payCoin.token,
    token1: receiveCoin.token,
    userSymbol0: payCoin.symbol,
    userSymbol1: receiveCoin.symbol,
    fromAddress: defaultAddress(tradingPair, 'pay'),
    slippage: 0,
    toAddress: defaultAddress(tradingPair, 'receive'),
  }
  return params
}

export function defaultAddress (tradingPair:Coins[], type:string):string {
  const globalData = useGlobalData()
  const receiveCoin = tradingPair.filter(item => item.type == type)[0]
  if(ETHChain.includes(receiveCoin.chain)) return globalData.ownerAddress
  if(TRONChain.includes(receiveCoin.chain)) return globalData.ownerTronAddress
  return ''
}

export function handleAmount (data:any, operateType:string, decimals:number ):number {
  if(data.bridgeMark){
    if(data.bridgeMark == 'SOCKET'){
      return BigNumber(data.toAmount).shiftedBy(-decimals).toNumber()
    }
    if(data.bridgeMark == 'LIFI'){
      return BigNumber(data.toAmount).shiftedBy(-decimals).toNumber()
    }
    if(data.bridgeMark == 'SWFT'){
      return data.toTokenAmount
    }
  } else {
    if(operateType == 'pay'){
      return BigNumber(data.amountOut).shiftedBy(-decimals).toNumber()
    } else {
      return BigNumber(data.amountIn).shiftedBy(-decimals).toNumber()
    }
  }
  return 0
}

export async function integrateDetails (data:any, receiveAddress:string) {
  let crossData, slippageVal
  if(data.bridgeMark){
    slippageVal = 1
    if(data.bridgeMark == 'SOCKET'){
      crossData = handleSocketData(data)
    }
    if(data.bridgeMark == 'LIFI'){
      crossData = HandleLifiData(data)
    }
    if(data.bridgeMark == 'SWFT'){
      crossData = await HandleSwftData(data)
    }
  }
  const priceImpact = data.price < 0.0001 ? 0.01 : Number(getStringNum(data.price * 100, 2));
  slippageVal = priceImpact > 0.8 ? getStringNum(priceImpact * 1.2, 2) : 1
  return {
    routeLogo: crossData?.routeLogo,
    routeName: crossData?.routeName,
    platform: data?.swapLogo,
    GasFee: crossData?.GasFee,
    swapTime: crossData?.swapTime,
    slippage: slippageVal && slippageVal > 100 ? 100 : slippageVal,
    youSave: data.save ? getStringNum(data.save, 2): "",
    priceImpact: priceImpact,
    TXFee: '0.3%',
    receivingAddress: simplifyToken(receiveAddress),
  }
}

function handleSocketData (data:any) {
  const routeName = data.userTxs[0].steps[0].type == 'bridge' ? data.userTxs[0].steps[0].protocol.name : data.userTxs[0].steps[1].protocol.name
  return {
    routeLogo: `https://swap-jp.s3-accelerate.amazonaws.com/file/${data.bridgeMark}/${routeName}.png`,
    routeName: routeName,
    GasFee: getStringNum(data.totalGasFeesInUsd, 3),
    swapTime: (data.serviceTime/60),
  }
}

function HandleLifiData (data:any) {
  return {
    routeLogo: `https://swap-jp.s3-accelerate.amazonaws.com/file/${data.bridgeMark}/${data.steps[0].toolDetails.key}.png`,
    routeName: data.steps[0].toolDetails.name,
    GasFee: data.gasCostUSD,
    swapTime: getLifiTime(data.steps),
  }
}

async function HandleSwftData (data:any) {
  const tradingPair:Coins[] = useNuxtApp().$managerScheduler.tradingPair.value
  const payCoin = tradingPair.filter(item => item.type == 'pay')[0]
  let allowance
  if(payCoin.token != '0x000'){
    allowance = await getSwftAllowance(data)
  }
  let GasLimit:number|string = 2, Str:string = 'bsc_0x55d398326f99059ff775485246999027b3197955'
  if(ETHChain.includes(payCoin.chain)){
  Str = `${payCoin.chain}_0x000`;
    if(allowance > 0 || payCoin.token == '0x000'){
      GasLimit = await swftEthEstimateGas(data)
    } else {
      GasLimit = await approveSwftEstimateGas(data, payCoin)
    }
  }
  if(TRONChain.includes(payCoin.chain)){
    Str = `tron_0x000`;
    GasLimit = 30
  }

  const baseApi = useBaseApi()
  const usdtReta = await baseApi.post(({ api }) => {
    return {
      api: api.getCoinPrice,
      data: [Str],
    };
  });

  console.log('swft单独计算的gasFee', usdtReta[Str] ,getStringNum(Number(GasLimit) * usdtReta[Str], 2));

  return {
    routeLogo: 'https://swap-jp.s3-accelerate.amazonaws.com/file/SWFT/swft.png',
    routeName: 'Swft',
    GasFee: Number(GasLimit) * usdtReta[Str] > 0.1 ? getStringNum(Number(GasLimit) * usdtReta[Str], 2) : 0.1,
    swapTime: data.estimatedTime * 3,
  }
}

function getLifiTime(array:any[]) {
  let time = 0
  array.map(item=>{
    time = time + item.estimate.executionDuration
  })
  return Math.ceil(time / 60)
}

export async function assembRouteList(array:any[], tradingPair:Coins[]){
  const payCoin:Coins = tradingPair.filter(item => item.type == 'pay')[0]
  const receiveCoin:Coins = tradingPair.filter(item => item.type == 'receive')[0]
  let receiveToUsdt = await getAmountToUsdt(receiveCoin.chain, receiveCoin.token)
  let routeArray:any[] = []
  array.map((item, index) => {
    if(item.bridgeMark == 'LIFI'){
      routeArray.push({
        payLogo: payCoin.logo,
        paySymbol: payCoin.symbol,
        payChain: payCoin.chain,
        receiveLogo: receiveCoin.logo,
        receiveSymbol: receiveCoin.symbol,
        receiveChain: receiveCoin.chain,

        bridgeMark: item.bridgeMark,
        routeName: item.steps[0].toolDetails.name,
        routeKey: item.steps[0].toolDetails.key,
        GasFee: item.gasCostUSD,
        useTime: getLifiUseTime(item.steps),
        toAmount: getStringNum(BigNumber(item.toAmount).shiftedBy(-receiveCoin.decimals).toString(), receiveCoin.decimals > 8 ? 8 : receiveCoin.decimals),
        toAmountUSD: item.toAmountUSD,
        bridgeOne: item.steps[0].includedSteps.length == 1 ? '' : item.steps[0].includedSteps[0].type == 'cross' ? item.steps[0].includedSteps[1].toolDetails.name : item.steps[0].includedSteps[0].toolDetails.name,
        bridgeTwo: item.steps[1]?.includedSteps[0].toolDetails.name || '',
        showChannel: false
      })
    }
    if(item.bridgeMark == 'SOCKET'){
      let receiveAmount = getStringNum(BigNumber(item.toAmount).shiftedBy(-receiveCoin.decimals).toString(), receiveCoin.decimals > 8 ? 8 : receiveCoin.decimals)
      routeArray.push({
        payLogo: payCoin.logo,
        paySymbol: payCoin.symbol,
        payChain: payCoin.chain,
        receiveLogo: receiveCoin.logo,
        receiveSymbol: receiveCoin.symbol,
        receiveChain: receiveCoin.chain,

        bridgeMark: item.bridgeMark,
        routeName: item.userTxs[0].steps[0].type == 'bridge' ? item.userTxs[0].steps[0].protocol.displayName : item.userTxs[0].steps[1].protocol.displayName,
        routeKey: item.userTxs[0].steps[0].type == 'bridge' ? item.userTxs[0].steps[0].protocol.name : item.userTxs[0].steps[1].protocol.name,
        GasFee: getStringNum(item.totalGasFeesInUsd, 2),
        useTime: item.serviceTime/60,
        toAmount: receiveAmount,
        toAmountUSD: getStringNum( Number(receiveAmount) * receiveToUsdt, 2),
        bridgeOne: item.userTxs[0].steps[0].type == 'bridge' ? "" : item.userTxs[0].steps[0].protocol.displayName,
        bridgeTwo: item.userTxs[1] ? item.userTxs[1].protocol.displayName : '',
        showChannel: false
      })
    }
    if(item.bridgeMark == 'SWFT' && index == 0){
      routeArray.push({
        payLogo: payCoin.logo,
        paySymbol: payCoin.symbol,
        payChain: payCoin.chain,
        receiveLogo: receiveCoin.logo,
        receiveSymbol: receiveCoin.symbol,
        receiveChain: receiveCoin.chain,

        bridgeMark: item.bridgeMark,
        routeName: 'SWFT',
        routeKey: 'swft',
        GasFee: getStringNum( Number(item.chainFee) * receiveToUsdt, 2),
        useTime: item.estimatedTime * 3,
        toAmount: item.toTokenAmount,
        toAmountUSD: getStringNum( Number(item.toTokenAmount) * receiveToUsdt, 2),
        bridgeOne: '',
        bridgeTwo: '',
        showChannel: false
      })
    }
  })
  return routeArray
}

function getLifiUseTime(steps:any[]){
  let time = 0
  steps.map(item=>{
    time += item.estimate.executionDuration
  })
  return Math.ceil(time / 60)
}

export function getConfirmDom(tradingPair:Coins[]):string{
  let dom:string = 'EthPartial'
  if(tradingPair[0].chain == tradingPair[1].chain){
    if(ETHChain.includes(tradingPair[0].chain)){
      dom = 'EthPartial'
    }
    if(TRONChain.includes(tradingPair[0].chain)){
      dom = 'TronPartial'
    }
  }else{
    dom = 'CrossPartial'
  }
  return dom
}