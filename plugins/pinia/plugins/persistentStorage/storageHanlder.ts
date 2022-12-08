import { isString } from "./helper"

interface Performer {
  setItem: (name: string, value: unknown) => void,
  getItem: (name: string) => any,
  removeItem: (name: string) => void
}

interface StorageHanlder {
  prefix: string,
  performer?: Performer
}

function windowLocalStorage(): Performer {
  return {
    setItem: (name, value) => {
      if (!isString(value)) {
        const formatedValue = JSON.stringify(value)
        localStorage.setItem(name, formatedValue)
      } else {
        localStorage.setItem(name, value)
      }
    },
    getItem: (name) => {
      const value = localStorage.getItem(name)
      if (isString(value)) {
        return JSON.parse(value)
      }
      return value
    },
    removeItem: localStorage.removeItem.bind(localStorage),
  }
}

export function storageHanlder({ prefix, performer }: StorageHanlder) {
  const _performer = performer ? performer : windowLocalStorage()

  function formatItemName(name: string) {
    return `sr_${prefix}_${name}`
  }

  function setItem(name: string, value: string) {
    return _performer.setItem(formatItemName(name), value)
  }

  function getItem(name: string) {
    return _performer.getItem(formatItemName(name))
  }

  function removeItem(name: string) {
    console.log(formatItemName(name))
    return _performer.removeItem(formatItemName(name))
  }

  return {
    setItem,
    getItem,
    removeItem
  }
}