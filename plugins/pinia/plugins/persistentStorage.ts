import type { _DeepPartial, PiniaPluginContext, StateTree, _GettersTree } from "pinia"

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persistentState?: (stateNames: Record<keyof S, keyof S>) => Array<Exclude<keyof S, symbol | number>>,
  }
  export interface PiniaCustomProperties<Id, S, G, A> {
    set _persistentStateNames(value: Array<Exclude<keyof S, symbol | number>>)
    get _persistentStateNames(): Array<Exclude<keyof S, symbol | number>>
  }
}

interface determineInitValueParams {
  localStorageValue: string | null,
  defaultValue: any
}

interface localStorageHanlderParams {
  prefix: string,
}



function localStorageHanlder({ prefix }: localStorageHanlderParams) {
  function formatItemName(name: string) {
    return `sr_${prefix}_${name}`
  }
  function setItemToLocalStorage(name: string, value: string) {
    return localStorage.setItem(formatItemName(name), value)
  }

  function getItemFromLocalStorage(name: string) {
    return localStorage.getItem(formatItemName(name))
  }

  return {
    setItemToLocalStorage,
    getItemFromLocalStorage
  }
}


/** 确定缓存状态的初始值
 * 规则是：优先使用localStorage中的值，其次是state中的默认值
 */
function determineInitValue({ localStorageValue, defaultValue }: determineInitValueParams) {
  if (localStorageValue) {
    localStorageValue = JSON.parse(localStorageValue)
  }
  return localStorageValue || defaultValue
}
/**
 * 按照options.persistentState返回的属性名列表从localStorage中取出缓存值，
 * 并将其设置给options.state中相应的state
 */
function setStateValueOnInit({ options, store }: PiniaPluginContext) {
  if (!options.state || !options.persistentState) return;

  const { getItemFromLocalStorage } = localStorageHanlder({ prefix: store.$id })
  let patchTargets = {} as _DeepPartial<StateTree>

  const originStates = options.state()
  const stateNames = Object.keys(originStates).reduce((nameCollector, name) => {
    nameCollector[name] = name
    return nameCollector
  }, {} as { [x: string]: string })
  const persistentStates = options.persistentState(stateNames)
  store._persistentStateNames = persistentStates

  for (let i = 0; i < persistentStates.length; i++) {
    const stateName = persistentStates[i]
    const defaultValue = originStates[stateName];
    const localStorageValue = getItemFromLocalStorage(stateName)
    const initValue = determineInitValue({ defaultValue, localStorageValue })
    patchTargets[stateName] = initValue
  }

  store.$patch(patchTargets)
}

/**
 * state变化时将更新localStorage
 */
function saveStateValueOnChange({ options, store }: PiniaPluginContext) {
  store.$subscribe((mutation, state) => {
    const { setItemToLocalStorage } = localStorageHanlder({ prefix: store.$id })
    const psn = store._persistentStateNames
    if (!psn) return;
    for (let i = 0; i < psn.length; i++) {
      const stateName = psn[i]
      setItemToLocalStorage(stateName, JSON.stringify(state[stateName]))
    }
  })
}

export default function defineStorePersistent(context: PiniaPluginContext) {
  setStateValueOnInit(context);
  saveStateValueOnChange(context);
}

