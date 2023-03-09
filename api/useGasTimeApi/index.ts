import { defineService } from "~~/helper/service"
import { ErrorEntity } from "~~/helper/service/shared"
import BusinessCode from "./businessCode"

export default await defineService('gasTimeApi', {
  api() {
    return {
      feeList:"eth/tx/fee/list",//首页最近交易记录
    }
  },
  address: {
    development: "https://uutoken.giantdt.com/api/",
    production: "https://uutoken.giantdt.com/api/",
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

// instance.interceptors.request.use(function (config) {
//   console.log("打印日志",config.url)
//   return config;
// })

// export default instance
