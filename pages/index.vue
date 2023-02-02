
<template>
	<div class="pt-12px px-16px h-100vh">
		<HomePagesTradingBox></HomePagesTradingBox>
		<!-- <component :is="processManager.entry" />
    <button @click="switchProcessManager">切换链</button>
    <ExamplePersistentState />
		<ExampleAxios />-->
	</div>
</template>

<script setup lang="ts">
import { processNames } from "@/helper/enum";

const { changeProcessManager, processManager } = useNuxtApp().$managerScheduler;
const switchProcessManager = () => {
	if (processManager.value.name === processNames.Eth) {
		changeProcessManager(processNames.Tron, { transfer: true });
	} else {
		changeProcessManager(processNames.Eth, { transfer: true });
	}
};
</script>
