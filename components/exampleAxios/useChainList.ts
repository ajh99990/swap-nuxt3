import useBaseApi from "@/api/useBaseApi"

export default function () {
  const baseApi = useBaseApi();
  type Chain = { id: string, name: string }
  const chainList = ref<Array<Chain>>([])
  const selectedChain = ref("")

  watch(chainList, () => {
    //列表变化时检查选择器的值，如果没有选中任何值则设置值为chainList中的第一项
    if (!selectedChain.value && chainList.value.length > 0) {
      selectedChain.value = chainList.value[0].id
    }
  })

  onBeforeMount(() => {
    fetchChainList()
  })

  const fetchChainList = () => {
    baseApi.get(({ api, mode }) => {
      return {
        api: api.chainList,
        success: (res, config) => {
          chainList.value = res
        }
      }
    })
  }
  return { chainList, selectedChain }
}