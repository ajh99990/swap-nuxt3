import { AxiosRequestConfig, Canceler } from "axios"
import axios from "axios";

/** 列表Item */
interface PaddingItem {
  key: string,
  cancel: Canceler
}

/**  config 配置项 */
interface PaddingConfig extends AxiosRequestConfig {
  url: string
  onlySend?: boolean
}

const padding: PaddingItem[] = []  // 请求队列

/**
 * 记录请求 ，在请求时，加入 onlySend：true 即可
 * @param config
 */
export function addPadding(config: PaddingConfig) {
  if (!config.onlySend) { return null }
  return config.cancelToken = new axios.CancelToken(fn => { // 存入新的请求
    if (!config.url.includes('ggmodule/v2')) { // 不在过滤url内
      padding.push({ key: config.url + '&' + config.method, cancel: fn })
    }
  })
}

/**
 * 移除队列中的请求，用与阻止重复请求项
 * @param config
 */
export function removePadding(config: PaddingConfig) {
  if (!config.onlySend) { return null }
  for (let [index, paddingElement] of padding.entries()) {
    if (paddingElement.key === config.url + '&' + config.method) {
      paddingElement.cancel()
      padding.splice(index, 1)
    }
  }
}