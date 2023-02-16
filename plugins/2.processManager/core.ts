import { Coin } from "./scheduler";
import { Coins, } from "~~/helper/chainInfo"
import useGlobalData from "~~/store/useGlobalData"
import { addChain } from "~~/helper/eth";
import BigNumber from "bignumber.js";
import { scientificString } from "~~/helper/common";
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

export function integrateParams (payCoin:Coins, receiveCoin:Coins, windowType:string) {
    const params = {
      amount0In: windowType == 'pay' ? scientificString(BigNumber(payCoin.amount).shiftedBy(payCoin.decimals).toNumber()) : "", 
      amount1Out: windowType == 'receive' ? scientificString(BigNumber(receiveCoin.amount).shiftedBy(receiveCoin.decimals).toNumber()) : "",
      chain_token0: payCoin.chain,
      chain_token1: receiveCoin.chain,
      token0: payCoin.token,
      token1: receiveCoin.token,
      userSymbol0: payCoin.symbol,
      userSymbol1: receiveCoin.symbol,
    }  
    return params
}

export function integrateDetails (data) {
  console.log(data);
}

// export async function getQuery (payCoin:Coins,receiveCoin:Coins) {
//   const baseApi = useBaseApi()
//   console.log('getQuery', payCoin, receiveCoin);
  
// }