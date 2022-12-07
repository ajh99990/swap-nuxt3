interface localStorageHanlderParams {
  prefix: string,
}

interface determineInitValueParams {
  localStorageValue: string | null,
  defaultValue: any
}


export function localStorageHanlder({ prefix }: localStorageHanlderParams) {
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
export function determineInitValue({ localStorageValue, defaultValue }: determineInitValueParams) {
  if (localStorageValue) {
    localStorageValue = JSON.parse(localStorageValue)
  }
  return localStorageValue || defaultValue
}