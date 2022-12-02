
<template>
  <div class="home-page">
    <component :is="processManager.entry" />
    <br />
    <br />
    <br />
    <br />
    <button @click="switchProcessManager">切换链</button>
  </div>
</template>

<script setup lang="ts">
import { processNames } from "@/helper/enum"
import { ComputedRef } from "vue";
import { ProcessManager } from "~~/@types";

const { changeProcessManager, ...up } = useNuxtApp().$managerScheduler
const processManager: ComputedRef<ProcessManager> = up.processManager
const switchProcessManager = () => {
  if (processManager.value.name === processNames.Eth) {
    changeProcessManager(processNames.Tron,{transfer:true})
  } else {
    changeProcessManager(processNames.Eth,{transfer:true})
  }
}
</script>
