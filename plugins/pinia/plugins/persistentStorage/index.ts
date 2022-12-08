import type { _DeepPartial, PiniaPluginContext, _GettersTree } from "pinia"
import { saveStateValueOnChange, setStateValueOnInit } from "./core"
import { setupApis } from "./api"

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persistentState?: (stateNames: Record<keyof S, keyof S>) => Array<Exclude<keyof S, symbol | number>>,
  }
  export interface PiniaCustomProperties<Id, S, G, A> {
    /** persistentState中所有的key */
    set _persistentStateNames(value: Set<Exclude<keyof S, symbol | number>>)
    get _persistentStateNames(): Set<Exclude<keyof S, symbol | number>>

    /** state中所有的key */
    set stateNames(value: Record<Exclude<keyof S, symbol | number>, Exclude<keyof S, symbol | number>>)
    get stateNames(): Record<Exclude<keyof S, symbol | number>, Exclude<keyof S, symbol | number>>

    /** 清空缓存 */
    clearCache: () => void
    /** 
     * 清除某个state的缓存
     * @params stateName 要删除的stateName
     */
    clearCacheByName: (stateName: Exclude<keyof S, symbol | number> | Array<Exclude<keyof S, symbol | number>>) => void
  }
}

export default function defineStorePersistent(context: PiniaPluginContext) {
  setStateValueOnInit(context);
  saveStateValueOnChange(context);
  setupApis(context);
}

