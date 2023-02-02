import type { ComputedRef } from "vue"

export interface Calculator {
  calculation: (num1: string | number) => void,
  result: ComputedRef<string>
}

declare module "~~/plugins/processManager/scheduler" {
   export interface componFuncCollectors{
    calculatorProvider?: Calculator 
  }
}