import type { ComputedRef, Ref, DefineComponent } from "vue"
import { ProcessNames } from "@/helper/enum"
import { getPm, transferDatas } from "./core"

export interface componFuncCollectors { }

export type TransferStation = Pick<ProcessManager, 'payTokenCount' | "payTokenType" | "receiveTokenCount" | "receiveTokenType">

export interface Transferable {
  transferTo: () => TransferStation
  transferFrom: (transferStation: TransferStation) => void
}

export interface ProcessManager extends componFuncCollectors {
  name: ProcessNames
  entry: any,//todo 这里不能用any 再探索下合适的类型
  payTokenType: Ref,
  payTokenCount: Ref,
  receiveTokenType: Ref,
  receiveTokenCount: Ref,
}

export interface changeProcessManagerOptions {
  transfer?: boolean,
}

export interface ManagerScheduler {
  changeProcessManager: (target: ProcessNames, options?: changeProcessManagerOptions) => void,
  processManager: ComputedRef<ProcessManager>
}

export default function (): ManagerScheduler {
  /** 当前使用的processManager的名字,值取自ProcessNames */
  const pm = ref(ProcessNames.Eth)

  const changeProcessManager = (target: ProcessNames, options?: changeProcessManagerOptions) => {
    const { transfer = false } = options || {}
    if (transfer) {
      transferDatas(processManager.value.name, target)
    }
    pm.value = target
  }

  const processManager = computed((): ProcessManager => {
    return getPm(pm.value)
  })

  return {
    /** 切换当前使用的processManager */
    changeProcessManager,
    /** processManager实例 */
    processManager
  }
}