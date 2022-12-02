import useScheduler from "./scheduler"
export default defineNuxtPlugin((nuxtApp) => {
  const managerScheduler = useScheduler()
  nuxtApp.provide('managerScheduler', managerScheduler)
})

