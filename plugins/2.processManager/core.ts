import { Coin } from "./scheduler";
import { Coins, } from "~~/helper/chainInfo"
import useGlobalData from "~~/store/useGlobalData"
import { addChain } from "~~/helper/eth";
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
    globalData.$patch({
      presentChain: chain
    })
  }
}

export async function swapsQuery (payCoin:Coins,receiveCoin:Coins) {
  const baseApi = useBaseApi()
  console.log(payCoin, receiveCoin);
  
}