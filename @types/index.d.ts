import type { ComputedRef, Ref } from "vue"
import type { Calculator } from "@/components/calculator/interface"
import type { ManagerScheduler } from "@/plugins/processManager/scheduler" 
export interface ProcessManager {
  name: processNames
  entry: DefineComponent,
  payTokenType:Ref,
  payTokenCount:Ref,
  receiveTokenType:Ref,
  receiveTokenCount:Ref,

  calculatorProvider?: Calculator
}

export interface ProcessManagerEth extends ProcessManager,Transferable{
  ethCustomValue:Ref,
}

export interface ProcessManagerTron extends ProcessManager,Transferable{
}

export type TransferStation = Pick<ProcessManager,'payTokenCount' | "payTokenType" | "receiveTokenCount" | "receiveTokenType">
export interface Transferable{
  transferTo:()=>TransferStation
  transferFrom:(transferStation:TransferStation)=>void
}

declare module '#app' {
  interface NuxtApp {
    $managerScheduler : ManagerScheduler
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $managerScheduler : ManagerScheduler
  }
}



export { }