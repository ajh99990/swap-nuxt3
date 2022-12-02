<template>
  <div>我正在使用的流程管理器是：{{ pm.name }}</div>
</template>

<script setup lang="ts">
const pm = useNuxtApp().$managerScheduler.processManager
</script>
