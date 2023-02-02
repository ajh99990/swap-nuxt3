
<template>
  <div class="calculator bg-red-100 border-red-300 border-width-1px rounded-4px p-6px">
    <div class="p-4px bg-red-500 text-white">我是计算器组件，用来演示架构的基础能力。</div>
    <ShowProcessManager class="mb-4px"/>
    <input v-model="inputValue" type="text" /> <button @click="handleClick">计算</button>
    <div>{{ calculatorProvider?.result }}</div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from "vue";
import { ProcessManager } from "@/plugins/processManager/scheduler";

const pm: ComputedRef<ProcessManager> = useNuxtApp().$managerScheduler.processManager
const calculatorProvider = computed(() => {
  const calculatorProvider = pm.value.calculatorProvider
  if (!calculatorProvider) {
    throw new Error(`流程管理器${pm.value.name}上不存在calculatorProvider`)
  }
  return calculatorProvider
})

const inputValue = ref("")
const handleClick = () => { calculatorProvider.value.calculation(inputValue.value) }
</script>
