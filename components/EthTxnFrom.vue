<template>
  <div class="eth-txn-form bg-blue-100 rounded-4px pb-6px">
    <TxnForm />
    <div class="pl-8px">eth独有：<input type="text" v-model="pm.ethCustomValue.value" /></div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef } from "vue";
import type { ProcessManagerEth } from "~~/@types"
const pm = useNuxtApp().$managerScheduler.processManager as ComputedRef<ProcessManagerEth>
</script>
