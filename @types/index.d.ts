import type { ComputedRef, Ref } from "vue"
import type { Calculator } from "@/components/calculator/interface"
import type { ManagerScheduler } from "@/plugins/processManager/scheduler" 

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