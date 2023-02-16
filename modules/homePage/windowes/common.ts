import useGlobalData from "~~/store/useGlobalData";

export function checkChain(chain:string): boolean {
    const globalData = useGlobalData()
    const keys = Object.keys(globalData.appChainsInfo)
    return !keys.includes(chain)
}
