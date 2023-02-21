import { defineService } from "@/modules/axiosService"
import { ErrorEntity } from "@/modules/axiosService/shared"
import BusinessCode from "./businessCode"
export default defineService('baseApi', {
  api() {
    return {
      chainList: "chain/list",//链列表
      tokens: "chain/{chainId}/tokens",//链上所有代币组成的列表
      buy: "buy" //购买代币
    }
  },
  address: {
    development: "https://mock.apifox.cn/m1/607677-0-default/",
    production: "https://mock.apifox.cn/m1/607677-0-default/",
    mock: "https://mock.apifox.cn/m1/607677-0-default/"
  },
  axiosStatic: () => {
    return {
      headers: { 'X-Custom-Header': 'foobar' }
    }
  },
  isErrorResponse(res): res is ErrorEntity {
    return res.code !== BusinessCode.Success
  },
  setup(instance) {
    instance.interceptors.request.use(function (config) {
      console.log("打印日志", config.url)
      return config;
    })
  }
})

