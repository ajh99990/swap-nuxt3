import type { ProcessManager } from "@/plugins/processManager/scheduler"
import { ProcessNames } from "@/helper/enum"
import useEth from "@/composables/useEth"
import useTron from "@/composables/useTron"

/** 所有的ProcessManager列举 */
const nameMappingComposable:Map<ProcessNames,ProcessManager> = new Map()
nameMappingComposable.set(ProcessNames.Eth,useEth())
nameMappingComposable.set(ProcessNames.Tron,useTron())

export default  nameMappingComposable