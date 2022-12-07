import type { _DeepPartial, PiniaPluginContext, _GettersTree } from "pinia"
import { saveStateValueOnChange, setStateValueOnInit } from "./core"

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persistentState?: (stateNames: Record<keyof S, keyof S>) => Array<Exclude<keyof S, symbol | number>>,
  }
  export interface PiniaCustomProperties<Id, S, G, A> {
    set _persistentStateNames(value: Array<Exclude<keyof S, symbol | number>>)
    get _persistentStateNames(): Array<Exclude<keyof S, symbol | number>>
    //stateNames 存储所有state的key 是个枚举。到时候如果需要清除某个state的缓存的话就需要使用到
    //clearCache 清空缓存
    //clearCacheById 清除某个state的缓存
  }
}

export default function defineStorePersistent(context: PiniaPluginContext) {
  setStateValueOnInit(context);
  saveStateValueOnChange(context);
}

