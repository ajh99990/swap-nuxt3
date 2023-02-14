import type { ComputedRef, Ref } from "vue"
import type { Calculator } from "@/components/calculator/interface"
import type { ManagerScheduler } from "~~/plugins/2.processManager/scheduler" 

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

declare global {
  interface Window {
    ethereum: any,
    tronWeb: any
  }
}

export { }