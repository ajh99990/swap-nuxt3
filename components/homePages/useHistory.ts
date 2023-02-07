import useBaseApi from "@/api/useBaseApi"
import useGlobalData from "~~/store/useGlobalData"

export default function () {
  const baseApi = useBaseApi;
  const historyList = ref([])
  const globalData = useGlobalData()

  onBeforeMount(() => {
    fetchHistoryList()
  })

  const fetchHistoryList = () => {
    baseApi.get(({ api }) => {
      return {
        api: api.getHistorySwap,
        params:{
          chain: globalData.presentChain,
          address: globalData.ownerAddress
        },
        success: (res, config) => {
          historyList.value = res
        }
      }
    })
  }

  const deleteHistory = () => {
    baseApi.delete(({ api }) => {
      return {
        api: api.delHistorySwap,
        data:{
          chain: globalData.presentChain,
          address: globalData.ownerAddress
        },
        success: () => {
          fetchHistoryList()
        }
      }
    })
    
  }
  
  return { historyList, deleteHistory }
}