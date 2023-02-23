import { defineService } from "~~/helper/service"
import { ErrorEntity } from "~~/helper/service/shared"
import BusinessCode from "./businessCode"


export default await defineService('goplusApi', {
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
    instance.interceptors.response.use( function(response){
      response.data.data = response.data.result
      return response
    });
  }
})

