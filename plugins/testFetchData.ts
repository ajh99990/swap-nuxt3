import useBaseApi from "@/api/useBaseApi"
export default defineNuxtPlugin(async (nuxtApp) => {
  await useBaseApi(nuxtApp).get(({ api }) => {
    return {
      api: api.tokens,
      routeParams: {
        chainId: "1702186142786103550"
      },
      success: (res) => {
        console.log('请求到的数据', res)
      }
    }
  })
})
