import { processNames } from "@/helper/enum"
import type { ProcessManager } from "~~/@types"
import { isTransfer } from "~~/@types/helper"
import useEth from "@/composables/useEth"
import useTron from "@/composables/useTron"
import type { Ref, ComputedRef } from "vue"

export interface changeProcessManagerOptions {
  transfer?: boolean,
}

export interface ManagerScheduler {
  pm: Ref<processNames>,
  changeProcessManager: (target: processNames, options?: changeProcessManagerOptions) => void,
  processManager: ComputedRef<ProcessManager>
}

function nameMappingUse (name: processNames): ProcessManager{
  if (name === processNames.Eth) {
    return useEth()
  } else {
    return useTron()
  }
}

const managerStorage = new Map<string, ProcessManager>();
function getPm(managerName:processNames):ProcessManager{
  let instances: ProcessManager | undefined = {} as ProcessManager;
    if (managerStorage.has(managerName)) {
      instances = managerStorage.get(managerName)
    } else {
      instances = nameMappingUse(managerName)
      managerStorage.set(managerName, instances)
    }
    if (!instances) {
      throw new Error("值异常")
    }
    return instances
}

/** 链切换时候做数据转移 */
function transferDatas(origin: processNames, target: processNames) {
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

export default function (): ManagerScheduler {
  const pm = ref(processNames.Eth)

  const changeProcessManager = (target: processNames, options?: changeProcessManagerOptions) => {
    const { transfer = false} = options || {}
    if (transfer) {
      transferDatas(processManager.value.name, target)
    }
    pm.value = target
  }

  const processManager = computed((): ProcessManager => {
    return  getPm(pm.value)
  })

  return {
    pm,
    changeProcessManager,
    processManager
  }
}