import { getBalance } from "~~/helper/eth/index";
import { getTokenBalanceByBatch } from "~~/helper/eth/getMulticallInfo";
import { getTronCoinBalance } from "~~/helper/tron/index"
import useGlobalData from "~~/store/useGlobalData";

const ETH:string[] = ['bsc', 'eth', 'polygon', "arbitrum", "optimistic", "heco", "okex" ]
const TRON:string[] = ['tron']
const globalData = useGlobalData()

export default async function (type:string, token:string|string[]) {
  if(ETH.includes(type)){
    if(token instanceof Array){
      return await getTokenBalanceByBatch(type, token, globalData.ownerAddress)
    } else {
      return await getBalance(type, '0x000', true, globalData.ownerAddress)
    }
  }
  if(TRON.includes(type)){
      return await getTronCoinBalance(token)
  }
}