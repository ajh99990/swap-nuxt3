
<template>
  <div class="home-page pb-200px">
    <button @click="switchProcessManager">切换链</button>
    <component :is="processManager.entry" />
    <h5>测试本地存储</h5>
    <ExamplePersistentState />
    <br />
    <h5>测试接口请求</h5>
    <ExampleAxios />
  </div>
</template>

<script setup lang="ts">
import { ProcessNames } from "@/helper/enum";

const { changeProcessManager, processManager } = useNuxtApp().$managerScheduler;
const switchProcessManager = () => {
  if (processManager.value.name === ProcessNames.Eth) {
    changeProcessManager(ProcessNames.Tron, { transfer: true });
  } else {
    changeProcessManager(ProcessNames.Eth, { transfer: true });
  }
};
</script>
