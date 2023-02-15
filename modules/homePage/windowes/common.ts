import useGlobalData from "~~/store/useGlobalData";

export function checkChain(chain:string): boolean {
    const globalData = useGlobalData()
    const keys = Object.keys(globalData.appChainsInfo)
    return !keys.includes(chain)
}

export function buildParams(order:boolean, type:string, number:string|number){
	const tradingPair = useNuxtApp().$managerScheduler.tradingPair.value;
    console.log(tradingPair);
}