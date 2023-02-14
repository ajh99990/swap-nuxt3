import persistentStorage from "./plugins/persistentStorage"
export default defineNuxtPlugin(({$pinia}) => {
  $pinia.use(persistentStorage)
})