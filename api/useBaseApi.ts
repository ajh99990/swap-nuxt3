import { defineService } from "~~/modules/service"
import { judgePlatform, postMessageAppCallback } from "~~/helper/postMessage"

let token:string

export const getToken = async () => {
  if (token) return token
  if (judgePlatform('getToken')) {
    token = await postMessageAppCallback('getToken')
    return token
  } else {
    return 'e6f8008c-a954-4d12-ae09-8254618f5888'
    // return 'ef21c59b-ead7-4ab0-a8f5-fd467f03295c'
  }
}

export default defineService('baseApi', {
  api() {
    return {
      getHistorySwap:"swaps/getHistorySwap",//首页最近交易记录
      delHistorySwap: "swaps/delHistorySwap",//清空首页的最近交易
      coinList: 'swaps/query/coinType/new',//获取币种列表
      getCoinPrice: '/swaps/getCoinPrice', //获取用户对应币的余额
      // getChainList: "swaps/getChain",//获取当前项目支持的链
      // chainList: "chain/list",//链列表
      // tokens: "chain/{chainId}/tokens",//链上所有代币组成的列表
      // buy:"buy" //购买代币
    }
  },
  address: {
    development: "http://aggregate-swap.y7r.cc/api",
    production: "https://swap.assure.pro/api",
    mock: "https://mock.apifox.cn/m1/607677-0-default"
  },
  axiosStatic:{
    headers:{'token': await getToken()}
  },
  setup(instance){
    instance.interceptors.request.use(function (config) {
      console.log("打印日志",config.url)
      return config;
    })
  }
})

// instance.interceptors.request.use(function (config) {
//   console.log("打印日志",config.url)
//   return config;
// })

// export default instance
