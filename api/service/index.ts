import type { AxiosRequestConfig, AxiosResponse,CreateAxiosDefaults,AxiosInstance } from "axios"
import axios from "axios"
import _ from 'lodash'
import { ServerMode, RouteParams, Api, SuccessEntity, ErrorEntity, ApiRes } from "./shared"
import { addPadding, removePadding } from "./repeated"
import { removeInvalidValue, handleGeneric, createQueryUrl, captureNetworkException } from "./pureFunc";
//const JSONbig = require("json-bigint")({ storeAsString: true });

export type StringMap<T> = Record<keyof T, keyof T>

export interface MaterialProvider<A> {
  mode: typeof ServerMode,
  api: StringMap<A>
}

export interface OnRequestComplete {
  (res: any, config: AxiosRequestConfig): void
}
export interface OnRequestFail {
  (res: ErrorEntity, config: AxiosRequestConfig): void
}
export interface OnRequestSuccess {
  (res: any, config: AxiosRequestConfig): void,
}


//todo 和helper中的声明重复了
export interface RequestConfig<A> extends AxiosRequestConfig {
  api: keyof A,
  routeParams?: RouteParams,
  onlySend?: boolean,
  fail?: OnRequestFail,
  success?: OnRequestSuccess,
  complete?: OnRequestComplete,
}


export interface OptionSetup<A> {
  (materialProvider: MaterialProvider<A>): RequestConfig<A>
}

export interface ServiceMethod<A> {
  get: (optionSetup: OptionSetup<A>) => Promise<any>
  post: (optionSetup: OptionSetup<A>) => Promise<any>
  put: (optionSetup: OptionSetup<A>) => Promise<any>
  delete: (optionSetup: OptionSetup<A>) => Promise<any>
  patch: (optionSetup: OptionSetup<A>) => Promise<any>
}
export interface Service<A> extends ServiceMethod<A>, Pick<AxiosInstance,Exclude<keyof AxiosInstance, keyof ServiceMethod<A>>> {}



export interface ServiceAddress {
  development: string,
  production: string,
  mock: string
}
export interface DefineServiceOption<A> {
  api: () => A,
  address: ServiceAddress,
  axiosStatic?:CreateAxiosDefaults
}

export type method = "get" | "post" | "delete" | "put" | "patch"

/** 构建materialProvider
 * 目的是为用户使用"get"、"post"等方法时提供一些支持
 */
function materialProviderBuilder<A extends Api>(options: DefineServiceOption<A>): MaterialProvider<A> {
  const apiCollector = options.api();//这里返回了一个api对象

  const apiNames = Object.keys(apiCollector).reduce((nameCollector, name: keyof A) => {
    nameCollector[name] = name
    return nameCollector
  }, {} as StringMap<A>)

  const materialProvider: MaterialProvider<A> = {
    api: apiNames,
    mode: ServerMode
  }
  return materialProvider
}

export function defineService<Id extends string, A extends Api>(id: Id, options: DefineServiceOption<A>): Service<A> {
  //将实例挂载到nuxt上。避免重复创建实例
  const nuxtApp = useNuxtApp();
  let service = nuxtApp[id] as Service<A>;
  if (service) {
    return service
  }
  service = {} as Service<A>;
  nuxtApp.provide(id, service)

  const axiosStatic = options?.axiosStatic||{}
  const instance = axios.create(axiosStatic) //todo 这个构建过程应该接受一些axios的实例化参数
  const methods: Array<method> = ["get", "post", "delete", "put", "patch"];
  const env = (process.env.NODE_ENV || ServerMode.Development) as ServerMode
  const serviceAddress = options.address
  const baseUrl: string = serviceAddress[env]
  const apiCollector = options.api();//这里返回了一个api对象 
  //执行configBulder，并将api、枚举等数据传递过去
  const materialProvider = materialProviderBuilder(options)

  methods.forEach((method) => {
    service[method] = async (optionSetup: OptionSetup<A>) => {
      //拿到用户填写的请求数据
      const config = optionSetup(materialProvider);
      let { api, routeParams, params, fail, success, complete, ...otherConfig } = config;

      //组装axios的请求对象
      let url = createQueryUrl({ apis: apiCollector, api, routeParams, baseUrl });
      params = removeInvalidValue(params)
      /* const transformResponse = [
        function (data: any) {
          return JSONbig.parse(data);
        },
      ] */
      const requestConfig = { ...otherConfig, method, url, /* transformResponse, */ params };

      //阻止重复请求
      removePadding(requestConfig);
      addPadding(requestConfig);

      //发送请求
      let res = await instance
        .request(requestConfig)
        .then((res: AxiosResponse<SuccessEntity>) => (res.data))
        .catch(captureNetworkException)
        .then((res) => handleGeneric({ res, config: requestConfig, fail, success }))
        .then((res) => complete ? complete(res, requestConfig) : res);
      return res;
    }
  });

  return  {...instance,...service} 
}