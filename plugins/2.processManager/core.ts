import { Coin } from "./scheduler";
import { Coins, } from "~~/helper/chainInfo"
import useGlobalData from "~~/store/useGlobalData"
import { addChain } from "~~/helper/eth";
import BigNumber from "bignumber.js";
import { scientificString } from "~~/helper/common";
import { ETHChain, TRONChain } from "~~/helper/chainInfo";
import { simplifyToken, getStringNum } from "~~/helper/common";
// import useBaseApi from "~~/api/useBaseApi";

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
  // console.log(tradingPair, windowType);
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
      fromAddress: defaultAddress(),
      slippage: 0,
      receiveAddress: defaultAddress(),
    }
    return params
}

export function defaultAddress ():string {
  const globalData = useGlobalData()
  if(ETHChain.includes(globalData.presentChain)) return globalData.ownerAddress
  if(TRONChain.includes(globalData.presentChain)) return globalData.ownerTronAddress
  return ''
}

export function handleAmount (data:any, operateType:string, decimals:number ):number {
  if(data.bridgeMark){
    if(data.bridgeMark == 'SOCKET'){
      return BigNumber(data.toAmount).shiftedBy(-decimals).toNumber()
    }
    if(data.bridgeMark == 'LIFI'){
      return BigNumber(data.amountOut).shiftedBy(-decimals).toNumber()
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

export function integrateDetails (data:any, receiveAddress:string) {
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
      crossData = HandleSwftData(data)
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
    swapTime: (data.serviceTime/60) + 'mins',
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
function HandleSwftData (data:any) {
  return {
    routeLogo: data.logoUrl,
    routeName: data.dex,
    GasFee: data.chainFee,
    swapTime: data.estimatedTime * 3 + ' min',
  }
}

function getLifiTime(array:any[]) {
  let time = 0
  array.map(item=>{
    time = time + item.estimate.executionDuration
  })
  return Math.ceil(time / 60) + 'mins'
}

// export async function getQuery (payCoin:Coins,receiveCoin:Coins) {
//   const baseApi = useBaseApi()
//   console.log('getQuery', payCoin, receiveCoin);
  
// }