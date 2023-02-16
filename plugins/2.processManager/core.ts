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
    globalData.$patch({
      presentChain: chain
    })
  }
}

export function integrateParams (tradingPair:Coins[], windowType:string) {
  console.log(tradingPair, windowType);
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
      slippage: 0,
      receiveAddress: '',
      fromAddress: ''
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
  } else {
    if(operateType == 'pay'){
      return BigNumber(data.amountOut).shiftedBy(-decimals).toNumber()
    } else {
      return BigNumber(data.amountIn).shiftedBy(-decimals).toNumber()
    }
  }
  return 0
}

export function integrateDetails (data:any, slippage:number, receiveAddress:string) {
  let crossData
  if(data.bridgeMark){
    if(data.bridgeMark == 'SOCKET'){
      crossData = handleSocketData(data)
    }
    if(data.bridgeMark == 'LIFI'){
      crossData = HandleLifiData(data)
    }
  }
  return {
    routeLogo: crossData?.routeLogo,
    routeName: crossData?.routeName,
    platform: data?.swapLogo,
    GasFee: crossData?.GasFee,
    swapTime: crossData?.swapTime,
    slippage: slippage,
    youSave: data.save ? getStringNum(data.save, 2): "",
    priceImpact: data?.price,
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
    routeLogo: '',
    routeName: '',
    GasFee: '',
    swapTime: '',
  }
}

// export async function getQuery (payCoin:Coins,receiveCoin:Coins) {
//   const baseApi = useBaseApi()
//   console.log('getQuery', payCoin, receiveCoin);
  
// }