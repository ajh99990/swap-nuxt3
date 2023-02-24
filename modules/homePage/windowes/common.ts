import { Coins, chainInfo } from "~~/helper/chainInfo";
import useGlobalData from "~~/store/useGlobalData";
import useGoplusApi from "~~/api/useGoPlusApi";
import { ETHChain } from "~~/helper/chainInfo";

export function checkChain(chain:string): boolean {
    const globalData = useGlobalData()
    const keys = Object.keys(globalData.appChainsInfo)
    return !keys.includes(chain)
}

export function getUseCoin (tradingPair:Coins[], type:string) {
    return tradingPair.filter(item => item.type == type)[0]
}   

async function showErrorStyle (chain:string, token:string) {
    const goplusApi = useGoplusApi()
    const chainId = ETHChain.includes(chain) ? chainInfo[chain].chainId : chain
    const data = await goplusApi.get(({ api }) => {
        return {
          api: api.tokenSecurity,
          params:{
            contract_addresses: token,
          },
          routeParams:{
            chainId: chainId
          }
        }
      }) 
    return data[token]
}
  
//获取合约检测危险数量
const dangerProp = ["is_honeypot"];
const whiteList = ["0xdac17f958d2ee523a2206206994597c13d831ec7"]
export const getDangerNum = async (chain:string, token:string,) => {
    if (whiteList.includes(token) || token == '0x000') return 0
    const data:any = await showErrorStyle(chain, token)
    let danger = dangerProp, score = 0
    danger.forEach((item) => {
        if (item.includes("_reverse")) {
        score += Number(data?.[item.replace("_reverse", "")]) || 0;
        } else {
        score += Number(data?.[item]) || 0;
        }
    });
    score += Number(data?.buy_tax) >= 0.5 ? 1 : 0;
    score += Number(data?.sell_tax) >= 0.5 ? 1 : 0;
    return score
};