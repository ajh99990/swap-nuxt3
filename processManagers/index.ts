import type { ProcessManager } from "~~/plugins/processManager/scheduler"
import { ProcessNames } from "@/helper/enum"
import useEth from "./useEth"
import useTron from "./useTron"

/** 所有的ProcessManager列举出来 */
const nameMappingComposable: Map<ProcessNames, ProcessManager> = new Map()
nameMappingComposable.set(ProcessNames.Eth, useEth())
nameMappingComposable.set(ProcessNames.Tron, useTron())

export default nameMappingComposable