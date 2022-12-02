<template>
  <div class="txn-form bg-blue-100 border-blue-300 border-width-1px rounded-4px p-6px">
    <div class="p-4px bg-blue-500 text-white">我是交易表单组件，用来演示切换流程管理器时转移数据的功能。</div>
    <ShowProcessManager class="mb-4px" />
    <div>支付数量:<input type="text" v-model="pm.payTokenCount.value" /></div>
    <div>支付币种:
      <select v-model="pm.payTokenType.value" name="tokenType">
        <option value="tokenType1">tokenType1</option>
        <option value="tokenType2">tokenType2</option>
        <option value="tokenType3">tokenType3</option>
      </select>
    </div>
    <div>接收数量:<input type="text" v-model="pm.receiveTokenCount.value" /></div>
    <div>接收币种:
      <select v-model="pm.receiveTokenType.value" name="tokenType">
        <option value="tokenType1">tokenType1</option>
        <option value="tokenType2">tokenType2</option>
        <option value="tokenType3">tokenType3</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const pm = useNuxtApp().$managerScheduler.processManager
</script>
