import type { _DeepPartial, PiniaPluginContext, StateTree, _GettersTree } from "pinia"
import { localStorageHanlder, determineInitValue } from "./helper"
/**
* 按照options.persistentState返回的属性名列表从localStorage中取出缓存值，
* 并将其设置给options.state中相应的state
*/
export function setStateValueOnInit({ options, store }: PiniaPluginContext) {
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
export function saveStateValueOnChange({ options, store }: PiniaPluginContext) {
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