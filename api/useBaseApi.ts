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
  },
  axiosStatic:{
    headers:{'X-Custom-Header': 'foobar'}
  },
  setup(instance){
    instance.interceptors.request.use(function (config) {
      console.log("打印日志",config.url)
      return config;
    })
  }
})

