export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)
export const isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

export const isDate = (val: unknown): val is Date => val instanceof Date
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export enum ServerMode {
  Development = "development",
  Production = "production",
  Mock = "mock"
}

export enum ErrorCode {
  /** 重复发送相同请求时，若前一个请求完成前被取消则会引发此错误 */
  RepeatedRequest = 901,
  /** 意料之外的异常 */
  Uncaught = 999
}

export interface ErrorEntity {
  code: ErrorCode | number,
  msg?: string,
  enMsg?: string
}

export enum SuccessCode {
  Success = 0,
}

export interface SuccessEntity {
  code: SuccessCode | number,
  data: any,
  [key: string]: any
}

export type ApiRes = ErrorEntity | SuccessEntity;




export type BusinessCode = typeof ErrorCode | typeof SuccessCode

export interface RouteParams { [x: string]: any }

export interface Api {
  [x: string]: string
}


