import { ErrorCode, SuccessCode, ServerMode, RouteParams, isObject, Api, ApiRes, ErrorEntity } from "./shared"
import consola from "consola"
import { createRequestError } from "./customError"
import type { OnRequestFail, OnRequestSuccess } from "./index"
import type { AxiosRequestConfig } from "axios"
import _ from "lodash";
/**
 * 判断接口返回的数据是否包含业务异常
 * @param obj 接口返回值
 */
function isErrorEntity(obj: ApiRes): obj is ErrorEntity {
  return obj.code !== SuccessCode.Success
}

interface HandleGeneric {
  config: AxiosRequestConfig,
  fail?: OnRequestFail,
  success?: OnRequestSuccess,
  res: ApiRes,
}

/** 统一处理网络异常和业务异常 */
export function handleGeneric({ res, config, fail, success }: HandleGeneric) {
  if (isErrorEntity(res)) {
    const error = res
    return fail ? fail(error, config) : defaultFailHandler(error)
  } else {
    return success ? success(res.data, config) : res.data
  }
}

/**
 * 默认的异常处理方法
 * 默认情况下，会使用tost展示从服务端返回的异常信息
 */
export function defaultFailHandler(error: ErrorEntity) {
  if (!error) return error;

  const code = error?.code
  const whiteList: ErrorCode[] = [ErrorCode.RepeatedRequest]
  if (whiteList.includes(code)) return error;

  if (process.client) {
    //如果发生异常就直接toast报错
    //todo 重新写
    /* let message= window.$nuxt.$i18n.locale === "zh-CN" ? error.msg : error.enMsg;
    message=message || "error"
    window.$nuxt.$toast(message); */
  }
  //开发模式下在控制台也打印异常信息
  process.env.NODE_ENV === ServerMode.Development && consola.error(error)
}


export interface ValidQueryParams {
  [x: string]: any
}
/**
 * 清除无效的params值
 * @param param 
 * @returns 
 */
export function removeInvalidValue(param: object) {
  let ret = {} as ValidQueryParams;
  if (isObject(param)) {
    Object.keys(param).forEach((key) => {
      if (param[key] || param[key] === false || param[key] === 0) {
        ret[key] = param[key];
      }
    });
  }
  return ret;
}

interface CreateQueryUrl<A> {
  apis: A,
  api: keyof A,
  baseUrl: string,
  routeParams?: RouteParams,
}

/** 将baseUrl与apiPath拼接。
 * 主要用于处理连接符"/"的问题
 */
function joinUrl(baseUrl:string,api:string):string{
  if(!_.endsWith(baseUrl, "/")){
    api=`/${api}`
  }
  return `${baseUrl}${api}`
}

export function createQueryUrl<A extends Api>({ apis, api, routeParams, baseUrl }: CreateQueryUrl<A>) {
  const url = apis[api];
  if (!url) {
    throw new Error("api地址不存在，请检查api参数填写是否正确");
  }
  const apiPath = parseUrl(url, routeParams)
  const queryUrl = joinUrl(baseUrl,apiPath);
  return queryUrl
}

/** 有些api是带路由参数的，这个方法用来将值填充到这类路由的对应位置上 */
export function parseUrl(url: string, routeParams?: RouteParams) {
  const regExp = /\{(\w+)\}/g;
  const params = url.match(regExp);
  //说明是用这个api需要填写routeParam字段
  const requiresRouteParam = params && params.length > 0
  if (requiresRouteParam) {
    if (!routeParams) {
      throw new Error("缺少指定的routeParam，请检查路由参数");
    } else {
      return url.replace(regExp, (m, n) => routeParams[n])
    }
  }
  return url
}

/** 捕获网络异常并将其格式化为 ErrorEntity*/
export function captureNetworkException(error: any): Promise<ErrorEntity> {
  let errorType = ErrorCode.Uncaught;
  if (error.__CANCEL__) {
    errorType = ErrorCode.RepeatedRequest
  }

  //开发模式下在控制台打印异常信息
  if (process.env.NODE_ENV === "development") {
    const whiteList = [ErrorCode.RepeatedRequest]
    !whiteList.includes(errorType) && consola.error(error);
  }

  return Promise.resolve(createRequestError(errorType));
}