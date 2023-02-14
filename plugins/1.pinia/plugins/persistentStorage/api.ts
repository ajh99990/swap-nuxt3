import type { _DeepPartial, PiniaPluginContext, _GettersTree } from "pinia"
import { storageHanlder } from "./storageHanlder"

/** 安装api */
export function setupApis({ store }: PiniaPluginContext) {
  const { removeItem } = storageHanlder({ prefix: store.$id })

  store.clearCache = function clearCache() {
    store.persistentStateNames.forEach((name) => removeItem(name))
  }

  store.clearCacheByName = function clearCacheByName(stateName: string | string[]) {
    const nameIsArray = Array.isArray(stateName);
    const nameSet = new Set(Object.keys(store.stateNames));
    if (nameIsArray) {
      stateName.forEach((name) => nameSet.has(name) && removeItem(name))
    } else {
      nameSet.has(stateName) && removeItem(stateName)
    }
  }
}