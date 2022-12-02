import type { Ref,ComputedRef } from "vue"

export interface Calculator {
  calculation: (num1: string | number) => void,
  result: ComputedRef<string>
}