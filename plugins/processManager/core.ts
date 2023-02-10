import nameMappingComposable from "@/processManagers"
import { ProcessNames } from "@/helper/enum"
import type { ProcessManager,Transferable } from "~~/plugins/processManager/scheduler"

export function isTransfer(pm:unknown): pm is Transferable {
  return (<Transferable>pm).transferTo !== undefined && (<Transferable>pm).transferFrom !== undefined
}

export function getPm(managerName: ProcessNames): ProcessManager {
  let instances: ProcessManager | undefined = {} as ProcessManager;
  if (nameMappingComposable.has(managerName)) {
    instances = nameMappingComposable.get(managerName)
  }
  if (!instances) {
    throw new Error("值异常")
  }
  return instances
}

/** 链切换时候做数据转移 */
export function transferDatas(origin: ProcessNames, target: ProcessNames) {
  const originPm = getPm(origin)
  const targetPm = getPm(target)
  const originPmIsTransferable = originPm && isTransfer(originPm)
  const targetPmIsTransferable = targetPm && isTransfer(targetPm)
  const isTransferable = originPmIsTransferable && targetPmIsTransferable
  if (isTransferable) {
    const station = originPm.transferTo();
    targetPm.transferFrom(station);
  }
}