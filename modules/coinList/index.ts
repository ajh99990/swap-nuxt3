import useGlobalData from "~~/store/useGlobalData"
import useBaseApi from "~~/api/useBaseApi"

const globalData = useGlobalData()
const baseApi = useBaseApi()

export const coinSort = (coinList:array) => {
  const privateChain = Object.keys(globalData.appChainsInfo)
  console.log(coinList);
  coinList.forEach(item => {
    console.log(item);
    
  })
}