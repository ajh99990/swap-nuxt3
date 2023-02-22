import { defineService } from "~~/helper/service"
import { ErrorEntity } from "~~/helper/service/shared"
import BusinessCode from "./businessCode"


export default defineService('goplusApi', {
  api() {
    return {
      tokenSecurity:"v1/token_security/{chainId}",//首页最近交易记录
    }
  },
  address: {
    development: "https://api.gopluslabs.io/api",
    production: "https://api.gopluslabs.io/api",
    mock: "https://mock.apifox.cn/m1/607677-0-default"
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

