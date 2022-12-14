import { defineService } from "./service"
export default defineService('baseApi', {
  api() {
    return {
      chainList: "chain/list",//链列表
      tokens: "chain/{chainId}/tokens",//链上所有代币组成的列表
      buy:"buy" //购买代币
    }
  },
  address: {
    development: "https://mock.apifox.cn/m1/607677-0-default/",
    production: "https://mock.apifox.cn/m1/607677-0-default/",
    mock: "https://mock.apifox.cn/m1/607677-0-default/"
  }
})
