import { judgePlatform, postMessageAppCallback } from "~~/helper/postMessage"
import { chainInfo, ChainInfo } from "~~/helper/chainInfo"
import { AppChainsInfo } from "~~/store/useGlobalData"

export default async function() {
  let appChainsInfo:AppChainsInfo = {}
  if (judgePlatform('getChainsInfo')) {
        appChainsInfo = await postMessageAppCallback('getChainsInfo')
      } else {
        const chainInfoArray:ChainInfo[] = Object.values(chainInfo)
        const chainKeysArray:string[] = Object.keys(chainInfo)
        chainInfoArray.map((item:ChainInfo, index:number )=>{
          // if(chainKeysArray[index] == 'tron'){
            appChainsInfo[chainKeysArray[index]] = {rpc:item.rpc}
          // }
        })
      }
  return appChainsInfo
}