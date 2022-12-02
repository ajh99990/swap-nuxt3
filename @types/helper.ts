import type { Transferable } from "./index"

export function isTransfer(pm:unknown): pm is Transferable {
  return (<Transferable>pm).transferTo !== undefined && (<Transferable>pm).transferFrom !== undefined
}