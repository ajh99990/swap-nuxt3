import { defineService } from "~~/helper/service"
import { judgePlatform, postMessageAppCallback } from "~~/helper/postMessage"
import { ErrorEntity } from "~~/helper/service/shared"
import BusinessCode from "./businessCode"

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

export default await defineService('baseApi', {
  api() {
    return {
      getHistorySwap:"swaps/getHistorySwap", //首页最近交易记录
      delHistorySwap: "swaps/delHistorySwap", //清空首页的最近交易
      coinList: 'swaps/query/coinType/new', //获取币种列表
      getCoinPrice: '/swaps/getCoinPrice', //获取用户对应币的余额
      queryRate: '/swaps/query/rate/v1', //获取输入框内值对应的金额
      submitHash: '/swaps/order/submit', //提交订单编号
      getDetailByOrderNo: '/swaps/order/getDetailByOrderNo', //获取订单状态
      ordePpage :"/swaps/order/page",
      // getChainList: "swaps/getChain",//获取当前项目支持的链
    }
  },
  address: {
    development: "http://aggregate-swap.y7r.cc/api",
    production: "https://swap.assure.pro/api",
    mock: "https://mock.apifox.cn/m1/607677-0-default"
  },
  axiosStatic: async () => {
    const token = await getToken()
    return {
      headers:{'token': token }
    }
  },
  isErrorResponse(res): res is ErrorEntity {
    return res.code != BusinessCode.Success
  },
  setup(instance){
    instance.interceptors.request.use(function (config) {
      // console.log("打印日志",config.url)
      return config;
    })
  }
})

// instance.interceptors.request.use(function (config) {
//   console.log("打印日志",config.url)
//   return config;
// })

// export default instance
