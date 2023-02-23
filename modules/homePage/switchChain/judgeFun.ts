import { getBalance } from "~~/helper/eth/index";
import { getTokenBalanceByBatch } from "~~/helper/eth/getMulticallInfo";
import { getTronCoinBalance } from "~~/helper/tron/index"
import useGlobalData from "~~/store/useGlobalData";
import { ETHChain, TRONChain } from "~~/helper/chainInfo";


export default async function (type:string, token:string|string[]) {
const globalData = useGlobalData()
  if(ETHChain.includes(type)){
    if(token instanceof Array){
      return await getTokenBalanceByBatch(type, token, globalData.ownerAddress)
    } else {
      const isMaster = token == '0x000'
      return await getBalance(type, token, isMaster, globalData.ownerAddress)
    }
  }
  if(TRONChain.includes(type)){
      return await getTronCoinBalance(token)
  }
}