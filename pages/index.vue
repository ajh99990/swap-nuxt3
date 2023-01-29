
<template>
  <div class="home-page pb-200px">
    <component :is="processManager.entry" />
    <br />

    <button @click="switchProcessManager">切换链</button>
    <br />
    <br />
    <br />
    <br />
     <ExamplePersistentState />
     
    <ExampleAxios />
  </div>
</template>

<script setup lang="ts">
import { processNames } from "@/helper/enum"

const { changeProcessManager, processManager } = useNuxtApp().$managerScheduler
const switchProcessManager = () => {
  if (processManager.value.name === processNames.Eth) {
    changeProcessManager(processNames.Tron, { transfer: true })
  } else {
    changeProcessManager(processNames.Eth, { transfer: true })
  }
}
</script>
