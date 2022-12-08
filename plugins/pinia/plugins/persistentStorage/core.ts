import type { _DeepPartial, PiniaPluginContext, StateTree, _GettersTree } from "pinia"
import { storageHanlder } from "./storageHanlder"
/**
* 按照options.persistentState返回的属性名列表从localStorage中取出缓存值，
* 并将其设置给options.state中相应的state
*/
export function setStateValueOnInit({ options, store }: PiniaPluginContext) {
  if (!options.state || !options.persistentState) return;

  const { getItem } = storageHanlder({ prefix: store.$id })
  let patchTargets = {} as _DeepPartial<StateTree>

  const originStates = options.state()
  const stateNames = Object.keys(originStates).reduce((nameCollector, name) => {
    nameCollector[name] = name
    return nameCollector
  }, {} as { [x: string]: string })
  const persistentStates = options.persistentState(stateNames)
  store.persistentStateNames = new Set(persistentStates)
  store.stateNames = stateNames
  for (let i = 0; i < persistentStates.length; i++) {
    const stateName = persistentStates[i]
    const defaultValue = originStates[stateName];
    const storageValue = getItem(stateName)
    const initValue = storageValue || defaultValue
    patchTargets[stateName] = initValue
  }

  store.$patch(patchTargets)
}

/**
 * state变化时将更新localStorage
 */
export function saveStateValueOnChange({ options, store }: PiniaPluginContext) {
  store.$subscribe((mutation, state) => {
    const { setItem } = storageHanlder({ prefix: store.$id })
    const psn = store.persistentStateNames
    if (psn.size <= 0) return;
    for (let name of psn) {
      setItem(name, JSON.stringify(state[name]))
    }
  })
}