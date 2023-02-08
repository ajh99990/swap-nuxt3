import useBaseApi from "@/api/useBaseApi"
import type { Ref } from "vue-demi"

export default function ({ selectedChain }: { selectedChain: Ref<string> }) {
  const baseApi = useBaseApi();

  type Token = { id: string, name: string }
  const tokens = ref<Array<Token>>([])
  const loading = ref(false)
  watch(selectedChain, () => {
    fetchTokens(selectedChain.value)
  })

  const tokensString = computed(() => {
    return tokens.value.map(token => token.name).join(",")
  })

  const fetchTokens = (selectedChain: string) => {
    loading.value = true
    baseApi.get(({ api }) => {
      return {
        api: api.tokens,
        routeParams: {
          chainId: selectedChain
        },
        success: (res) => {
          tokens.value = res
        },
        complete: () => {
          loading.value = false
        }
      }
    })
  }

  return { tokensString, loading }
}